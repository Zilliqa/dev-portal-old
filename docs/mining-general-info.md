---
id: mining-general-info
title: General Information
---

## Mining Setup Architecture

The mining setup architecture differs from the regular setup you may be familiar with where both the node and miner are one single instance (i.e. mining Ethereum or Bitcoin). Below is an illustration of how the Zilliqa mining setup looks like. All communications between these two parties are via the JSON-RPC protocol.

![1-to-many](https://i.imgur.com/qReRpRx.jpg)

- A CPU node instance will run the **Zilliqa client** and carry out the pBFT consensus process to receive rewards.
- The GPU rigs in the GPU cluster will run **Zilminer** on a separate GPU cluster to do PoW mining and provide PoW solutions directly to the CPU node.

## Network Epoch Architecture

![Zilliqa Epoch Architecture](https://i.imgur.com/Da4t6FW.png)

At the start of each DS Epoch, all mining candidates will run the Proof-of-Work (Ethash algorithm) cycle for a `60` seconds window in order to compete to join the Zilliqa network.

- Nodes that fulfilled the `DS_POW_DIFFICULTY` parameter will qualify to join as DS nodes.
- Nodes that fulfilled the `POW_DIFFICULTY` parameter will qualify to join as shard nodes.

There are a total of `100` TX epochs (each 1-2 min) within each DS Epoch (2-3 hrs). Every 100th TX epoch is known as the **Vacuous epoch**.

The vacuous epoch is solely for:

- Distributing the coinbase rewards to all nodes.
- Processing of the upgrade mechanism (as there are no forks in pBFT).
- Writing of persistent state storage (updating of the nodes’ levelDB).

During a vacuous epoch, the network does not process any transactions.

## Proof-of-Work Algorithm

Zilliqa is using [**Ethash**](https://github.com/ethereum/wiki/wiki/Ethash) for its PoW algorithm. Hence, Zilliqa uses a DAG in its proof-of-work algorithm, that is generated at an incremental rate for each **DS epoch**. The bootstrap DAG size will be roughly `1.02GB`.

## Network Difficulty

The bootstrapped difficulty level for the mainnet is set at `10`. This difficulty level is dynamic and adjusts by `+/- 1` for every `+/- 99` deviation from the target `1810` PoW submissions per DS epoch. Maximum increase per DS epochs is `+/- 1`.

> **NOTE:** Difficulty level is the log2(Difficulty).

Say if there are `1810` seats available in the network:

* But there are `1909` PoW submissions, the shard difficulty level will increase by `0.125` for the next DS epoch.
* But there are `2602` PoW submissions, the shard difficulty level will increase by `1` for the next DS epoch.
* But there are `1711` PoW submissions, the shard difficulty level will decrease by `0.125` for the next DS epoch.
* But there are `1018` PoW submissions, the shard difficulty level will decrease by `1` for the next DS epoch.

## Network Reward Mechanism

Refer to [Zilliqa Architecture - Reward mechanism](basics-zil-reward.md).