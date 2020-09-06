---
id: staking-phase1-overview
title: Phase 1  Overview
keywords: 
- staking
- overview
- ssn
- seed node
- phase 1
- zilliqa	
description: Phase 1 Overview
---

Welcome to phase 1 of the Zilliqa Seed node staking program. Phase 1 of the staking is formally proposed in [Zilliqa Improvement Proposal 11](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md), building on the effort layout out in [Zilliqa improvement proposal 3](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-3.md).

In phase 0, we introduce the Zilliqa seed node staking program. The staking mechanism was simple. There are 3 different roles
1. SSN operator
2. Verifier
3. Contract admin

The SSN operator takes on the role of a staker and a node operator concurrently. As such, if the operator wishes to collect stake deposit from any staker, the operator needs to provide an out of band platform, such as a staking pool platform to collect deposit and distribute rewards. This form of staking may not be ideal for some, as they will need to trust an intermediary for holding the stake deposit and fair distribution of rewards.

Phase 1 addressed these issues by introducing a new role called `delegator`. The `Delegator` can deposit stake deposit directly into staking contract and receive rewards directly. This removed the need to trust an intermediary. `SSN operator` role has also been re-adjusted. `SSN operator` no longer needs to handle stake deposit and rewards. Instead, the `SSN operator` can focus on operating the SSN, managing and receiving the commission fees.

The following phase 1 staking documentation is split into two categories, `delegator` and `SSN operator`.

The [`delegator` section](delegator/staking-delegator-overview) targets the following audiences
- Staking wallet builders
- Staking dashboard builders
- `delegator` who want to build their own scripts

The [`SSN operator` section]() targets the operator who wishes to run a SSN. They can be either custodial or non-custodial.
- Explorer and wallet providers who wish to run a SSN
- Staking as a service provider
- API as a service provider
- Zilliqa community members who wish to step up to run a Zilliqa community SSN
- Exchanges who provide staking on their platform

Zilliqa token holders who wish to stake can simply refer to the following references on how to stake and delegate their token
- Coming soon
