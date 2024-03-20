const express = require('express');
const axios = require('axios');
require('dotenv').config();

const proposalRoutes = require('./routes/proposals.js');
const voteRoutes = require('./routes/votes.js');
const signatureRoutes = require('./routes/signatures.js');

const JWT = process.env.PINATA_JWT;

const FormData = require('form-data');
const fs = require('fs');

const app = express();

app.use('/proposals', proposalRoutes);
app.use('/votes', voteRoutes);
app.use('/signatures', signatureRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const { create } = require('domain');
// const express = require('express');
// const multer = require('multer');

// const app = express();
// const upload = multer(); //first endpoint

// app.use(express.json()); //second endpoint

// async function createNode() {
//   const { createHelia } = await import('helia');
//   const { unixfs } = await import('@helia/unixfs');
//   const helia = await createHelia();
//   const fs = unixfs(helia);
//   return fs;
// }

// app.post('/upload', upload.single('file'), async (req, res) => {
//   const fs = await createNode();
//   const data = req.file.buffer;
//   const cid = await fs.addBytes(data);

//   res.status(201).send('Your file is uploaded');
// });

// app.fetch(async (req, res) => {});

// const { create } = require('ipfs-http-client');
// import { create } from '@web3-storage/w3up-client';
// import { PrismaClient } from '@prisma/client/edge';

// const prisma = new PrismaClient();

// const client = await create();

// await client.login('jayanth.sms.in@gmail.com');

// async function ipfsClient() {
//   const ipfs = create({
//     host: 'ipf.infura.io',
//     port: 5001,
//     protocol: 'https',
//   });
//   return ipfs;
// }

// async function saveText() {
//   let ipfs = await ipfsClient();

//   let Greet = await ipfs.add('hello');

//   console.log(Greet);
// }
// saveText();
