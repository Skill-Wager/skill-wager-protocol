const hre = require("hardhat");

async function main() {
  console.log("Starting deployment process...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy Mock PLAY Token for development
  console.log("Deploying MockERC20 ($PLAY)...");
  const MockToken = await hre.ethers.getContractFactory("MockERC20");
  const playToken = await MockToken.deploy("Play Token", "PLAY");
  await playToken.waitForDeployment();
  const playTokenAddress = await playToken.getAddress();
  console.log("$PLAY Token deployed to:", playTokenAddress);

  // 2. Deploy OmniEscrow
  // Use deployer address as the treasury for local testing
  const treasuryAddress = process.env.TREASURY_WALLET_ADDRESS || deployer.address;
  console.log("Deploying OmniEscrow...");
  
  const OmniEscrow = await hre.ethers.getContractFactory("OmniEscrow");
  const omniEscrow = await OmniEscrow.deploy(playTokenAddress, treasuryAddress);
  await omniEscrow.waitForDeployment();
  const escrowAddress = await omniEscrow.getAddress();

  console.log("=========================================");
  console.log("✅ OmniEscrow deployed to:", escrowAddress);
  console.log("✅ Treasury Address set to:", treasuryAddress);
  console.log("=========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
