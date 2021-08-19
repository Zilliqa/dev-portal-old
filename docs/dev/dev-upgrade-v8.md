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

Zilliqa version `8.0.0` consists of numerous significant changes. This page summarizes some of the major changes that developers and exchanges will need to take note of. The full release note of `v8.0.0` is available [here](https://github.com/Zilliqa/Zilliqa/releases/tag/v8.0.0).

## Upgrade Duration

|               | Date/Time                       |
| ------------- | ------------------------------- |
| Upgrade start | Tuesday 11th May 2021 05:00 UTC |
| Upgrade end   | Tuesday 11th May 2021 11:00 UTC |

## Core Protocol Updates

### 1) Faster block production rate

We have made some changes to our pBFT (Practical Byzantine Fault Tolerance) consensus and transaction dispatching and processing implementation. This allows for faster block production rate.

|                                      | Before `v8.0.0` | `v8.0.0`        |
| ------------------------------------ | --------------- | --------------- |
| Peak final block production time     | 40 seconds      | 29 seconds      |
| Expected Tx block count per 24 hours | ~1600 Tx blocks | ~2200 Tx blocks |

References:

- [`ZIP-14 - Revised pBFT Consensus`](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-14.md)
- [`Revised pBFT consensus with txn processing implementation`](https://github.com/Zilliqa/Zilliqa/pull/2216)

### 2) Block reward adjustment

Faster block production rate will result in an increase in inflation rate. Zilliqa `v8.0.0` will not include any adjustment to the current inflation rate. Instead, in order to preserve the current inflation rate, the reward allocated per DS epoch will be decreased from 275,000 $ZIL per DS block to 176,000 $ZIL per DS block. We will update the `COINBASE_REWARD_PER_DS`as follows:

|                          | Before `v8.0.0`    | `v8.0.0`           |
| ------------------------ | ------------------ | ------------------ |
| `COINBASE_REWARD_PER_DS` | 275000000000000000 | 176000000000000000 |

Please note that this change is considered an interim change. If the block production rate deviates from the expected value significantly, a new governance proposal can be introduced to adjust the value in subsequent Mainnet upgrades.

### 3) Payment transaction gas unit increase from 1 to 50

As per [ZIP-18](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-18.md), which passed Zilliqa governance vote, the gas unit of payment transaction will be adjusted from 1 to 50 gas unit. We will update `NORMAL_TRAN_GAS` as follows:

|                   | Before `v8.0.0` | `v8.0.0` |
| ----------------- | --------------- | -------- |
| `NORMAL_TRAN_GAS` | 1               | 50       |

When handling payment transactions, developers and exchanges will need to call `CreateTransaction` with `gasLimit` set to at least `50` instead of `1` from `v8.0.0` onwards. As a result of this change, the minimal cost of a payment transaction fee will increase from 0.002 $ZIL to 0.1 $ZIL assuming the lowest gas price.

:::important

1. Smart contract transaction gas unit remains unchanged.
2. Developers and exchanges may proceed to make the `gasLimit` change above even before `v8.0.0` is deployed. Until the deployment, the payment transaction fee will continue to be 0.002 $ZIL, with or without the `gasLimit` change.
   :::

### 4) Deprecation and removal of `GetPendingTxn` and `GetPendingTxns` API

Since `v7.0.0`, we have released a new API [`GetTransactionStatus`](https://dev.zilliqa.com/docs/apis/api-transaction-get-transaction-status) which
tracks transaction status during the transactional lifetime. `GetPendingTxn` and `GetPendingTxns` will be removed with effect from `v8.0.0`.

### 5) Non-interactive mode support for seed nodes

Seed node operators will now have the option of invoking `launch.sh` in non-interactive mode. Operators will need to configure the following environment variables when using non-interactive mode.

```
NONINTERACTIVE="true"
IP_ADDRESS="x.y.z.a"
IP_WHITELISTING="N" #optional
```

:::note
If `IP_WHITELISTING` is set to `N`, the script assumes the existence of the whitelisted keypair file called "whitelistkey.txt", and further assumes "mykey.txt" as the whitelisted key if "whitelistkey.txt" does not exist.
:::

### 6) Bug fixes around mining node joining

We have fixed a few mining node joining issues. Special thanks to [K1-pool](https://k1pool.com/pool/zil) for reporting a few issues to us.

## Scilla Updates

### 1) Scilla disambiguation fix

:::warning
To support Scilla features such as remote state read and external library, user-defined ADTs will need to be non-ambiguous starting from `v8.0.0`. This means
that when calling a contract transition that contains a user-defined ADT, the user-defined ADT will need to be prefixed with the contract address that defines
the type.
:::

For instance, let's assume a user-defined ADT named `SSNCycleInfo` is defined in a contract deployed at address `0xb55cc7894536ac015350790550b0c03f49eb8ebd`. When using the user-defined ADT, it will need to be prefixed with the contract address (i.e., `0xb55cc7894536ac015350790550b0c03f49eb8ebd.SSNCycleInfo`). If your contract transition has user-defined ADTs, you will need to modify the way you call the transition by appending the contract address prefix.

### 2) Introduction of new Scilla feature - remote state read

With effect from `v8.0.0`, a Scilla contract will be able to read the state of another contract by using the remote state read feature.

### 3) Smart contract parameters change

To support larger dApps and the need for more contract calls, we will adjust the following constant values

|                          | Before `v8.0.0` | `v8.0.0` |
| ------------------------ | --------------- | -------- |
| `MAX_CONTRACT_EDGES`     | 10              | 20       |
| `MAX_CODE_SIZE_IN_BYTES` | 51200           | 76800    |

## Staking Updates

As part of the `v8.0.0` rollout, the current Staking Phase 1.0 feature will be updated to the new Staking Phase 1.1.

### 1) Staking contract migration

Due to the Scilla disambiguation fix, we will be freezing the existing staking contract shortly before the `v8.0.0` network upgrade commences. The contract will be frozen permanently, and the contract states and funds will be migrated to a new contract.

:::important

1. Migration to the new contract is expected to take up to 7 days
2. During the migration, the existing contract will be paused and no staking activities such as stake withdrawal can be conducted
3. Rewards for staking will be retroactively distributed after the staking contract migration
4. For wallets, explorers and exchanges, please note that the contract address will be changed and you will need to update it on your end. We will provide the address once we have deployed the Mainnet contract
5. We will make Staking Phase 1.1 available on the public testnet shortly to help you prepare for the staking contract migration
6. For community members, please kindly wait for your wallet provider to update to the new staking contract if you encounter any staking issue
   :::

### 2) Switching of staking wallet

The new staking contract will also have a new `swap delegate` feature which allows a delegator to swap his wallet address with another address without incurring any unbonding period or rewards penalty.

### 3) Staking parameter adjustments

Due to faster block production rate after `v8.0.0`, we will be adjusting the following parameters to bring rewarding and unbonding timing back to parity.

| Parameters        | New value                      |
| ----------------- | ------------------------------ |
| Rewards per cycle | 1,548,800 $ZIL                 |
| Reward cycle      | 2,200 final blocks (~1 day)    |
| Unbonding period  | 30,800 Final blocks (~2 weeks) |

Please note that this change is considered an interim change. If the block production rate deviates from the expected value significantly, a new governance proposal can be introduced to adjust the staking parameter accordingly.

### 4) $gZIL ending period

`$gZIL` minting period has been set to end on block `1483713`. This value cannot be changed. With the changes to block time in `v8.0.0`, the ending wall clock may vary as a result.
