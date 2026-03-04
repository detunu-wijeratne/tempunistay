const Message = require('../models/Message');
const Payment = require('../models/Payment');

// --- Messages ---
const sendMessage = async (req, res) => {
  try {
    const message = await Message.create({ ...req.body, sender: req.user._id });
    await message.populate(['sender', 'receiver']);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).populate('sender', 'firstName lastName avatar').sort('createdAt');
    await Message.updateMany({ sender: userId, receiver: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'firstName lastName avatar role')
      .populate('receiver', 'firstName lastName avatar role')
      .sort('-createdAt');

    const conversations = {};
    messages.forEach((msg) => {
      const partner = msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
      const key = partner._id.toString();
      if (!conversations[key]) {
        conversations[key] = { partner, lastMessage: msg, unreadCount: 0 };
      }
      if (!msg.isRead && msg.receiver._id.toString() === req.user._id.toString()) {
        conversations[key].unreadCount++;
      }
    });

    res.json({ success: true, data: Object.values(conversations) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Payments ---
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ paidBy: req.user._id }, { paidTo: req.user._id }],
    })
      .populate('paidBy', 'firstName lastName email')
      .populate('paidTo', 'firstName lastName email')
      .sort('-createdAt');
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      paidBy: req.user._id,
      status: req.body.status || 'pending',
      paidAt: new Date(),
    });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('paidBy', 'firstName lastName email');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getConversation, getInbox, getMyPayments, createPayment, updatePaymentStatus };
