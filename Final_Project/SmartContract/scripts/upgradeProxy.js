const { ethers, upgrades } = require('hardhat');
const proxyAddress = '0x9F5aD1F38b1Ad414ba502ef1f3d5002f58a729B0';

async function main() {
  const upgradeContract = await ethers.getContractFactory('VendingmachineV4');
  const upgraded = await upgrades.upgradeProxy(proxyAddress, upgradeContract);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log("The current contract owner is: " + await upgraded.owner());
  console.log('Implementation contract address: ' + implementationAddress);
}

main();