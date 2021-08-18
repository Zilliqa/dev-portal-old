---
id: staking-ssn-before-you-start
title: Before You Start
keywords:
  - staking
  - ssn
  - smart contract
  - zilliqa
  - node operator
description: Before you start
---

---

Before you begin your journey as a Staked Seed Node (SSN) operator, please read through the following to get a better understanding of the role and purpose of a staked seed node.

## What Exactly is a Seed Node?

A seed node is a Zilliqa full node that does not participate in Zilliqa network consensus. The purpose of seed nodes are as follows:

- Serve as direct access points (for end users and clients) to the core Zilliqa network that validates transactions
- Consolidate transaction requests and forward these to the lookup nodes (another type of node) for distribution to the shards
- Maintain the entire transaction history and the global state of the blockchain, which is needed to provide services such as block explorers

## What is the Difference between Seed Node and Staked Seed Node?

Seed nodes have been a part of the Zilliqa ecosystem since day 1. They are vital as they provide [API](https://apidocs.zilliqa.com/#introduction) access to dApps, wallets, explorers, and exchanges. Most seed nodes are private and access is restricted to the operator's infrastructure. Zilliqa has provided a set of seed nodes publicly accessible at [api.zilliqa.com](https://api.zilliqa.com).

The purpose of staked seed nodes (SSNs) is to "open up" seed nodes to trusted operators, bringing us a step closer towards the decentralization of the overall seed node architecture. To attract high-quality seed node operators, a proper incentive mechanism must be put in place. This is described in both [ZIP-11](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md) and [ZIP-19](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-19.md). We highly recommend anyone who wishes to become an SSN operator in phase 1.1 to read ZIP-11 and ZIP-19.

## Who is Eligible for Running an SSN in Phase 1.1?

The SSN in phase 1.1 is admissible via a whitelisting of the public key of the SSN. We may not be able to accommodate all requests for running an SSN at the launch of phase 1.

The rationale behind whitelisting is to:

- Ensure no degradation of the seed node network due to overloading of SSNs
- Select and onboard high-quality SSN operators

As such, we will be prioritizing SSN operators based on the following factors. Do note these are not hard requirements and we will assess each operator holistically.

- Ability to run and maintain high availability of seed node
- Ability to reach the minimum stake amount as described in ZIP-11
- Ability to continuously maintain the SSN over the long term
- Ability to upgrade SSN promptly after network upgrades
- Ability to provide value-added services such as wallet UI or explorers
- Zilliqa community-oriented SSN operators

## What's Next?

Before you proceed to set up the SSN, please contact the Zilliqa tech team at maintainers[at]zilliqa.com to set up a communication channel. This channel will be used by the Zilliqa team to understand more about potential SSN operators, as well as to provide timely information about Zilliqa network activities such as network upgrades.
