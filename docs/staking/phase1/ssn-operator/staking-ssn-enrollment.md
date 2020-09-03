---
id: staking-ssn-enrollment
title: Enrollment of SSN into staking smart contract
keywords: 
- staking
- getting started
- staked seed node
- whitelisting
- launching node
- zilliqa
description: Enrollment of SSN into staking smart contract
---
---

## Whitelisting and API Servicing

It is necessary for the staked seed node to be whitelisted by Zilliqa in phase 1 in order to receive data broadcasts about the blockchain and its state. 
Currently, there is 2 form of whitelisting mechanism
1. Whitelisting via a static IP
2. whitelisting via pubic key of the SSN 

We will recommend SSN operator to use whitelisting by public key approach. 

## Smart contract enrollment

We will need to following information to order to enroll your SSN into the smart contract. 

| Information           | Type      | Future adjustment ?   |
|---------------------- | --------- | --------------------- |
| SSN public key        | ByStr20   | No                    |
| SSN operator name     | String    | Contract admin        |
| URL (RAW)             | String    | Contract admin        |
| API URL               | String    | Contract admin        |
| Commission rate       | Uint128   | SSN operator          |

For the initial commission rate, to ensure a fair competition among all existing SSN operators, the initial rate we allowed the SSN to set will be the current commission rate range of all active SSN. For example, if we have 2 active SSN in the network with 5% and 10% respectively. Then, the new SSN operator will only be allowed to set it betwen 5-10%. The SSN operator, however, can subsequencetly re-adjust the commission rate via [`UpdateComm` transition](staking-commission-management#update-commission-rate).