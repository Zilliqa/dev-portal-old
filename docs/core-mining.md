---
id: core-mining
title: Mining
---
## PoW Algorithm

### Proof of Work

Proof-of-Work, or PoW, is the original consensus algorithm in a Blockchain network.  
In other Blockchains for example Bitcoin and Ethereum, this algorithm is used to confirm transactions and produce new blocks to the chain. With PoW, miners compete against each other to complete transactions on the network and get rewarded.  
But in Zilliqa, the PoW is used as a threshold shard node need to meet to join the network. And then it can start to sign transactions and get rewarded. So in Zilliqa, finished PoW doesn't mean this node can get reward.

### Why need PoW

The main benefits are the anti-DoS attacks defense and low impact of stake on mining possibilities.  
Defense from DoS attacks.  PoW imposes some limits on actions in the network. They need a lot of efforts to be executed. Efficient attack requires a lot of computational power and a lot of time to do the calculations. Therefore, the attack is possible but kind of useless since the costs are too high.  
Mining possibilities. It doesn’t matter how much money you have in your wallet. What matters is to have large computational power to solve the puzzles and form new blocks. Thus, the holders of huge amounts of money are not in charge of making decisions for the entire network.

### Ethash algorithm

Zilliqa blockchain is using the Ethash algorithm, which is originally from Ethereum.

Ethash is the proof-of-work function in Ethereum-based blockchain currencies. It uses Keccak, a hash function eventually standardized to SHA-3. These two are different, and should not be confused. Since version 1.0, Ethash has been designed to be ASIC-resistant via memory-hardness (harder to implement in special ASIC chips) and easily verifiable. It also uses a slightly modified version of earlier Dagger and Hashimoto hashes to remove computational overhead. Previously referred to as Dagger-Hashimoto, the Ethash function has evolved over time. Ethash uses an initial 1 GB dataset known as the Ethash DAG and a 16 MB cache for light clients to hold. These are regenerated every 30,000 blocks, known as an epoch. Miners grab slices of the DAG to generate mix-hashes using transaction and receipt data, along with a cryptographic nonce to generate a hash below a dynamic target difficulty.

### PoW mode

Now zilliqa support 5 modes of PoW, some are suitable for local or small scale test, some are for mainnet mining.

#### Light Dataset Mine

This is the default mining mode if don't change any parameter in constants.xml. It uses CPU to do PoW. It will generate the dag data dynamically and doesn't store it in memory, hence it is the slowest method but it doesn't require the 1GB RAM. It is suitable for local test or small scale cloud test, not suitable for Mainnet mining.

#### Full Dataset Mine

It will be enabled if change the "FULL_DATASET_MINE" to true if constants.xml. It uses CPU to do PoW. It is similar to light dataset mine, the dag is generated dynamically, but after generate, it is saved in memory. So next time, if need to use the same dag, it will directly read from memory. This method is faster than the light dataset mine, but it require 1GB RAM on the hardware. It is suitable for local test or small scale cloud test, not suitable for Mainnet mining.

#### GPU Mine

It will be enabled if change the "CUDA_GPU_MINE" or "OPENCL_GPU_MINE" to true if constants.xml. It uses GPU to do PoW. There are more parameters available in `GPU` section in constants.xml. This mode uses GPU to generate the DAG and saved in GPU ram. It requires GPU has at least 1GB ram. Because GPU has thousands of cores, so the mining speed is much faster than CPU mine. It it suitable for mining mainnet in the beginning, but now the mainnet difficulty is too high, single machine is not possible to finish the PoW, so now it is only suitable for test purpose.

#### Get Work Server Mine

This mode is enabled by set "GETWORK_SERVER_MINE" to true in constants.xml. The zilliqa node will be used as an mining server, other GPU machine can get work from this server and submit the result if the GPU machine find the result. It can combine the hash power of multiple GPU machines together to finish a high difficulty PoW job. But if there are multiple zilliqa node using this mode, it is not easy to maintain.

#### Remote Mine

