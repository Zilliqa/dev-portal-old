---
id: staking-ssn-enrollment
title: Enrollment of SSN into staking smart contract
keywords: 
- staking
- staked seed node
- enrollment
- smart contract
- zilliqa
description: Enrollment of SSN into staking smart contract
---
---

We will need to following information to order to enroll your SSN into the smart contract. 

| Information           | Type      | Future adjustment?    |
|---------------------- | --------- | --------------------- |
| SSN public key        | ByStr20   | No                    |
| SSN operator name     | String    | Contract admin        |
| URL (RAW)             | String    | Contract admin        |
| API URL               | String    | Contract admin        |
| Commission rate       | Uint128   | SSN operator          |

For both `URL (RAW)` and `API URL`, please provide the port number. 

For the initial commission rate, to ensure a fair competition among all existing SSN operators, the initial rate we allowed the SSN to set will be the current commission rate range of all active SSN. For example, if we have 2 active SSN in the network with 5% and 10% respectively. Then, the new SSN operator will only be allowed to set it between 5-10%. The SSN operator, however, can subsequently re-adjust the commission rate via [`UpdateComm` transition](staking-commission-management#update-commission-rate).