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

Zilliqa Version 8.0.0 consists of numerous significant changes. The change log can be found at [here-tba]().

This page summarize some of the major chjanges that developers will need to take note of. 

## 1) Payument transaction gas consumption increase from 1 to 50 

The gas unit of a payment transaction will be adjusted from 1 to 50. Developers and exchanges will need to call 
`CreateTransaction` with "gasLimit" set to "50" instead of "1".

Payment transaction fee will increase from 0.002 ZIL to 0.1 ZIL (assuming the minimum gas price of 0.002 ZIL).

This is in accordance with Zilliqa Improvement Proposal (ZIP) #18, which passed governance vote earlier this month.
Please refer to this link for more details: https://governance.zilliqa.com/#/gzil/proposal/QmcxZJ5x7o9tWRmjD73uopRno35iwJhydgTTCbHsS1AFUt

:::note
Note: that smart contract transaction fees remained unchanged.
:::

## 2) Deprecation and remove of `GetPendingTxn` API

Since `v7.0.0`, we have released a new API [`GetTransactionStatus`](https://dev.zilliqa.com/docs/apis/api-transaction-get-transaction-status) API which 
track a transaction during its transactional lifetime. `GetPendingTxn` API has become redundant and will be removed with effect from `v8.0.0`

## 3) Scilla disambigation fix

To support Scilla features such as remote state read and external library, user defined ADT will need to be ambigious starting from `v8.0.0`. This means 
that when a contract call another contract transition with user defined ADT, the user defioned ADT will need to be preixed with the address that defines 
the type. 

For instance, assuming there is a user ADT `SSNCycleInfo` which is defined in `0xb55cc7894536ac015350790550b0c03f49eb8ebd`, when using the ADT, it will 
need to be prefixed with contract address i.e `0xb55cc7894536ac015350790550b0c03f49eb8ebd.SSNCycleInfo`. If your contract transition uses user defined 
ADT before `v8.0.0`, you will need to modify the way you call the transition by appending contract address prefix. 

## 4) Faster block time

As a result of some changes to our pBFT consensus, we are able to optimize and bring down the block time from 45 seconds to TBA seconds.

## 5) Block reward adjustment 

With the increase in block production rate, block reward need to be adjust to XXX per DS block to bring it back to parity.

## 6) Staking contract migration

As a result of Scilla disambigation fix, we will be freezing the existing staking contract during the V8.0.0 network upgrade. The contract will be 
freeze forever and the contract state and funds will be migrated to a new set of contracts. For wallets and explorer supporting Zilliqa staking, 
please note that both the `proxy` and `ssnlist` will be migrated. You will need to adjust your contract address accordingly. 

The new staking contract will also have a new feature `swap delegate` which allow a delegator to swap his wallet address to another without incurring
any unbonding period or penalty. 

You can try out the migrated contract at our testnet at the following contract addresses

| Type    | Address |
| ------- | ------- |
| proxy   | [zil1xxx]() |
| ssnlist | [zil1xxx]() |


Please refer to [Staking phase 1.1-tba]() for more information. 

## 7) Staking reward and cycle adjustment 

With the reduction in block time, staking cycle will be adjust `xx` blocks per cycle. This is to bring it back to parity. 
Siumilarly, rewards per cycle will be adjusted to `xxx`.

## 8) gZIL ending period

`gZIL` has been set to end on block `1483713`. This value cannot be changed. With changes to block time in `v8.0.0`, the ending wall clock may varies as a result