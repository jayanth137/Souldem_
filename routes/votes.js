// routes/voteRoutes.js
const express = require('express');
const router = express.Router();
const Vote = require('../model/Vote');
const IPFS = require('../config/ipfs'); // Assuming you have a module to interact with IPFS

// Endpoint to store votes for a proposal in IPFS
router.post('/:proposalId', async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { votedBy, isApproved } = req.body;

    // Save vote to MongoDB
    const vote = await Vote.create({
      proposalId,
      votedBy,
      isApproved,
    });

    // Fetch votes associated with the proposal from MongoDB
    const votes = await Vote.find({ proposalId });

    // Save votes data to IPFS
    const ipfsHash = await IPFS.saveVotesToIPFS(votes); // Assuming you have a method to save data to IPFS

    res.json({ ipfsHash });
  } catch (error) {
    console.error('Error storing votes for proposal in IPFS:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
