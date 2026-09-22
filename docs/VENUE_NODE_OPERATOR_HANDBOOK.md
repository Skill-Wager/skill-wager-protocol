# VENUE NODE OPERATOR HANDBOOK

**Version:** 1.1.0  
**Target:** Arcade Operators, Bar/Restaurant Owners, Esports Venue Managers

## 1. Operating Model & Legal Boundary

### The Air-Gap Principle

Skill Wager is designed so that a venue monetizes screen time and edge-compute availability without taking custody of player funds or controlling wager outcomes.

- **Cryptographic Air Gap:** The TV Node has zero access to player wallets, private keys, or fiat payment credentials.
- **Terminal-Only Role:** The venue device acts as a display surface, local WebSocket endpoint, and match execution terminal.
- **Wallet-to-Contract Flow:** Funds move strictly from player wallet → L2 escrow contract → winner / protocol payout routes.
- **Venue Abstraction:** Because the venue cannot intercept or redirect escrowed funds, it operates as an edge-compute provider rather than a cashier or casino cage.

### Air-Gapped RNG Integrity

For games with randomized elements, venue hardware must never generate authoritative RNG locally.

- RNG seeds are derived on Layer-2 from deterministic blockchain inputs, including the two players' escrow transaction identifiers.
- Venue hardware may render or relay the resulting gameplay state, but it cannot alter the seed after escrow is locked.
- This prevents venues from manipulating puzzle drops, PvE obstacle patterns, or similar outcomes.

## 2. Hardware Setup & Configuration

### Minimum System Requirements

**Per Arcade Cabinet:**
- CPU: Intel i7 / AMD Ryzen 7 (or equivalent)
- GPU: NVIDIA GTX 1660 / RTX 3060 (or equivalent)
- RAM: 16GB DDR4
- Storage: 1TB SSD (NVMe preferred)
- Network: Gigabit Ethernet (1000 Mbps minimum)
- Latency: <10ms to nearest Skill Wager node

**Node Server (Centralized for venue):**
- CPU: Intel Xeon / AMD EPYC (8+ cores)
- RAM: 64GB DDR4
- Storage: 4TB SSD RAID-1
- Network: 10Gbps dedicated connection
- UPS: 8+ hour battery backup
- Redundant power supplies

### Network Architecture

```
┌─────────────────────────────────────────┐
│        Skill Wager L2 Oracle            │
│      (Polygon/Base Mainnet)             │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴─────────┐
        │                │
    [Venue A]        [Venue B]
   Node Server      Node Server
        │                │
    ┌───┴────┐       ┌───┴────┐
  [Game 1] [Game 2] [Game 1] [Game 2]
```

### Installation Steps

1. **Deploy Node Server**
   ```bash
   docker pull skillwager/node-operator:latest
   docker run -d \
     -e VENUE_ID=YOUR_VENUE_ID \
     -e PRIVATE_KEY=YOUR_NODE_OPERATOR_KEY \
     -v /data:/data \
     skillwager/node-operator
   ```

2. **Connect Game Cabinets**
   - Each cabinet connects via SDK to Node Server
   - Node Server syncs with L2 Oracle every 10 seconds
   - All matches streamed to blockchain in batches

3. **Monitor Uptime**
   - Venue must maintain 99.5%+ uptime
   - Downtime >4 hours triggers slashing
   - Backup nodes recommended for high-volume venues

## 3. Node Treasury & Staking

### Locking $PLAY for 1.2x Voting Multiplier

**Why Lock $PLAY?**
- Earn 2% annual yield on staked tokens
- Receive 1.2x voting power in DAO decisions
- First priority for new game launches
- Reduced fee structure (6.5% rake instead of 7%)

### Staking Tiers

| Tier | $PLAY Locked | Annual Yield | Voting Power | Fee Reduction |
|------|-------------|--------------|--------------|----------------|
| Bronze | 10,000 | 2% | 1.0x | None |
| Silver | 50,000 | 2% | 1.1x | 0.2% |
| Gold | 100,000 | 2.5% | 1.2x | 0.5% |
| Platinum | 250,000+ | 3% | 1.3x | 0.8% |

### Treasury Management Interface

```javascript
// Check node balance
const nodeBalance = await sdk.nodeOperator.getTreasuryBalance();
console.log(`Treasury: ${nodeBalance} $PLAY`);

// Stake additional tokens
await sdk.nodeOperator.stake({
  amount: 50000,
  duration: '1 year', // Lock-up period
  tier: 'gold'
});

// Claim annual yield
const yield = await sdk.nodeOperator.claimYield();
console.log(`Earned: ${yield} $PLAY`);

// Unstake (after lock-up expires)
await sdk.nodeOperator.unstake(50000);
```

### Slashing Penalties

