---
id: mining-additional-info
title: Additional Information
keywords:
  - mining
  - pow
  - network difficulty
  - reward mechanism
  - epoch architecture
  - zilliqa
description: Mining Additional Informantion
---

---

## Network Epoch Architecture

![Zilliqa Epoch Architecture](https://i.imgur.com/Da4t6FW.png)

At the start of each DS Epoch, all mining candidates will run the Proof-of-Work (Ethash algorithm) cycle for a `60` seconds window to compete to join the Zilliqa network.

- Nodes that fulfilled the `DS_POW_DIFFICULTY` parameter will qualify to join as DS nodes.
- Nodes that fulfilled the `POW_DIFFICULTY` parameter will qualify to join as shard nodes.

There are a total of `100` TX epochs (each 1-2 min) within each DS Epoch (2-3 hrs). Every 100th TX epoch is known as the **Vacuous epoch**.

The vacuous epoch is solely for:

- Distributing the coinbase rewards to all nodes.
- Processing of the upgrade mechanism (as there are no forks in pBFT).
- Writing of persistent state storage (updating of the nodes’ levelDB).

During a vacuous epoch, the network does not process any transactions.

## Proof-of-Work Algorithm

Zilliqa uses [**Ethash**](https://github.com/ethereum/wiki/wiki/Ethash) for its PoW algorithm. Hence, Zilliqa uses a DAG in its proof-of-work algorithm, which is generated at an incremental rate for each **DS epoch**. The bootstrap DAG size will be roughly `1.02GB`.

Refer to the [Core Protocol Documentation](../contributors/core-pow.md) for more details on the Zilliqa PoW algorithm.

## Network Difficulty

Refer to the [Core Protocol Documentation](../contributors/core-difficulty-adjustment.mdx) for more details on the difficulty adjustment algorithm.

## Network Reward Mechanism

Refer to [Zilliqa Architecture - Reward mechanism](../basics/basics-zil-reward.md).
