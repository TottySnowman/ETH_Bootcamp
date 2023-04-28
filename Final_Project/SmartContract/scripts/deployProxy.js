const { ethers, upgrades } = require('hardhat');

async function main() {
  const VendingMachineV3 = await ethers.getContractFactory('VendingmachineV3');
  const proxy = await upgrades.deployProxy(VendingMachineV3, [100]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );

  console.log('Proxy contract address: ' + proxy.address);

  console.log('Implementation contract address: ' + implementationAddress);
}

main();