---
id: dev-upgrade-v8
title: v8.0.0 Upgrade Notice
keywords: 
- upgrade
- v8.0.0
- zilliqa
description: Zilliqa v8.0.0 upgrade notice
---

---

Zilliqa Version 8.0.0 consists of numerous significant changes. This page summarizes some of the major changes that developers and exchanges 
will need to take note of.

The full release note of `v8.0.0` can be found at [here-tba]().

### 1) Payment transaction gas unit increase from 1 to 50 

The gas unit of a payment transaction will be adjusted from `1` to `50`. Developers and exchanges will need to call `CreateTransaction` with `gasLimit` set to at least `50` instead of `1` from `v8.0.0` onwards.

As a result of the gas unit changes, payment transaction fee will increase from 0.002 $ZIL to 0.1 $ZIL if using the default gas price (0.002 $ZIL).

This change is in accordance with [ZIP-18](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-18.md), which passed governance vote earlier this month.

:::note
Smart contract transaction gas unit remains unchanged.
:::

:::note
Developers and exchanges may proceed to make the `gasLimit` change above even before `v8.0.0` is deployed. Until the deployment, the payment transaction fee will continue to be 0.002 $ZIL, with or without the `gasLimit` change.
:::

### 2) Deprecation and removal of `GetPendingTxn` API

Since `v7.0.0`, we have released a new API [`GetTransactionStatus`](https://dev.zilliqa.com/docs/apis/api-transaction-get-transaction-status) which 
tracks transaction status during the transactional lifetime. `GetPendingTxn` API has since become redundant and will be removed with effect from `v8.0.0`.

### 3) Scilla disambiguation fix

To support Scilla features such as remote state read and external library, user-defined ADTs will need to be non-ambiguous starting from `v8.0.0`. This means 
that when calling a contract transition that contains user-defined ADT, the user-defined ADT will need to be prefixed with the contract address that defines 
the type. 

For instance, let's assume a user-defined ADT named `SSNCycleInfo` is defined in a contract deployed at address `0xb55cc7894536ac015350790550b0c03f49eb8ebd`. When using the user-defined ADT, it will need to be prefixed with the contract address (i.e., `0xb55cc7894536ac015350790550b0c03f49eb8ebd.SSNCycleInfo`). If your contract transition uses user-defined ADTs before `v8.0.0`, you will need to modify the way you call the transition by appending the contract address prefix.

### 4) Introduction of new Scilla feature - remote state read

With effect from `v8.0.0`, a Scilla contract will be able to read the state of another contract by using the remote state read feature. More details can be found at [tba]().

### 5) Increased number of contract edges

The maximum number of contract call edges will be increased from `10` to `20`.

### 6) Increased smart contract code size limit

The maximum smart contract code size will be increased from `50KB` to `75KB`.

### 7) Faster block time

We have made some changes to our pBFT (Practical Byzantine Fault Tolerance) consensus implementation in [`Revised pBFT consensus with txn processing`](https://github.com/Zilliqa/Zilliqa/pull/2216). The main change involves optimization around transaction dispatching and processing. This should allow us to significantly reduce the block time from its current peak of 45 seconds.

### 8) Block reward adjustment 

With the increase in block production rate, the block reward will be adjusted to `XXX $ZIL` per DS block to bring it back to parity.

### 9) Staking contract migration

Due to the Scilla disambiguation fix, we will be freezing the existing staking contract shortly before the `v8.0.0` network upgrade commences. The contract will be frozen permanently, and the contract states and funds will be migrated to a new set of contracts.

For wallets and explorer supporting Zilliqa staking, please note that both the `proxy` and `ssnlist` will be migrated to staking phase `1.1`.

When interacting with the staking contract after the transition to staking phase `1.1`, you will need to adjust your contract address accordingly. This change will mostly impact wallet providers.

The new staking contract will also have a new `swap delegate` feature which allows a delegator to swap his wallet address with another without incurring
any unbonding period or penalty.

The migrated staking contract will be made available on our community testnet shortly.

Please refer to [Staking phase 1.1-tba]() and [ZIP-19-tba]() for more information.

### 10) Staking reward and cycle adjustment 

Staking reward cycle will be adjusted by `xx` blocks per cycle due to the increase in block production time. This is to bring it back to parity. Similarly, the reward amount per cycle will be adjusted to `xxx $ZIL`.

### 11) $gZIL ending period

`$gZIL` minting period has been set to end on block `1483713`. This value cannot and will not be changed. With the changes to block time in `v8.0.0`, the ending wall clock may vary as a result.

### 12) Non-interactive mode support for seed nodes

Seed node hosts will now have the option of invoking `launch.sh` in non-interactive mode, provided the following environment variables are set within the container:

```
NONINTERACTIVE="true"
IP_ADDRESS="x.y.z.a"
IP_WHITELISTING="N" #optional
```

:::note
If `IP_WHITELISTING` is set to `N`, the script assumes the existence of the whitelisted keypair file called "whitelistkey.txt", and further assumes "mykey.txt" as the whitelisted key if "whitelistkey.txt" does not exist.
:::

### 13) Bug fixes around mining node joining

We have fixed some mining node joining issues. Special thanks to [K1-pool](https://k1pool.com/pool/zil) for reporting a few issues to us.

### 14) Note on parameter changes
Please note that changes in point 8 and 10 are considered interim changes. We will need to observe mainnet runtime meterics after `v8.0.0`. If the core team notice the 
estimate is off, we will propose another ZIP to bring to back to parity
