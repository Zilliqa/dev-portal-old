---
id: core-mining
title: Mining
---
## PoW Algorithm

### Proof-of-Work

Proof-of-Work, or PoW, is the original consensus algorithm in a blockchain network. In other blockchains (e.g., Bitcoin and Ethereum), this algorithm is used to confirm transactions and produce new blocks in the chain. With PoW, miners compete against each other to complete transactions on the network and get rewarded.

In Zilliqa, PoW is used as a threshold the shard nodes need to meet to join the network. Afterwards, the nodes can start to sign transactions and get rewarded. So, in Zilliqa, completion of PoW doesn't actually mean the node can already get rewarded.

### Why PoW is Needed

The main benefits of using PoW are the anti-DoS attacks defense and low impact of stake on mining possibilities.

**Defense from DoS attacks**.  PoW imposes some limits on actions in the network. Firstly, it needs a lot of effort to be executed. Efficient attacks require a lot of computational power and a lot of time to do these calculations. Therefore, the attack is possible but also kind of useless since the costs are too high.

**Mining possibilities**. It doesn’t matter how much money you have in your wallet. What matters is to have large computational power to solve the puzzles and form new blocks. Thus, the holders of huge amounts of money are not in charge of making decisions for the entire network.

### Ethash Algorithm

The Zilliqa blockchain uses the Ethash algorithm, which is originally from Ethereum.

Ethash is the proof-of-work function in Ethereum-based blockchain currencies. It uses Keccak, a hash function eventually standardized to SHA-3 (these two are different, and should not be confused).

Since version 1.0, Ethash has been designed to be ASIC-resistant via memory-hardness (i.e., harder to implement in special ASIC chips) and easily verifiable. It also uses a slightly modified version of earlier Dagger and Hashimoto hashes to remove computational overhead. Previously referred to as Dagger-Hashimoto, the Ethash function has evolved over time. Ethash uses an initial 1GB dataset known as the Ethash DAG and a 16MB cache for light clients to hold. These are regenerated every 30,000 blocks (known as an epoch). Miners grab slices of the DAG to generate mix-hashes using transaction and receipt data, along with a cryptographic nonce to generate a hash below a dynamic target difficulty.

### PoW Modes

Zilliqa supports 5 modes of PoW. Some are suitable for local or small-scale testing, while other modes are intended for Mainnet mining.

#### Light Dataset Mine

This is the default mining mode if you don't change any parameters in constants.xml. It uses CPU to do PoW. It will generate the DAG data dynamically and doesn't store it in memory; hence, it is the slowest method, but it also doesn't require the 1GB RAM. It is suitable for local testing or small-scale cloud testing. It is not suitable for Mainnet mining.

#### Full Dataset Mine

This mode will be enabled if `FULL_DATASET_MINE` is set to `true` in constants.xml. It uses CPU to do PoW. It is similar to the light dataset mine mode - the DAG is generated dynamically. However, after the DAG is generated, it is saved in memory. So, next time the same DAG needs to be used, it will be read out directly from memory. This method is faster than the light dataset mine mode, but it requires 1GB RAM on the hardware. It is suitable for local testing or small-scale cloud testing. It is not suitable for Mainnet mining.

#### GPU Mine

This mode will be enabled if either `CUDA_GPU_MINE` or `OPENCL_GPU_MINE` is set to `true` in constants.xml. It uses GPU to do PoW. There are more parameters available for this mode in the `GPU` section in constants.xml. This mode uses GPU to generate the DAG, and the DAG is saved in GPU RAM. It requires that the GPU have at least 1GB RAM. Because a GPU has thousands of cores, the mining speed can be much faster than CPU mining. It is suitable for Mainnet mining, but only during the bootstrap phase; now the Mainnet difficulty is too high for a single machine to finish PoW within the required time. Hence it is now suitable only for test purposes.

#### Getwork Server Mine

This mode will be enabled if `GETWORK_SERVER_MINE` is set to `true` in constants.xml. The Zilliqa node will be used as a mining server, and other GPU machines can get work from this server and submit the result if the node's GPU machine can find a result. This mode can combine the hash power of multiple GPU machines together to finish a high-difficulty PoW job. But this setup is not easy to maintain if there are multiple Zilliqa nodes using this mode.

#### Remote Mine

This mode will be enabled if `REMOTE_MINE` is set to `true` in constants.xml. Also, `MINING_PROXY_URL` needs to be set to the address of the mining proxy. In this mode, multiple Zilliqa nodes can send PoW work requests to the mining proxy, and the mining proxy dispatches the work packages to multiple mining machines. If a mining machine finds a result, it sends it to the mining proxy, and the mining proxy in turn sends it to the Zilliqa node. This mode can support multiple Zilliqa nodes and mining machines, but it requires running a mining proxy server separately.

### References

1. [Ethash](https://en.wikipedia.org/wiki/Ethash)
2. [Mining Proxy](https://github.com/DurianStallSingapore/Zilliqa-Mining-Proxy)

## Difficulty Adjustment

Zilliqa has a dynamic difficulty level adjustment mechanism. The goal of this mechanism is to adjust the difficulty level according to the number of PoW submissions received.

When the network receives a low number of PoW submissions, the mechanism will reduce the difficulty so that more nodes can join and maintain the network. On the other hand, when the network receives a high number of PoW submissions, the mechanism will increase the difficulty level, making it harder for Sybil attacks to be executed.

### Adjustment Procedure

1. When we bootstrap the system, every node reads the initial difficulty level from constants.xml. After that, the nodes will update the difficulty level at the first transaction epoch of each DS epoch
1. At the beginning of each DS epoch, every DS node receives PoW submissions and records them. When the DS leader proposes the next DS block, it calls `CalculateNewDifficulty()` and `CalculateNewDSDifficulty()` to calculate the new difficulty levels. These difficulty levels are placed in the `m_dsDifficulty` and `m_difficulty` fields in the DS block. Finally, the DS leader announces the DS block to start the consensus
1. The DS backup nodes receive the announcement, and calculate the new difficulty by similarly calling `CalculateNewDifficulty()` and `CalculateNewDSDifficulty()` then comparing the results with those proposed by the DS leader
1. Once the DS committee completes consensus over the DS block containing the new difficulty level, the committee broadcasts the block to the shards. The shard nodes accept the new difficulty and use it to do PoW for the next DS epoch
1. New nodes that are not part of the network can get the latest difficulty from the lookup nodes by retrieving the latest DS block

### Adjustment Formula and Parameters

There are 4 parameters in constants.xml that are used to calculate the difficulty:

- `POW_CHANGE_TO_ADJ_DIFF`
- `POW_CHANGE_TO_ADJ_DS_DIFF`
- `EXPECTED_SHARD_NODE_NUM`
- `NUM_DS_ELECTION`

Additionally, there are two dynamic parameters that are used to calculate the difficulty:

- The number of shard PoW submissions
- The number of DS PoW submissions

The basic formulas used to calculate the new difficulty are:

```C++
New shard difficulty = Current Difficulty + (Shard PoW Submissions - EXPECTED_SHARD_NODE_NUM) / POW_CHANGE_TO_ADJ_DIFF
New DS difficulty = Current DS Difficulty + (DS PoW Submissions - NUM_DS_ELECTION) / POW_CHANGE_TO_ADJ_DS_DIFF
```

The rationale of the formulas is when there are more PoW submissions than the expected number, increase the difficulty. When there are less PoW submissions than the expected number, decrease the difficulty.

### Difficulty Subdivision

When the difficulty increases by one, the required hash power to finish PoW will be doubled. When the difficulty is already very high, adjusting the difficulty by doubling the hash power causes a lot of miners to fail to do PoW. This in turn affects the stability and throughput of the blockchain.

To address this situation, we added a threshold to **subdivide** the difficulty. There are two constant parameters `POW_BOUNDARY_N_DIVIDED_START` and `POW_BOUNDARY_N_DIVIDED` defined for this purpose. When the current difficulty exceeds `POW_BOUNDARY_N_DIVIDED_START`, every difficulty level will subdivide to `POW_BOUNDARY_N_DIVIDED` sub-levels. The required hash power increase will only be by `1/POW_BOUNDARY_N_DIVIDED` of the current hash power. This makes the hash power increase more smoothly in increments.

The rationale behind this is we changed the method to calculate the target boundary from `POW_BOUNDARY_N_DIVIDED_START`. When the difficulty is below `POW_BOUNDARY_N_DIVIDED_START`, we put one more `0` at the MSB of the target boundary every time we increase the difficulty. On the other hand, if the difficulty exceeds `POW_BOUNDARY_N_DIVIDED_START`, we put `0`s at the LSB of the target boundary.

This process is implemented in the function `DifficultyLevelInIntDevided()`.

The graphs below illustrate the benchmarks of the hash power required if `POW_BOUNDARY_N_DIVIDED_START` is 32 and `POW_BOUNDARY_N_DIVIDED_START` is 1, 2, 4, 6, and 8.

![image01](../assets/core/features/difficulty-adjustment/image01.png)
![image02](../assets/core/features/difficulty-adjustment/image02.png)

### References

1. [Difficulty divide](https://mybinder.org/v2/gh/deepgully/jupyter/master?filepath=Zilliqa%2Fdifficulty.ipynb)

## Proof of Reputation

The [DS reputation](core-directory-service.md#ds-reputation) feature uses node performance to regulate node tenure within the DS committee. In a similar manner, the PoW submission selection process is designed to prioritize nodes that generated more cosignatures (i.e., actively perform consensus to generate blocks) during their time in the network. When the Mainnet is full (i.e., the 2400-node limit is reached), the PoW submissions from nodes with higher priority ratings will be processed first. This feature is referred to as Proof of Reputation (PoR).

> Note: Selection by reputation only takes effect when the number of PoW submissions exceeds `MAX_SHARD_NODE_NUM` in constants.xml.

### PoR Procedure

1. When we bootstrap the system, the reputation of every node is 0
1. Every microblock or Tx block cosigned by a node increases its reputation by one. The reputation is capped at 4096
1. If in any DS epoch a node fails to join the network, its reputation will be reset to 0
1. At the beginning of each DS epoch, the DS leader calls `CalculateNodePriority()` to calculate the node priority based on the node reputation. The nodes with higher priority will be considered first for adding to the sharding structure
1. When the DS backups receive the DS block announcement, they call `VerifyNodePriority()` to calculate the node priority similarly and verify that the nodes in the sharding structure have met the minimum reputation/priority requirement
1. When a new DS leader is selected, the sharding structure is sent to it. The new DS leader can get the reputation of each node from the sharding structure

## Coinbase / Rewards

At each DS epoch, a total of `COINBASE_REWARD_PER_DS` QA is distributed to reward miners. Out of this amount, 25% is allocated as the base reward, 5% the lookup reward, and the remainder the cosignature-based reward.

The base reward is given to each node equally. Specifically, these nodes are those who gained membership into a shard or the DS committee by doing PoW.

The lookup reward is distributed to all the lookup nodes equally.

The cosignature-based reward is distributed to the same base reward recipients in a proportional manner with respect to the number of microblocks (in the case of a shard node) or transaction blocks (in the case of DS nodes) the nodes signed.

> Note: Guard nodes do not get rewarded. Their share of the reward is instead stored in the null address.

### Distribution Process

1. The distribution of rewards takes place during the vacuous epoch (i.e., the last Tx epoch in the DS epoch)
1. The state change (i.e., the subtraction from null address and addition to a node's address) is reflected in the state delta of the DS committee's microblock
1. The DS performs consensus over the state delta and the rewards are hence recorded
1. Cosignatures from the first Tx epoch (of the current DS epoch) until before the vacuous epoch are considered for cosignature-based rewards distribution
1. Cosignatures from shards only are considered for the vacuous epoch (i.e., the Tx block cosignatures by the DS nodes are excluded). This is because the DS committee needs to calculate the coinbase reward distribution first before it performs the consensus that generates the Tx block (with the DS nodes' cosignatures) in the vacuous epoch

### Technical Note

Developers need to take note that the coinbase rewarding data structure is managed in a bit unusual way.

To keep track of cosignatures for cosignature-based rewarding, we use this convention: `m_coinbaseRewardees[EPOCH][SHARDID]-->{Cosigs}`. The epoch number, however, depends on whether the shard ID refers to an actual shard or the DS committee.

For example, the cosignatures for `Epoch 5` with two shards (with ID `0` and `1`) are stored this way:

```
m_coinbaseRewardees[5][0] --> {Cosigs from Microblock proposed by shard 0}
m_coinbaseRewardees[5][1] --> {Cosigs from Microblock proposed by shard 1}
m_coinbaseRewardees[6][-1]--> {Cosigs from Tx block mined by DS Committee}
```

Notice that the shard ID for the DS committee is `-1`. Also, the epoch number is one higher than the epoch number for the shards. This is because `IncreaseEpochNum()` is called (inside `StoreFinalBlock()`) before `SaveCoinbase()`.