| Violation | Penalty | Recovery |
|-----------|---------|----------|
| Downtime >4 hours | -0.5% of treasury | 30 days |
| Match result manipulation | -5% of treasury | 90 days |
| DDoS attack | -10% of treasury | 180 days + ban |
| Hosting illegal games | -100% of treasury | Permanent ban |

## 4. Revenue Sharing, Monetization & Payouts

### Rung 1: Base Infrastructure Rake

The venue's foundational revenue stream is the automated infrastructure rake from matches executed on its local node.

- **Rate:** 2% of gross $PLAY volume for each local match
- **Settlement:** Routed directly by smart contract to the venue's L2 treasury wallet
- **Operator Effort:** Passive; earned by keeping the node online and eligible for pairing

### Base Match Example: $100 Wager Match

```
Gross Handle: $200 (both players wager $100)
Platform Rake (7%): $14.00

Distribution:
├─ Publisher: $4.00 (2%)
├─ Node Operator: $4.00 (2%)
├─ Treasury: $6.00 (3%)
└─ Burned (quarterly): $1.20 (20% of treasury)

Prize Pool (93%): $186.00
├─ Winner: $186.00
└─ Loser: $0.00
```

### Rung 2: Passive TV Interaction & Spectator Rake

When a screen is not hosting a local match, the TV Node can automatically switch into spectator mode.

- **Digital Signage:** Display global matches, live odds context, and localized venue branding.
- **Venue-Tracked QR Codes:** Each idle screen presents a venue-linked scan target.
- **Spectator Hedging:** Patrons who scan can stake $PLAY on the broadcasted global match from their own ePurse.
- **Affiliate Compensation:** The venue earns a 1% affiliate rake from spectator pools initiated through its local QR surface.

### Rung 3: User Acquisition Bounties

Venue screens also act as localized acquisition funnels for new players.

- **Idle Prompt:** Display a venue-specific QR code inviting patrons to download the ePurse and fund their wallet.
- **CPA Trigger:** When a patron scans, installs, and successfully funds the app, the venue's L2 wallet receives an automated bounty.
- **Reference Benchmark:** Planning models currently assume a 50 $PLAY / ~$5 acquisition bounty per qualified user.

### Rung 4: Digital Out-Of-Home (DOOH) Ad Inventory

Venue operators can monetize screen inventory beyond gameplay.

1. **In-House Promotions:** Run first-party venue promotions at no extra platform cost.
2. **Third-Party Ad Exchange:** Opt into Skill Wager's DOOH marketplace for brand, taxi, nightlife, or game-launch campaigns.
3. **Revenue Split:** Venue operators retain the majority of ad-buy revenue, with the working benchmark set at a 70% venue share of CPM/CPC inventory.

### Payout Schedule

- **Match Rake:** Settled in real time by the L2 smart contract
- **Spectator / Referral / Ad Revenue:** Routed to the venue treasury wallet on the schedule defined by the applicable program contract
- **Primary Settlement Asset:** $PLAY
- **Optional Treasury Conversion:** Venues may convert treasury balances off-platform through approved third-party venues or exchanges; node operators must not offer in-person conversion services

### Dashboard Analytics

Node operators access real-time stats:
- Total revenue generated this week/month
- Number of matches hosted
- Average wager per match
- Top games by revenue
- Spectator-mode scans and affiliate rake
- Funded app-download conversions
- Ad inventory fill rate and campaign revenue
- Player retention metrics
- Upcoming tournament payouts

## 5. Customer Loyalty & Geofenced Venue Economics

### TICKETS as the Loyalty Rail

TICKETS are the venue-safe reward currency for promotions, comps, and repeat-visit incentives.

- TICKETS support free/reward match access without moving real-money value through the register.
- Venues can purchase TICKETS from the treasury in bulk and distribute them to customers as promotional inventory.
- TICKETS are intended for amusement and retention loops, not direct cash redemption.

### "Drink & Play" Subsidy Model

Venues can tie food and beverage purchases to Skill Wager engagement without breaking the financial air gap.

1. Customer purchases a drink or menu item.
2. Venue receipt printer or NFC tap issues a one-time claim token.
3. Customer scans the code in ePurse and receives a TICKETS airdrop.
4. Customer uses those TICKETS on free/reward matches running on local TV Nodes.

This model extends dwell time and encourages repeat ordering while keeping venue-issued rewards in a zero-cash-out amusement lane.

### Geofenced Venue Leaderboards

The ePurse can recognize when a player is physically inside a venue through compliant location signals.

- **Signals:** GPS plus local IP / venue network context
- **Effect:** Eligible players populate the venue's "King of the Hill" leaderboard on local screens
- **Automated Rewards:** Venues can schedule Friday reward drops for top local players using PLAY, TICKETS, or digital coupons

### VIP / High-Roller Screen Reservation

Multi-screen venues can reserve premium nodes for exclusive traffic.

- **NFT Gating:** Accept pairing only from patrons holding a designated venue membership NFT
- **Skill Gating:** Restrict access to players above a configured Elo threshold such as 1800+
- **Operational Goal:** Create a focal point for premium, high-energy matches without changing custody or settlement flows

## 6. Compliance & Legal Requirements

### KYC/AML Verification

Venue operators must verify:
- ✅ Business registration & tax ID
- ✅ Venue address & operational hours
- ✅ Owner identity & background check
- ✅ Gaming license (if required locally)
- ✅ Age verification system for cabinet access

### Responsible Gaming Compliance

- **Age Gates:** All cabinets require ID scan (18+)
- **Session Limits:** Player login shows account balance & limits
- **Deposit Caps:** Daily limits configurable by venue
- **Self-Exclusion:** Players can self-ban from venue for 30+ days
- **Warnings:** Display responsible gaming messages

### Loyalty Integration Mandates

Venue loyalty programs must preserve the legal air gap at all times.

1. **No Fiat-to-Crypto Exchange:** Venue staff may not accept cash, tabs, or card payments in exchange for sending PLAY to a customer's wallet.
2. **Authorized On-Ramps Only:** All fiat onboarding into PLAY must happen through the player's ePurse and approved third-party providers.
3. **One-Way Loyalty:** Venues may distribute TICKETS and digital coupons as promotional rewards, but may not cash out PLAY or TICKETS from the till.
4. **No Outcome Control:** Promotions cannot alter match RNG, pairing fairness, or escrow routing.

### Record Keeping

Venues must maintain:
- Player session logs (12 months)
- Match results & payouts
- Compliance audit trails
- Incident reports (cheating, disputes)
- Regular backups of all data
- Loyalty reward issuance logs
- Geofenced reward campaign rules and payout records

## 7. Cabinet Maintenance & Support

### Regular Maintenance Schedule

| Task | Frequency | Duration |
|------|-----------|----------|
| Software updates | Weekly | 30 min |
| Hardware diagnostics | Monthly | 1 hour |
| Network stress test | Quarterly | 2 hours |
| Full security audit | Annually | 4 hours |

### Troubleshooting Guide

**Issue:** Cabinet loses connection to Node
- Solution: Check network cable; restart Node Server; verify firewall rules

**Issue:** Match result not settling
- Solution: Check internet connectivity; review Oracle logs; resubmit if <24hrs old

**Issue:** Player balance discrepancy
- Solution: Force sync with L2; check recent transactions; contact support if >$1000

### Support Channels

- **24/7 Hotline:** +1-800-SKILLWAGER
- **Discord Support:** discord.gg/skillwager-operators
- **Email:** support@skillwager.io
- **SLA:** <30 min response for critical issues

## 8. Marketing & Player Acquisition

### Co-Marketing Program

Skill Wager provides:
- Professional tournament graphics & posters
- Social media content calendar
- Email templates for player promotions
- Leaderboard displays for arcade walls

### Local Tournament Sponsorship

Host DAO-funded tournaments:
- Prize pools up to $5,000 per event
- Promotion via Skill Wager's marketing channels
- Live streaming support via Twitch integration
- Participant referral bonuses

### Player Onboarding Incentives

```
First-Time Player Bonus:
├─ Venue QR scan: CPA bounty credited to host venue after funded install
├─ Week 1: 20% deposit match (up to $50)
├─ 3 matches: +$10 bonus if playing >2 matches/week
├─ 10 matches: Unlock exclusive cosmetics
└─ 25 matches: Loyalty tier status
```

## 9. Security & Fraud Prevention

### Cabinet Security

- **Physical Locks:** Secure cabinet interior
- **Card Readers:** Players scan ID card to login
- **Session Timeouts:** Auto-logout after 30 mins inactivity
- **Audit Logging:** All actions recorded with timestamp

### Network Security

- **VPN Tunnel:** All data encrypted to Node Server
- **Firewall Rules:** Whitelist only Skill Wager IPs
- **DDoS Protection:** CloudFlare DDoS mitigation
- **Intrusion Detection:** Monitor suspicious access patterns
- **No Wallet Custody:** TV Nodes must never store customer private keys or fiat payment credentials

### Anti-Cheating Measures

- Match logs submitted to Oracle for verification
- Desync detection triggers automatic review
- Suspicious betting patterns flagged
- Serial number validation prevents spoofing
- RNG seeds sourced from deterministic on-chain inputs rather than local machine entropy

## 10. Performance Metrics

### Key Performance Indicators (KPIs)

- **Uptime:** Target 99.5%+ (500+ players)
- **Match Settlement:** <5 second average
- **Player Satisfaction:** Net Promoter Score >50
- **Revenue Retention:** >80% week-over-week

### Venue Dashboard

Operators see real-time:
- Active players on cabinets
- Revenue generated (current day/week/month)
- Top performing games
- Player loyalty scores
- Geofenced leaderboard engagement
- Ticket redemption volume
- Upcoming tournaments & events
