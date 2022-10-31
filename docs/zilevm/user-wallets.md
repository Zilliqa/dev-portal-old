---
id: user-wallets
title: Wallets
keywords:
  - Wallets
description: Wallets that can interact with ZILEVM
---

---

## MetaMask

### Setup


:::warning
Your seed phrase must be backed up and kept secret.
Funds can be at risk if this phrase cannot be recalled or exposed publically.
Your Zilliqa seed phrase and your EVM seed phrases are different! Your existing Scilla keys WILL NOT resolve to the same EVM address. DO NOT use scilla's base 16 '0x' address as the target of sending EVM funds to - you will lose your funds!.
:::

:::info
If you already have Ledger/Metamask - you can use the existing seed phrase to generate the same wallet addresses.
:::

To add a new network to MetaMask - click the current network selected at the top of the extenstion and press 'Add Network'.

Enter the below configuration, and press save.

| Network Type | Network Name  | Network RPC                       | ChainID | Currency Symbol | Block Explorer URL |
|--------------|---------------|-----------------------------------|---------|-----------------|--------------------|
| Devnet       | EVM Dev       | https://evmdev-l2api.dev.z7a.xyz  | 33101   | ZIL             |                    |
| Testnet      |               |                                   |         |                 |                    |
| Mainnet      |               |                                   |         |                 |                    |

### Sending funds

We can send EVMZIL to other


### Using tooling