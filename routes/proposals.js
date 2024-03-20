const express = require('express');
// const proposalsHandler = require('../handlers/proposalsHandler');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Endpoint to upload data to IPFS
router.post('/', async (req, res) => {
  try {
    const formData = new FormData();
    const file = fs.createReadStream('../jayHello.txt');
    formData.append('file', file);
    formData.append(
      'pinataMetadata',
      JSON.stringify({
        name: 'proposal name',
        description: 'File description',
        age: 24,
      })
    );
    formData.append(
      'pinataOptions',
      JSON.stringify({
        cidVersion: 1,
      })
    );

    // Log request details
    console.log(
      'Request URL:',
      'https://api.pinata.cloud/pinning/pinFileToIPFS'
    );

    console.log('Request Headers:', {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      Authorization: `Bearer ${JWT}`,
    });
    console.log('Request FormData:', formData);

    const JWT = process.env.PINATA_JWT;

    const uploadRes = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    const cid = await prisma.cid.create({
      data: {
        cid: uploadRes.data.IpfsHash,
      },
    });
    console.log(cid);

    res.json({ cid: uploadRes.data.IpfsHash });
  } catch (error) {
    console.error(
      'Error uploading file to IPFS:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;