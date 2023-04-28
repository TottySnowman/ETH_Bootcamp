
const hre = require("hardhat");

async function main() {
    const contract = await hre.ethers.getContractAt("Winner", "0x531978e2ECF017C12208AeE1de6053409EB625D1");
    const tx = await contract.SendAttempt();

    await tx.wait();
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });