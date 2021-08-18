---
id: core-pow
title: PoW Algorithm
keywords:
  - core
  - por
  - proof
  - work
  - algorithm
description: Core protocol design - PoW algorithm.
---

---

## Proof-of-Work

Proof-of-Work, or PoW, is the original consensus algorithm in a blockchain network. In other blockchains (e.g., Bitcoin and Ethereum), this algorithm is used to confirm transactions and produce new blocks in the chain. With PoW, miners compete against each other to complete transactions on the network and get rewarded.

In Zilliqa, PoW is used as a threshold the shard nodes need to meet to join the network. Afterwards, the nodes can start to sign transactions and get rewarded. So, in Zilliqa, completion of PoW doesn't actually mean the node can already get rewarded.

## Why PoW is Needed

The main benefits of using PoW are the anti-DoS attacks defense and low impact of stake on mining possibilities.

**Defense from DoS attacks**. PoW imposes some limits on actions in the network. Firstly, it needs a lot of effort to be executed. Efficient attacks require a lot of computational power and a lot of time to do these calculations. Therefore, the attack is possible but also kind of useless since the costs are too high.

**Mining possibilities**. It doesn’t matter how much money you have in your wallet. What matters is to have large computational power to solve the puzzles and form new blocks. Thus, the holders of huge amounts of money are not in charge of making decisions for the entire network.

## Ethash Algorithm

The Zilliqa blockchain uses the Ethash algorithm, which is originally from Ethereum.

Ethash is the proof-of-work function in Ethereum-based blockchain currencies. It uses Keccak, a hash function eventually standardized to SHA-3 (these two are different, and should not be confused).

Since version 1.0, Ethash has been designed to be ASIC-resistant via memory-hardness (i.e., harder to implement in special ASIC chips) and easily verifiable. It also uses a slightly modified version of earlier Dagger and Hashimoto hashes to remove computational overhead. Previously referred to as Dagger-Hashimoto, the Ethash function has evolved over time. Ethash uses an initial 1GB dataset known as the Ethash DAG and a 16MB cache for light clients to hold. These are regenerated every 30,000 blocks (known as an epoch). Miners grab slices of the DAG to generate mix-hashes using transaction and receipt data, along with a cryptographic nonce to generate a hash below a dynamic target difficulty.

## PoW Modes

Zilliqa supports 5 modes of PoW. Some are suitable for local or small-scale testing, while other modes are intended for Mainnet mining.

### Light Dataset Mine

This is the default mining mode if you don't change any parameters in `constants.xml`. It uses CPU to do PoW. It will generate the DAG data dynamically and doesn't store it in memory; hence, it is the slowest method, but it also doesn't require the 1GB RAM. It is suitable for local testing or small-scale cloud testing. It is not suitable for Mainnet mining.

### Full Dataset Mine

This mode will be enabled if `FULL_DATASET_MINE` is set to `true` in `constants.xml`. It uses CPU to do PoW. It is similar to the light dataset mine mode - the DAG is generated dynamically. However, after the DAG is generated, it is saved in memory. So, next time the same DAG needs to be used, it will be read out directly from memory. This method is faster than the light dataset mine mode, but it requires 1GB RAM on the hardware. It is suitable for local testing or small-scale cloud testing. It is not suitable for Mainnet mining.

### GPU Mine

This mode will be enabled if either `CUDA_GPU_MINE` or `OPENCL_GPU_MINE` is set to `true` in `constants.xml`. It uses GPU to do PoW. There are more parameters available for this mode in the `GPU` section in `constants.xml`. This mode uses GPU to generate the DAG, and the DAG is saved in GPU RAM. It requires that the GPU have at least 1GB RAM. Because a GPU has thousands of cores, the mining speed can be much faster than CPU mining. It is suitable for Mainnet mining, but only during the bootstrap phase; now the Mainnet difficulty is too high for a single machine to finish PoW within the required time. Hence it is now suitable only for test purposes.

### Getwork Server Mine

This mode will be enabled if `GETWORK_SERVER_MINE` is set to `true` in `constants.xml`. The Zilliqa node will be used as a mining server, and other GPU machines can get work from this server and submit the result if the node's GPU machine can find a result. This mode can combine the hash power of multiple GPU machines together to finish a high-difficulty PoW job. But this setup is not easy to maintain if there are multiple Zilliqa nodes using this mode.

### Remote Mine

This mode will be enabled if `REMOTE_MINE` is set to `true` in `constants.xml`. Also, `MINING_PROXY_URL` needs to be set to the address of the mining proxy. In this mode, multiple Zilliqa nodes can send PoW work requests to the mining proxy, and the mining proxy dispatches the work packages to multiple mining machines. If a mining machine finds a result, it sends it to the mining proxy, and the mining proxy in turn sends it to the Zilliqa node. This mode can support multiple Zilliqa nodes and mining machines, but it requires running a mining proxy server separately.

## References

1. [Ethash](https://en.wikipedia.org/wiki/Ethash)
2. [Mining Proxy](https://github.com/DurianStallSingapore/Zilliqa-Mining-Proxy)
