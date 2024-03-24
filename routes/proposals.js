const express = require('express');
// // const proposalsHandler = require('../handlers/proposalsHandler');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT = process.env.PINATA_JWT;

// Endpoint to upload data to IPFS
router.post('/', async (req, res) => {
  try {
    const { title, description, content, createdBy } = req.body;

    const proposalData = {
      title,
      description,
      content,
      createdBy,
    };

    // Upload JSON data to IPFS
    const uploadRes = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      proposalData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    console.log('Response:', uploadRes.data);

    // Save CID to Prisma database
    const savedCID = await prisma.proposalCID.create({
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

// Endpoint to retrieve data from IPFS using CID
router.get('/:cid', async (req, res) => {
  try {
    // Extract CID from request parameters
    const { cid } = req.params;

    // Retrieve data associated with the CID from Prisma database
    const cidData = await prisma.proposalCID.findFirst({
      where: {
        CID: cid,
      },
    });

    if (!cidData) {
      return res.status(404).json({ error: 'CID not found' });
    }

    // Respond with the JSON data associated with the CID
    res.json(cidData);
  } catch (error) {
    console.error('Error retrieving data from Prisma:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
