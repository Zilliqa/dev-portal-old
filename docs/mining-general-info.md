---
id: mining-general-info
title: General Information
---

## Mining setup architecture

The mining setup architecture differs from the regular setup you may be familiar with where both the node and miner are one single instance (i.e. mining Ethereum or Bitcoin). Below is an illustration of how the Zilliqa mining setup looks like. All communications between these two parties is via the JSON-RPC protocol.

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

## Proof-of-Work algorithm

Zilliqa is using [**Ethash**](https://github.com/ethereum/wiki/wiki/Ethash) for its PoW algorithm. Hence, Zilliqa uses a DAG in its proof-of-work algorithm, that is generated at an incremental rate for each **DS epoch**. The bootstrap DAG size will be roughly `1.02GB`.

## Network Difficulty

The bootstrapped difficulty level for the mainnet is set at `10`. This difficulty level is dynamic and adjusts by `+/- 1` for every `+/- 100` deviation from the target `1810` PoW submissions per DS epoch.

> **NOTE:** Difficulty level is the log2(Difficulty).

Say if there are `1810` seats available in the network but there are `1910` PoW submissions, the difficulty level will increase by `1` for the next DS epoch.

Say if there are `1810` seats available in the network but there are `1710` PoW submissions, the difficulty level will decrease by `1` for the next DS epoch.

## Network Reward Mechanism

In the Zilliqa network, rewards are split into:

* **[25% of total] Base rewards** for all validating nodes (DS/shard) in the network.
* **[70% of total] Flexible rewards** that are based on the amount of valid and accepted (first 2/3 signers within a shard) signatures submitted by a node during a TX epoch while doing the pBFT consensus.

Both base rewards and flexible rewards has the same weightage for both DS and shard nodes. All rewards are consolidated over an entire DS epoch and only distributed during the vacuous epoch.

Do note that the last **5%** of the rewards are given to the lookup and seed nodes.

Say for example, if there are a total of `2400` nodes in the Zilliqa network and the `COINBASE_REWARD` is set at `263698.630137` ZILs per DS Epoch, the reward distribution will be:

- For Base rewards:
    ```shell
    263698.630137 * 0.25 / 2400
    = 27.4686073059375 ZILs per node per DS Epoch
    ```
- For Flexible rewards: (on a first-come-first-serve basis)
    ```shell
    263698.630137 * 0.70 / (2,400 * 2/3 [Successful signers] * 99 [TX blocks])
    = 1.165334855403409 ZILs per valid and accepted signature
    ```

> **NOTE:** For the stability of this nascent network, Guard nodes by Zilliqa are deployed in the network. These Guard nodes always stays within the network without doing PoW, but they are not rewarded. However, the division of rewards before distribution does include the guard nodes in the count. Hence, there are no "bonus" rewards for non-guard nodes that manage to fufil the PoW requirements.

Find our your daily mining profitability by making a copy of the [**Reward Calculator**](https://docs.google.com/spreadsheets/d/1iA3DvXMiAql6bf1mGHHxfGLICm0wZ2Gav5HzRkP81j4/edit?usp=sharing) and editing the yellow-highlighted cells.