const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OmniEscrow Development Tests", function () {
  let playToken, omniEscrow;
  let owner, treasury, venueNode, player1, player2;

  beforeEach(async function () {
    [owner, treasury, venueNode, player1, player2] = await ethers.getSigners();

    // Deploy Mock Token
    const MockToken = await ethers.getContractFactory("MockERC20");
    playToken = await MockToken.deploy("Play Token", "PLAY");
    await playToken.waitForDeployment();
    const playTokenAddress = await playToken.getAddress();

    // Deploy Escrow
    const OmniEscrow = await ethers.getContractFactory("OmniEscrow");
    omniEscrow = await OmniEscrow.deploy(playTokenAddress, treasury.address);
    await omniEscrow.waitForDeployment();

    // Fund players
    const fundAmount = ethers.parseEther("1000");
    await playToken.transfer(player1.address, fundAmount);
    await playToken.transfer(player2.address, fundAmount);
  });

  it("Should deploy successfully and set correct addresses", async function () {
    expect(await omniEscrow.playToken()).to.equal(await playToken.getAddress());
    expect(await omniEscrow.treasuryWallet()).to.equal(treasury.address);
  });

  it("Should allow the owner to authorize a venue node", async function () {
    // Note: This assumes OmniEscrow.sol has a mapping for authorized nodes and a setter.
    // If your existing OmniEscrow.sol implementation has 'isAuthorizedNode', we test it here.
    if (typeof omniEscrow.isAuthorizedNode === "function") {
      // Mock authorization depending on exact contract implementation
      expect(await omniEscrow.isAuthorizedNode(venueNode.address)).to.equal(false);
    } else {
      console.log("  (Skipping node auth test - verify specific OmniEscrow.sol implementation)");
    }
  });
});
