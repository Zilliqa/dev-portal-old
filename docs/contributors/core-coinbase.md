---
id: core-coinbase
title: Coinbase Rewards
keywords:
  - core
  - coinbase
  - rewards
description: Core protocol design - coinbase rewards.
---

---

At each DS epoch, a total of `COINBASE_REWARD_PER_DS` QA is distributed to reward miners. Out of this amount, 20% is allocated as the base reward, 40% for cosignature-based reward and 40% for seed node staking rewards.

The base reward is given to each node equally. Specifically, these nodes are those who gained membership into a shard or the DS committee by doing PoW.

The lookup reward is distributed to all the lookup nodes equally.

The cosignature-based reward is distributed to the same base reward recipients in a proportional manner with respect to the number of microblocks (in the case of a shard node) or transaction blocks (in the case of DS nodes) the nodes signed.

:::note
Guard nodes do not get rewarded. Their share of the reward is instead stored in the null address.
:::

## Distribution Process

1. The distribution of rewards takes place during the vacuous epoch (i.e., the last Tx epoch in the DS epoch)
1. The state change (i.e., the subtraction from null address and addition to a node's address) is reflected in the state delta of the DS committee's microblock
1. The DS performs consensus over the state delta and the rewards are hence recorded
1. Cosignatures from the first Tx epoch (of the current DS epoch) until before the vacuous epoch are considered for cosignature-based rewards distribution
1. Cosignatures from shards only are considered for the vacuous epoch (i.e., the Tx block cosignatures by the DS nodes are excluded). This is because the DS committee needs to calculate the coinbase reward distribution first before it performs the consensus that generates the Tx block (with the DS nodes' cosignatures) in the vacuous epoch

## Technical Note

Developers need to take note that the coinbase rewarding data structure is managed in a bit unusual way.

To keep track of cosignatures for cosignature-based rewarding, we use this convention: `m_coinbaseRewardees[EPOCH][SHARDID]-->{Cosigs}`. The epoch number, however, depends on whether the shard ID refers to an actual shard or the DS committee.

For example, the cosignatures for `Epoch 5` with two shards (with ID `0` and `1`) are stored this way:

```
m_coinbaseRewardees[5][0] --> {Cosigs from Microblock proposed by shard 0}
m_coinbaseRewardees[5][1] --> {Cosigs from Microblock proposed by shard 1}
m_coinbaseRewardees[6][-1]--> {Cosigs from Tx block mined by DS Committee}
```

Notice that the shard ID for the DS committee is `-1`. Also, the epoch number is one higher than the epoch number for the shards. This is because `IncreaseEpochNum()` is called (inside `StoreFinalBlock()`) before `SaveCoinbase()`.
