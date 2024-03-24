// routes/voteRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT = process.env.PINATA_JWT;

router.post('/', async (req, res) => {
  try {
    const voteArray = req.body.votes; // Assuming the request body contains a field named "votes" which is an array of vote objects
    const voteDataArray = voteArray.map((vote) => ({
      voterName: vote.voterName,
      vote: vote.vote,
      signature: vote.signature,
      proposalCID: vote.proposalCID,
    }));
    // Upload JSON data to IPFS
    const uploadRes = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      voteDataArray,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    console.log('Response:', uploadRes.data);

    // Save CID to Prisma database
    const savedCID = await prisma.voteCID.create({
      data: {
        CID: uploadRes.data.IpfsHash,
      },
    });

    // Send response
    res.json({ cid: uploadRes.data.IpfsHash });
  } catch (error) {
    console.error('Error uploading JSON data to IPFS:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
