---
id: staking-before-you-start
title: Before you start
keywords: 
- staking
- ssn
- smart contract
- zilliqa	
- node operator 
description: Before you start
---
---

Before you begin your journey as a staked seed node (SSN) operator, please read through the following to get a better understanding of the role and purpose of staked seed node.

## What exactly is a seed node?
Seed node is a Zilliqa full node that does not participate in Zilliqa network consensus. The purpose of seed node is as follows:
- serves as direct access points (for end users and clients) to the core Zilliqa network that validates transactions
- consolidate transaction requests and forward these to the lookup nodes (another type of nodes) for distribution to the shards
- maintain the entire transaction history and the global state of the blockchain which is needed to provide services such as block explorers.

## What is the difference between seed node and staked seed node
Seed nodes have been part of Zilliqa ecosystem since day 1. They are vital as they provides [API](https://apidocs.zilliqa.com/#introduction) access to dApp, wallets, explorers and exchanges. Most seed nodes are private and access is restricted to operator infrastructure. Zilliqa has provided a set of public seed nodes access over at [https://api.zilliqa.com](https://api.zilliqa.com). 

The purpose of staked seed node is to "open up" some of these nodes to trusted operators, bringing a step towards the decentralization of the overall seed node architecture. To attract high quality seed node operators, a proper incentive mechanism must be put in place. This is described in both [ZIP-3](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-3.md) and [ZIP-11](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md). We highly recommend anyone who wish to become SSN operator in phase one to read ZIP-11. 

## Who is eligible for running a SSN in phase 1? 
The SSN in phase 1 is only admissible via a whitelisting of public key of the SSN and we may not be able to accommodate all requests of running a SSN at launch of phase 1. 

The rationale behind whitelisting is to 
- ensure no degradation of seed node network due to overloading of SSN
- allows high quality SSN operators to avoid API disruption to dAPP within the 

As such, we will be prioritising SSN operators based on the following factors. Do note these are not hard requirements and we will assess each operators hollistically. 
- Ability to run and maintain high availability of seed node
- Ability to reach the minimums stake amount as described in ZIP-11
- Ability to continously maintains the SSN over the long term
- Ability to upgrade SSN promptly after network upgrade
- Ability to provide value added services such as wallet UI or explorers
- Zilliqa community oriented SSN operators

We will have a gradual roll out of SSN operators. So, don't worry if you are not a SSN operators on day 1!

## What next?
Before you proceeds to set up the SSN, please contact the Zilliqa tech team at maintainer[at]zilliqa.com to set up a communication channel. This channel will be used by the Zilliqa team to understand more about the potential SSN operators and also provide timely information about Zilliqa network activitiies such as network upgrades. 