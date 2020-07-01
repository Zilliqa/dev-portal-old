---
id: mining-pools
title: Using Mining Pools
---
## Proxy Mining

In contrast to Ethereum, Zilliqa doesn’t employ PoW for its consensus protocol (such as is done in nakamoto consensus). Instead, it leverages a pBFT-like variant as its consensus protocol and PoW as the identity creation to prevent Sybil attacks.

As a consequence, Zilliqa requires GPUs for its PoW phase and CPUs for consensus and transaction verification. To participate in Zilliqa’s network, a node is required to submit a PoW submission that meets the difficulty level. After that, the node is assigned to a shard and contributes to transaction processing and consensus within the duration of its shard membership.

In the normal case, then, a Zilliqa node requires both CPU and GPU. However, to abstract the entire process, we can split the system into two major components: a CPU cluster for transaction verification and consensus, and a GPU cluster for PoW as shown in the figure below.

With the help from existing GPU miners, Zilliqa node operators can obtain thousands of powerful GPU cards to meet the hash rate required by the Zilliqa Mainnet for PoW. Similarly, we can also set up a dedicated GPU cluster together with a mining proxy. By decoupling the CPU and GPU components in this manner, we can easily manage thousands of nodes for the Mainnet.

As the bridge, the mining proxy relays messages from both sides, i.e., CPU cluster requests for mining responses provided by the GPU cluster. This request-response process is defined by the [Stratum mining protocol](https://en.bitcoin.it/wiki/Stratum_mining_protocol).

![image01](../assets/proxy-mining.png)

## Getting Started with Mining Pools

Zilliqa's use of Ethereum's Ethash algorithm for PoW allows existing mining pool operators to easily integrate mining on Zilliqa, giving retail miners another way to participate in the Zilliqa Mainnet.

The Zilliqa page on [MiningPoolStats](https://miningpoolstats.stream/zilliqa) has a list of mining pools that support Zilliqa. Please refer to the pool's website for specific instructions on how to participate.

## Proxy Mining Setup

The following components are available for node operators who are interested in managing their own proxy mining setup:

1. CPU cluster - [Zilliqa Client](https://github.com/Zilliqa/Zilliqa)
1. GPU cluster - [ZilMiner](https://github.com/DurianStallSingapore/ZILMiner)
1. Mining proxy - [Zilliqa Mining Proxy](https://github.com/DurianStallSingapore/Zilliqa-Mining-Proxy)

The detailed instructions on how to set up these components can be found in the ZilMiner and Zilliqa Mining Proxy repositories.