const mongoose = require('mongoose');
const objId = mongoose.Schema.Types.ObjectId;

const internSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  collegeId: {
    type: objId,
    ref: "collegeList",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{timestamp : true});

module.exports = mongoose.modelNames('internList',internSchema)