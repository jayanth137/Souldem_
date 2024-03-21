const IPFS = require('ipfs-http-client');

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

module.exports.saveVotesToIPFS = async (votes) => {
  const buffer = Buffer.from(JSON.stringify(votes));
  const { cid } = await ipfs.add(buffer);
  return cid.toString();
};
