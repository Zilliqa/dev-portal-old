---
id: staking-overview
title: Overview
keywords:
  - staking
  - overview
  - ssn
  - seed node
  - zilliqa
description: Zilliqa Seed Node Staking Overview
---

Welcome to the seed node staking section. Staking in Zilliqa has been implemented in several phases.

## Phase 0

Phase 0 is the initial, past phase of the seed node staking program. Phase 0 is formally described in [ZIP-3](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-3.md).

The goals of phase 0 are:

- Open up the seed nodes network to more operators
- Introduce staking at the seed node operation level

A seed node within the staking program is referred to as a **Staked Seed Node** or **SSN**.

## Phase 1

Phase 1 is the past phase of SSN staking. Phase 1 is formally described in [ZIP-11](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md).

Phase 1 introduces:

- A mechanism for stake delegation, which removes the need to deposit $ZIL with an intermediary custodian
- Uncapped staking
- Stake rewards in the form of gZIL token, a ZRC-2 compliant governance token
- Bonding of stake amount

## Phase 1.1

[Phase 1.1](phase1/overview.md) is the current phase of SSN staking. It build on top of phase 1 staking and is formally described in [ZIP-19](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-19.md).

Phase 1.1 consists of all features from phase 1 and further introduces

- transfer stake deposit between accounts
- remove of custom ADT in `AssignStakeRewards` transition
- proper removal of empty map entries
- changes to staking parameters in conjuction with changes in Zilliqa `v8.0.0`
