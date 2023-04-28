const { ethers } = require('hardhat');
async function main(){
    const Snowmantoken = await ethers.getContractFactory('SnowmanToken');
    const nft = await Snowmantoken.deploy();
    await nft.deployed();

    console.log("Nft_Contract is deployed to address", nft.address);
    const signer0 = await ethers.provider.getSigner(0);
  // update the IPFS CID to be your metadata CID
  await nft.safeMint(await signer0.getAddress(), "ipfs://QmPWXKhu8FC5PMuJSEu1h7pab6gTHKyzseeWer1rxfLsVh");

  console.log("NFT Minted!");
}

main().then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});