This mode is enabled by set "REMOTE_MINE" to true in constants.xml, and MINING_PROXY_URL need to set to the address of the mining proxy listening address. In this mode, multiple zilliqa node can send PoW work request to the mining proxy, and mining proxy dispatches the work packages to multiple mining machines. If the mining machine find result, it send it to the mining proxy, and mining proxy send it to Zilliqa node. This mode can support multiple Zilliqa nodes and mining machines, but it need to run a mining proxy server seperately.

### Reference

1. [Ethash](https://en.wikipedia.org/wiki/Ethash)
2. [Mining Proxy](https://github.com/DurianStallSingapore/Zilliqa-Mining-Proxy)

## Difficulty Adjustment

Zilliqa has a dynamic adjustment difficulty level mechanism. This goal of this mechanism is to adjust the difficulty level according to the number of PoW submission received.

When the network received a low number of PoW submission, the mechanism will reduce the difficulty so that more nodes can join and maintain the network. On the other hand. when the network received a high number of PoW submission, the mechanism will increase the difficulty level, making it harder for Sybil attack.

### Adjustment procedure

1. When we bootstrap the system, every node reads the difficulty level from the constant file. After that, every node will update the difficulty level at the first txn epoch of each DS epoch.
1. At the beginning of each DS epoch, every DS node will receive PoW submissions and record them. When a DS leader proposes a dsblock, it will call "CalculateNewDifficulty" and “CalculateNewDSDifficulty” to calculate the new difficulty levels, insert the difficulty levels into m_dsDifficulty and m_difficulty fields in DS block and finally announce the DS block to every DS backup node via the DS block consensus protocol.
1. A DS backup node receives the announcement, and calculates the new difficulty by calling "CalculateNewDifficulty" and “CalculateNewDSDifficulty” as well as compares the result with the one proposed by DS leader. If it matches, it will accept it and continue the consensus protocol. Otherwise, it will refuse to commit to the announcement made by the leader. If more than 1/3 of the nodes in the DS committee does not commit to the announcement, view change will be triggered.
1. Once DS generates the dsblock with new difficulty, DS will broadcast it to shards. Every shard node will accept the new difficulty and use it to do PoW for next DS epoch.
1. A new node will get the latest difficulty from lookup nodes by retrieving the latest DS block.

### Adjustment formula and parameters

There are 4 constants variables used to calculate the difficulty. 'POW_CHANGE_TO_ADJ_DIFF', 'POW_CHANGE_TO_ADJ_DS_DIFF', 'EXPECTED_SHARD_NODE_NUM' and 'NUM_DS_ELECTION'. And there are two dymanic parameters are number of shard PoW submissions and number of DS PoW submissions. The basic formulas to caluclate new difficulty are as below.

```C++
New shard difficulty = Current Difficulty + (Shard PoW Submissions - EXPECTED_SHARD_NODE_NUM) / POW_CHANGE_TO_ADJ_DIFF
New DS difficulty = Current DS Difficulty + (DS PoW Submissions - NUM_DS_ELECTION) / POW_CHANGE_TO_ADJ_DS_DIFF
```

The rationale of the formula is when there are more PoW submissions than the expected number, then increase difficulty. When there are less PoW submissions than the expected number, then decrease the difficulty.

### Difficulty subdivide

When difficulty increase by one, the required hash power to finish PoW will be doubled. When the difficulty is very high, if still adjust the difficulty by doubling the hash power will make a lot of the miners fail to do PoW, and it will affect the stability and throughput of the blockchain. So we added a threshold to subdivide the difficulty. There are two constant parameters 'POW_BOUNDARY_N_DIVIDED_START' and 'POW_BOUNDARY_N_DIVIDED' defined for it. When current difficulty exceeds 'POW_BOUNDARY_N_DIVIDED_START', every difficulty level will subdivide to 'POW_BOUNDARY_N_DIVIDED' sub-levels. The required hash power increase will only by 1/'POW_BOUNDARY_N_DIVIDED' of current hash power. It can make the hash power increase in a more smooth pace.  
The rationale behind this is we changed the method to calculate target boundary from 'POW_BOUNDARY_N_DIVIDED_START'. When the difficulty under 'POW_BOUNDARY_N_DIVIDED_START', every time we increase difficulty, we put one more '0' at the MSB of target boundary, but if difficulty exceed 'POW_BOUNDARY_N_DIVIDED_START', we put '0's at the LSB of the target boundary.  
The implementation can be found in function DifficultyLevelInIntDevided.  
Here is the bench mark of the hash power required if POW_BOUNDARY_N_DIVIDED_START is 32 and POW_BOUNDARY_N_DIVIDED_START is 1, 2, 4, 6, 8  
![image01](../assets/core/features/difficulty-adjustment/image01.png)
![image02](../assets/core/features/difficulty-adjustment/image02.png)

### Reference

1. [Difficulty divide](https://mybinder.org/v2/gh/deepgully/jupyter/master?filepath=Zilliqa%2Fdifficulty.ipynb)

## Coinbase / Rewards

### Distribution

1. Each DS epoch `263698630136986000` QA is distributed. Out of which 25% is base reward and 5% is lookup reward,
rest is signature based reward.
2. Base reward is given to each node equally which does wins PoW in the beginning of the ds epoch.
3. Lookup reward is distributed to all the lookup nodes equally.
4. Rest 80% is signature based reward. This reward is given propotionally w.r.t the number of signatures
that node has in microblocks (in case of shard node) or tx blocks (in case of ds nodes).

*Note*: Guard nodes do not get reward, their reward is stored in Null Address.

### Process

1. The distribution of rewards take place in vacuous epoch.
2. The state change (subtraction from null address and addition to node's address) is reflected in the
state delta of the ds microblock.
3. The ds have consensus over the state delta and hence rewards are given.
4. Cosigs from first tx epoch (of current ds epoch) until vacuous epoch are considered for signature based rewards distribution.
5. Cosigs from shards only are considered for vacuous epoch (i.e., the tx block cosigs are excluded). That's because DS committee calculates the coinbase reward distribution, reach consensus among them and generate final block in vacuous epoch.

### Technical note

1. Coinbase reward is maintained in bit unusual way.
    `m_coinbaseRewardees[EPOCH][SHARDID]-->{Cosigs}`

    For example, Cosigs for `Epoch 5` with two shards( 0 and 1) are stored as below:
    `m_coinbaseRewardees[5][0] --> {Cosigs from Microblock proposed by shard 0}`
    `m_coinbaseRewardees[5][1] --> {Cosigs from Microblock proposed by shard 1}`
    `m_coinbaseRewardees[6][-1]--> {Cosigs from TxBlock mined by DS Committee}`
    This is because `IncreaseEpochNum` is called (inside `StoreFinalBlock`) before `SaveCoinbase` for TxBlock runs.

## Proof Of Reputation

Set the node with successive co-signature to a higher priority. When the network is full, the PoW submission of nodes with higher priority will be processed first. It can prevent attackers using mass malicious nodes to join the network, so can improve the security of the blockchain.

### Working Mechanism

1. This machanism only take effect when the number of PoW submissions exceed MAX_SHARD_NODE_NUM defined in constants.xml.
1. When we bootstrap the system, the reputation of every node is 0.
1. For every consensus micro or final block, if a node signs a signature as ⅔ of nodes included in the co-signature, its reputation is incremented by one. The maximum reputation is capped at 4096.
1. If in any DS epoch, a node fails to join the network, its reputation will be reset to 0.
1. At the beginning of each DS epoch, DS leader will call “CalculateNodePriority” function to calculate the node priority based on the node reputation. The nodes with higher priority will be choosed first to add to sharding structure.
1. A DS backup node receives the DS announcement, it call "VerifyNodePriority" to calculates the node priority, and verify the nodes in sharding structure have meet the minimum priority requirement. If the check pass, it will accept it and continue the consensus protocol. Otherwise, it will refuse to commit to the announcement made by the leader. If more than 1/3 of the nodes in the DS committee does not commit to the announcement, view change will be triggered.
1. When a new DS leader is selected, the sharding structure is sent to it. The new DS leader can get the reputation of each node from the sharding structure.

### Reference

1. [PoR](https://drive.google.com/file/d/1hU4c8RUkRL5AJu7BwExqakXQpOPUR92D/view?usp=sharing)

