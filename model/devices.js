const mongoose = require("mongoose");

const addDeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  control: {
    type: Object,
    required: true,
  },
});

module.exports = devices = mongoose.model("devices", addDeviceSchema);
