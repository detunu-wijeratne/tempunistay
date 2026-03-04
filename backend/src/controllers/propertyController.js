const Property = require('../models/Property');

// @GET /api/properties - public listing
const getProperties = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, available, search, page = 1, limit = 12 } = req.query;
    const filter = { status: 'active' };

    if (type) filter.type = type;
    if (available === 'true') filter.isAvailable = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(filter).populate('owner', 'firstName lastName').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Property.countDocuments(filter),
    ]);

    res.json({ success: true, data: properties, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/properties/:id
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'firstName lastName email phone');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/properties/my - landlord's own properties
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/properties
const createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, owner: req.user._id });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found or not authorized' });
    Object.assign(property, req.body);
    await property.save();
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found or not authorized' });
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProperties, getProperty, getMyProperties, createProperty, updateProperty, deleteProperty };
