---
id: basics-zil-consensus
title: Consensus Mechanism
keywords:
  - consensus
  - ds committee
  - pbft
  - zilliqa
description: Zilliqa Consensus
---

---

The Zilliqa network is composed of one DS Committee (a special type of shard), and `n` normal shards. Each shard has a number of nodes, with one node being a `leader` and `k` number of `backups`.

Broadly, each shard runs an algorithm called [practical Byzantine fault tolerance (pBFT)](http://pmg.csail.mit.edu/papers/osdi99.pdf) to achieve consensus on the state of the blockchain at any point. A rough outline is as follows:

1. Pre-prepare: the `leader` announces the state of the blockchain it has to all `backup` nodes in the shard as a **pre-prepare** message.
2. Prepare: each node receives and validates the state received from the `leader` in the pre-prepare phase, and multicasts its decision as a **prepare** message to the rest of the nodes in the shard.
3. Commit: upon receiving a valid **prepare** message from a super majority (2/3) of nodes, it multicasts a **commit** message to all other nodes. Once a **commit** message is recieved from a super majority, the node records the new state.
