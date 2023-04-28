const { ethers, upgrades } = require("hardhat");
const proxyAddress = "0xC53dB82133CC0a659B7bB099b859FaE81A344d77";

async function main() {
  //const upgradeContract = await ethers.getContractFactory("TradingV2");
  const upgradeContract = await ethers.getContractFactory(
    "contracts/TradingV2.sol:TradingV2"
  );
  const upgraded = await upgrades.upgradeProxy(proxyAddress, upgradeContract);

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log("The current contract owner is: " + (await upgraded.owner()));
  console.log("Implementation contract address: " + implementationAddress);
}

main();
