const mongoose = require('mongoose');

const CIDSchema = new mongoose.Schema({
  id: String,
  cid: String,
});

module.exports = mongoose.model('CID', CIDSchema);
