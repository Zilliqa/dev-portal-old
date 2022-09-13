---
id: core-transaction-lifecycle
title: Transaction Lifecycle
keywords:
  - core
  - account
description: Core protocol design - transaction lifecycle.
---

---

The diagram below illustrates how transactions flow within the Zilliqa network from user creation to Tx block generation.

Contributors may also be interested to review these related documents:
- [Types of Nodes](../basics/basics-zil-nodes) under the Basics section (for understanding the roles of nodes in the network)
- [Transaction Lifecycle](../dev/dev-txn-signing) under the Developers section (for handling transactions at user level)
- [Account Management](core-accounts#state-deltas) under the Contributors section (for the meaning of state deltas)

In the diagram, it is worth emphasizing that epoch time has been optimized by configuring the lookup nodes to dispatch transaction packets (for next epoch) to shards during the time these shards are idle (i.e., while waiting for the Tx block after microblock generation), and to similarly dispatch transaction packets (for current epoch) to the DS committee during the time the committee is idle (i.e., while waiting for the shard microblocks after Tx block generation). This setup reduces network latency incurred by node-to-node communication.

![image01](/img/contributors/core/transaction-lifecycle/image01.png)
