---
id: staking-delegator-overview
title: Delegator overview
keywords: 
- staking
- ssn
- smart contract
- zilliqa	
- delegator
- overview
description: Delegator overview
---
---

# Overview of stake delegation 
In [phase 1](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md) of Zilliqa seed node staking program, to increase the stake deposit of staked seed node (SSN), $ZIL token, whom wish to participate in the phase 1 staking program, can choose to deposit stake into staking smart contract and delegator the stake to SSN. By doing so, the SSN's stake deposit will increase and delegator can receive staking rewards in the from of $ZIL and gZIL. The amount of rewards will depends on the total stake deposit on the network and the performance of the SSN.  

// note about NC

In case of ZIP-11, delegators can directly deposit their tokens into the contract by providing the address of the operator with which they wish to stake. ZIP-11 removes the need of any intermediate addresses. ZIP-11 therefore provides a non-custodial mechanism to delegate tokens. The non-custodial property comes from the fact that there is no single entity that holds the asset on behalf of delegators at any point of time. Assets are either in the hands of the delegator or held in a contract on-chain, the mechanics of which is transparent to the public.