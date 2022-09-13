---
id: basics-zil-reward
title: Reward Mechanism
keywords:
  - base rewards
  - flexible rewards
  - coinbase reward
  - reward calculator
  - zilliqa
description: Zilliqa Rewards
---

---

In the Zilliqa network, rewards are split into:

- **[20% of total] Base rewards** for all validating nodes (DS/shard) in the network.
- **[40% of total] Cosignature-based rewards** that are based on the amount of valid and accepted (first 2/3 signers within a shard) signatures submitted by a node during a TX epoch while doing the pBFT consensus.

Both base rewards and flexible rewards have the same weightage for both DS and shard nodes. All rewards are consolidated over an entire DS epoch and only distributed during the vacuous epoch (i.e., the last transaction epoch for a DS epoch).

Do note that the last **40%** of the rewards are given to the Zilliqa seed node staking program.

Say for example, if there are a total of `2400` nodes in the Zilliqa network and the `COINBASE_REWARD` is set at `20400` $ZIL per DS Epoch, the reward distribution will be:

- For Base rewards:

  ```shell
  204000 * 0.20 / 2400
  = 17 $ZIL per node per DS Epoch
  ```

- For cosignature-based rewards: (on a first-come-first-serve basis)

  ```shell
  204000 * 0.40 / (2,400 * 2/3 [Successful signers] * 99 [TX blocks]) = ~0.0515 $ZIL per valid and accepted signature
  ```

  :::note
  For the stability of this nascent network, Guard nodes by Zilliqa are deployed in the network, both in DS committee and across all shards. These Guard nodes always stays within the network without doing PoW, but they are not rewarded. However, the division of rewards before distribution does include the guard nodes in the count. Hence, there are no "bonus" rewards for non-guard nodes that manage to fufil the PoW requirements.
  :::

Find our your daily mining profitability by filling in the variables for the [**reward calculator**](https://4miners.pro/cryptocurrencies/item/320-Zilliqa-ZIL-calculator)
