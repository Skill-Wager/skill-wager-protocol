# Smart Contract Deployment Guide

This guide outlines the steps to compile and deploy the Skill Wager smart contracts to a local development network.

## Prerequisites

Ensure your environment is set up by creating a `.env` file in the root directory. You can use `.env.example` as a template:

```bash
cp .env.example .env
```

## 1. Compile Contracts

Run Hardhat to compile `OmniEscrow.sol` and the Mock ERC20 token:

```bash
npm run compile
```

## 2. Local Node Testing

To test the contracts locally, start a standalone Hardhat network node in one terminal:

```bash
npx hardhat node
```

In a second terminal, execute the deployment script against your local node:

```bash
npm run deploy:local
```

This will output the addresses for both the Mock `$PLAY` token and the `OmniEscrow` contract.

## 3. Testnet Deployment (Mumbai)

To deploy to a live testnet, ensure `PRIVATE_KEY` and `MUMBAI_RPC_URL` are populated in your `.env` file, then run:

```bash
npx hardhat run scripts/deploy.js --network polygon_mumbai
```
