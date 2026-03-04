const ServiceRequest = require('../models/ServiceRequest');

const createRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.create({ ...req.body, student: req.user._id });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ student: req.user._id })
      .populate('assignedTo', 'firstName lastName')
      .sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const requests = await ServiceRequest.find(filter)
      .populate('student', 'firstName lastName phone')
      .populate('assignedTo', 'firstName lastName')
      .sort('-createdAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.body.status === 'completed') updates.completedAt = new Date();
    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRequest, getMyRequests, getAllRequests, updateRequestStatus, cancelRequest };
