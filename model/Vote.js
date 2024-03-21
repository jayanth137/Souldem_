// models/Vote.js
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true,
  },
  votedBy: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
  },
});

module.exports = mongoose.model('Vote', voteSchema);
