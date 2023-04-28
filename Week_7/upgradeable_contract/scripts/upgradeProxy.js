const { ethers, upgrades } = require('hardhat');
const proxyAddress = '0xfE43B6c18B917f38Ac17A9e2040d4652B790c5F8';

async function main() {
  const VendingMachineV5 = await ethers.getContractFactory('VendingMachineV5');
  const upgraded = await upgrades.upgradeProxy(proxyAddress, VendingMachineV5);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log("The current contract owner is: " + await upgraded.owner());
  console.log('Implementation contract address: ' + implementationAddress);
}

main();