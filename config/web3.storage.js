// web3.storage.js
import('@web3-storage/w3up-client').then(({ create }) => {
  // Your code that uses Web3Storage goes here
  async function main() {
    try {
      const client = await create();
      const space = await client.createSpace('ipfs');
      const myAccount = await client.login('jayanth.sms.in@gmail.com');

      await myAccount.provision(
        space.did('z6MkrbzTjAYgHwanjXFcd92iHgE9avMAF3zD4devufZBHUzh')
      );
    } catch (e) {
      console.error(e);
    }
  }

  main();
});

// Initialize the Web3Storage client with your API token
