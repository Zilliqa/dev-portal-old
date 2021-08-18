---
id: staking-phase1-overview
title: Phase 1.1 Overview
keywords:
  - staking
  - overview
  - ssn
  - seed node
  - phase 1
  - zilliqa
description: Phase 1.1 Overview
---

Welcome to phase 1.1 of the Zilliqa seed node staking program. We invite interested participants to read through the formal documentation for phase 1 in [Zilliqa Improvement Proposal 19](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-19.md).

Phase 1.1 builds on the design laid out in [ZIP-3](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-3.md) and [ZIP-11](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md).

In phase 0, we introduced our staking program with a simple mechanism involving 3 different roles:

1. SSN operator
1. Verifier
1. Contract admin

The SSN operator takes on the dual roles of a staker and a seed node operator. As such, if the operator wishes to collect stake deposits from non-operator individuals, the operator would need to provide an out-of-band platform (such as a staking pool platform) to support deposit collection and rewards distribution. This form of staking may not be ideal for some, as they would need to trust this intermediary (i.e., the operator) for holding their stake deposit and distributing their rewards fairly.

Phase 1 addresses these issues by introducing a new role called the **delegator**. The delegator can deposit its stake directly into the staking contract, as well as receive rewards directly from the contract. This removes the need to trust an intermediary. The role of the SSN operator has also been adjusted in phase 1. The SSN operator no longer needs to handle stake deposits and rewards. Instead, the operator can focus on overseeing the operation of its SSN, as well as managing the commission fees it receives from delegators.

Phase 1.1 adds new functionality to phase 1.1, namely the ability to transfer stake deposit from one address to another address. It also introduce code fixes for phase 1.

## How to Proceed

:::danger Disclaimer
Please read our [Disclaimer](../staking-disclaimer) page carefully before participating in our staking program.
:::

The next sections in this phase 1.1 documentation are organized as follows:

1. The [General Information](staking-general-information) section contains useful details for anyone interested in the staking program
1. The [Delegators](delegator/staking-delegator-overview) section targets the following audiences:
   - Staking wallet builders
   - Staking dashboard builders
   - Delegators who want to build their own toolchains
1. The [SSN Operators](ssn-operator/staking-ssn-before-you-start) section targets operators who wish to launch and maintain an SSN. These operators, which can be either custodial or non-custodial, include:
   - Explorer and wallet providers
   - Staking-as-a-Service providers
   - API-as-a-Service providers
   - Interested Zilliqa community members
   - Exchanges who provide staking on their platform

Zilliqa token holders who wish to stake can simply refer to [https://www.zilliqa.com/staking](https://www.zilliqa.com/staking) on how to stake and delegate their tokens.
