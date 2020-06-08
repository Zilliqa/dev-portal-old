---
id: basics-zil-reward
title: Reward mechanism
---
In the Zilliqa network, rewards are split into:

* **[25% of total] Base rewards** for all validating nodes (DS/shard) in the network.
* **[70% of total] Flexible rewards** that are based on the amount of valid and accepted (first 2/3 signers within a shard) signatures submitted by a node during a TX epoch while doing the pBFT consensus.

Both base rewards and flexible rewards have the same weightage for both DS and shard nodes. All rewards are consolidated over an entire DS epoch and only distributed during the vacuous epoch (i.e., the last transaction epoch for a DS epoch).

Do note that the last **5%** of the rewards are given to the lookup nodes.

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