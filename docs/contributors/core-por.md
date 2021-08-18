---
id: core-por
title: Proof of Reputation
keywords:
  - core
  - por
  - proof
  - reputation
description: Core protocol design - proof of reputation.
---

---

The [DS reputation](core-ds-reputation.md) feature uses node performance to regulate node tenure within the DS committee. In a similar manner, the PoW submission selection process is designed to prioritize nodes that generated more cosignatures (i.e., actively perform consensus to generate blocks) during their time in the network. When the Mainnet is full (i.e., the 2400-node limit is reached), the PoW submissions from nodes with higher priority ratings will be processed first. This feature is referred to as Proof of Reputation (PoR).

:::note
Selection by reputation only takes effect when the number of PoW submissions exceeds `MAX_SHARD_NODE_NUM` in `constants.xml`.
:::

## PoR Procedure

1. When we bootstrap the system, the reputation of every node is 0
1. Every microblock or Tx block cosigned by a node increases its reputation by one. The reputation is capped at 4096
1. If in any DS epoch a node fails to join the network, its reputation will be reset to 0
1. At the beginning of each DS epoch, the DS leader calls `CalculateNodePriority()` to calculate the node priority based on the node reputation. The nodes with higher priority will be considered first for adding to the sharding structure
1. When the DS backups receive the DS block announcement, they call `VerifyNodePriority()` to calculate the node priority similarly and verify that the nodes in the sharding structure have met the minimum reputation/priority requirement
1. When a new DS leader is selected, the sharding structure is sent to it. The new DS leader can get the reputation of each node from the sharding structure
