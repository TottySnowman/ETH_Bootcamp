const { ethers, upgrades } = require("hardhat");

async function main() {
  const TradingContract = await ethers.getContractFactory("TradingV2");
  const proxy = await upgrades.deployProxy(TradingContract);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );

  console.log("Proxy contract address: " + proxy.address);

  console.log("Implementation contract address: " + implementationAddress);
}

main();
