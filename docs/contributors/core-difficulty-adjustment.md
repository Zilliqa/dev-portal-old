---
id: core-difficulty-adjustment
title: Difficulty Adjustment
keywords: 
- core 
- difficulty 
- adjustment
description: Core protocol design - difficulty adjustment.
---

---
Zilliqa has a dynamic difficulty level adjustment mechanism. The goal of this mechanism is to adjust the difficulty level according to the number of PoW submissions received.

When the network receives a low number of PoW submissions, the mechanism will reduce the difficulty so that more nodes can join and maintain the network. On the other hand, when the network receives a high number of PoW submissions, the mechanism will increase the difficulty level, making it harder for Sybil attacks to be executed.

## Adjustment Procedure

1. When we bootstrap the system, every node reads the initial difficulty level from `constants.xml`. After that, the nodes will update the difficulty level at the first transaction epoch of each DS epoch
1. At the beginning of each DS epoch, every DS node receives PoW submissions and records them. When the DS leader proposes the next DS block, it calls `CalculateNewDifficulty()` and `CalculateNewDSDifficulty()` to calculate the new difficulty levels. These difficulty levels are placed in the `m_dsDifficulty` and `m_difficulty` fields in the DS block. Finally, the DS leader announces the DS block to start the consensus
1. The DS backup nodes receive the announcement, and calculate the new difficulty by similarly calling `CalculateNewDifficulty()` and `CalculateNewDSDifficulty()` then comparing the results with those proposed by the DS leader
1. Once the DS committee completes consensus over the DS block containing the new difficulty level, the committee broadcasts the block to the shards. The shard nodes accept the new difficulty and use it to do PoW for the next DS epoch
1. New nodes that are not part of the network can get the latest difficulty from the lookup nodes by retrieving the latest DS block

## Adjustment Formula and Parameters

There are 4 parameters in `constants.xml` that are used to calculate the difficulty:

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

## Difficulty Subdivision

When the difficulty increases by one, the required hash power to finish PoW will be doubled. When the difficulty is already very high, adjusting the difficulty by doubling the hash power causes a lot of miners to fail to do PoW. This in turn affects the stability and throughput of the blockchain.

To address this situation, we added a threshold to **subdivide** the difficulty. There are two constant parameters `POW_BOUNDARY_N_DIVIDED_START` and `POW_BOUNDARY_N_DIVIDED` defined for this purpose. When the current difficulty exceeds `POW_BOUNDARY_N_DIVIDED_START`, every difficulty level will subdivide to `POW_BOUNDARY_N_DIVIDED` sub-levels. The required hash power increase will only be by `1/POW_BOUNDARY_N_DIVIDED` of the current hash power. This makes the hash power increase more smoothly in increments.

The rationale behind this is we changed the method to calculate the target boundary from `POW_BOUNDARY_N_DIVIDED_START`. When the difficulty is below `POW_BOUNDARY_N_DIVIDED_START`, we put one more `0` at the MSB of the target boundary every time we increase the difficulty. On the other hand, if the difficulty exceeds `POW_BOUNDARY_N_DIVIDED_START`, we put `0`s at the LSB of the target boundary.

This process is implemented in the function `DifficultyLevelInIntDevided()`.

The graphs below illustrate the benchmarks of the hash power required if `POW_BOUNDARY_N_DIVIDED_START` is 32 and `POW_BOUNDARY_N_DIVIDED_START` is 1, 2, 4, 6, and 8.

![image01](../../assets/core/features/difficulty-adjustment/image01.png)
![image02](../../assets/core/features/difficulty-adjustment/image02.png)

## References

1. [Difficulty divide](https://mybinder.org/v2/gh/deepgully/jupyter/master?filepath=Zilliqa%2Fdifficulty.ipynb)