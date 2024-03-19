const { create } = require('ipfs-http-client');

async function ipfsClient() {
  const ipfs = create({
    host: 'ipf.infura.io',
    port: 5001,
    protocol: 'https',
  });
  return ipfs;
}

async function saveText() {
  let ipfs = await ipfsClient();

  let Greet = await ipfs.add('hello');

  console.log(Greet);
}
saveText();
