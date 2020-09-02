---
id: staking-ssn-upgrading
title: SSN Maintenance
keywords: 
- staking
- ssn
- maintenance
- resync node
- upgrading node
- zilliqa	
description: Staking SSN Maintenance
---

---

## Seed Node Status Page
We provide a web application, Zilliqa Staking Viewer, to track all available seed node operators. You can access it at:

| Network | Link |
| ------- | ---- |
| Testnet | [https://stg-staking-viewer.zilliqa.com/](https://stg-staking-viewer.zilliqa.com/) |
| Mainnet | [https://staking-viewer.zilliqa.com/](https://staking-viewer.zilliqa.com/) |

## How to Resync Node
The node might go out of sync if it fails to receive new blocks from the network. In this case, the node would ideally automatically sync without any manual intervention.

However, if the node is unable to resync on its own, it will need to be launched again in a fresh mode (i.e. clean start). Please refer to the section  [Preparing the node](staking-getting-started#preparing-the-node) at Getting started page

:::caution
Make sure to back up your keys.
:::

### Upgrading the Seed Node

#### Docker

Please refer to the section  [Preparing the node for docker build](staking-getting-started#launching-the-node-using-docker).

#### Native Build

Please refer to the section  [Preparing the node for native build](staking-getting-started#launching-the-node-using-docker).