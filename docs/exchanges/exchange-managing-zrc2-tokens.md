---
id: exchange-managing-zrc2-tokens
title: Managing Fungible Tokens (ZRC-2) tokens
keywords: 
- zrc2
- polling
- exchanges
- zilliqa
description: Managing Fungible Tokens (ZRC-2) tokens
---

---


## Introduction of ZRC-2

[ZRC-2](https://github.com/Zilliqa/ZRC/blob/master/zrcs/zrc-2.md) is the formal standard for Fungible Token standard in Zilliqa. It is an open standard for creating currencies. 

With ZRC-2 standard, it allows for functionaility like 
- mint/burn tokens 
- transfer of tokens from one account to another
- Query account token balance
- Query total token balances
- approving third party to spent a certain amount of token 
- etc. 

## Example of ZRC-2 

- [XSGD](https://www.zilliqa.com/xsgd) - the first Singapore dollar-pegged stablecoin built by Xfers
- [gZIL](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md#governance-tokens-aka-gzil) - Governance ZIL token earned through Zilliqa Seed Node Staking Program

## Checking whether a contract is ZRC-2 compliant 

Before you start any integration with ZRC-2, it is important to check the smart contract to ensure it conform to the ZRC-2 stndard. Non-conformance to the standards may lead to 
composability issue with other contracts or DApp integration. 

You can check the [ZRC-2 specification](../dev/dev-keys-zrc2-wallet-support#zrc-2-specification) section over the Developers section of this portal. 

## Contract Operations

You can check [Integrating with ZRC-2 Fungible Tokens Contract](../dev/dev-keys-zrc2-wallet-support#integrating-with-zrc-2-fungible-tokens-contract) on how to get token balance and transferring of tokens. 

## Tracking incoming ZRC-2 deposit

Tracking incoming ZRC-2 deposit is similar to tracking $ZIL deposit as describe in [Polling for Deposits](exchange-tracking-deposits)


## Other References
- [Sample codes for various ZRC-2 operations](https://github.com/Zilliqa/ZRC/tree/master/example/zrc2)