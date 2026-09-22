# 🕹️ Skill Wager: Development Environment

This is the developer-focused repository for the Skill Wager Protocol. It contains the essential configuration, scripts, and smart contracts required to bootstrap the local environment.

## 🚀 Quick Start Guide

### 1. Install Dependencies

Install all required NPM packages, including Hardhat and OpenZeppelin:

```bash
npm install
```

### 2. Environment Setup

Create your local environment variables file:

```bash
cp .env.example .env
```

### 3. Smart Contracts

Compile the Solidity contracts and run the unit test suite:

```bash
npm run compile
npm test
```

### 4. Venue Node Simulator

To test local ePurse connectivity, start the mock WebSocket Venue Daemon:

```bash
npm run start:venue
```

The daemon will listen for incoming WebSockets on `ws://localhost:8081`.

## 📁 Repository Structure

- `/contracts`: Solidity smart contracts (`OmniEscrow`, `MockERC20`).
- `/scripts`: Deployment scripts and local daemons.
- `/test`: Hardhat/Chai unit tests.
- `/docs`: Technical guides and deployment instructions.
