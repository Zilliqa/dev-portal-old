---
id: dev-upgrade-v8
title: V8.0.0 upgrade notice
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

## 1) Payment transaction gas unit increase from 1 to 50 

The gas unit of a payment transaction will be adjusted from `1` to `50`. Developers and exchanges will need to call 
`CreateTransaction` with `gasLimit` set to at least `50` instead of `1` from `v8.0.0` onwards.

As a result of the gas unit changes, payment transaction gas fee will increase from 0.002 $ZIL to 0.1 $ZIL if using the default gas price (0.002 $ZIL).

This change is in accordance with [ZIP-18](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-18.md), which passed governance vote earlier this month.

:::note
Note: that smart contract transaction gas unit remains unchanged.
:::

## 2) Deprecation and removal of `GetPendingTxn` API

Since `v7.0.0`, we have released a new API [`GetTransactionStatus`](https://dev.zilliqa.com/docs/apis/api-transaction-get-transaction-status) API which 
track transaction status during the transactional lifetime. `GetPendingTxn` API has since become redundant and will be removed with effect from `v8.0.0`

## 3) Scilla disambiguation fix

To support Scilla features such as remote state read and external library, user defined ADT will need to be ambiguous starting from `v8.0.0`. This means 
that when a calling contract transition that contains user defined ADT, the user defioned ADT will need to be preixed with the contract address that defines 
the type. 

For instance, let assume there is a user ADT `SSNCycleInfo` which is defined in `0xb55cc7894536ac015350790550b0c03f49eb8ebd`. When using the user defined ADT, 
it will need to be prefixed with contract address i.e `0xb55cc7894536ac015350790550b0c03f49eb8ebd.SSNCycleInfo`. If your contract transition uses user defined 
ADT before `v8.0.0`, you will need to modify the way you call the transition by appending contract address prefix. 

## 4) Introuction of new Scilla feature - remote state read

With effect from `v8.0.0`, Scilla contract will be able to read the state of another contract by using `remote state read`. More details can be found at [tba]().

## 5) Increase number of contracts edges

The max number of contract call edges will be increase from `10` to `20`.

## 6) Increase max of contract code size

The max contract size code will increase from `50KB` to `75KB`. 

## 7) Faster block time

We have made some change to our pBFT consensus in [`Revised pBFT consensus with txn processing`](https://github.com/Zilliqa/Zilliqa/pull/2216). As such, we are able to 
optimize and have early transaction packet dispatch to the shard. 

This will allows us to bring down the block time from 45 seconds to TBA seconds.

## 8) Block reward adjustment 

With the increase in block production rate, block reward be adjusted to `XXX $ZIL` per DS block to bring it back to parity.

## 9) Staking contract migration

Due to the Scilla disambiguation fix, we will be freezing the existing staking contract shortly before the `V8.0.0` network upgrade commence. The contract will be 
freeze permanently and the contract state and funds will be migrated to a new set of contracts. For wallets and explorer supporting Zilliqa staking, please note that 
both the `proxy` and `ssnlist` will be migrated to Staking phase `1.1`. 

When interacting with the staking after the transition to staking phase `1.1`, you will need to adjust your contract address accordingly. This change will mostly impact
wallets providers. 

The new staking contract will also have a new feature `swap delegate` which allow a delegator to swap his wallet address to another without incurring
any unbonding period or penalty. 

You can try out the migrated contract at our testnet at the following contract addresses

| Type    | Address |
| ------- | ------- |
| proxy   | [zil1xxx]() |
| ssnlist | [zil1xxx]() |

Please refer to [Staking phase 1.1-tba]() and [ZIP-19-tba]() for more information. 

## 10) Staking reward and cycle adjustment 

Staking cycle will be adjust `xx` blocks per cycle due to increase in block productiont time. This is to bring it back to parity. Siumilarly, rewards per cycle will 
be adjusted to `xxx $ZIL`.

## 11) $gZIL ending period

`$gZIL` minting period has been set to end on block `1483713`. This value cannot and will not be changed. With changes to block time in `v8.0.0`, the ending wall clock 
may varies as a result.

## 12) Non-interactive mode support for seed node

launch.sh can now be invoked within the docker container as non interactive mode but requires the following environment variables set within the container.
```
NONINTERACTIVE="true"
IP_ADDRESS="x.y.z.a"
IP_WHITELISTING="N" #optional
```

:::note
if IP_WHITELISTING is set to N, the script assumes the existence of the whitelist keypair file called "whitelistkey.txt" and will assume "mykey.txt" as the whitelist key 
if "whitelistkey.txt" does not exist.
:::
## 13) Bug fixes around mining node joining

We have fix some mining node joining issue. Special thanks to [K1-pool](https://k1pool.com/pool/zil) for a reporting a few issues to us.


