---
id: staking-ssn-enrollment
title: Enrolment of SSN into Staking Smart Contract
keywords:
  - staking
  - staked seed node
  - enrollment
  - smart contract
  - zilliqa
description: Enrollment of SSN into staking smart contract
---

---

We will need the following information in order to enrol your SSN into the smart contract. Enrollment of SSN operation can only be done by Zilliqa team.

| Information       | Type    | Future Adjustment? |
| ----------------- | ------- | ------------------ |
| SSN address       | ByStr20 | No                 |
| SSN operator name | String  | Contract admin     |
| URL (RAW)         | String  | Contract admin     |
| API URL           | String  | Contract admin     |
| Commission rate   | Uint128 | SSN operator       |

For SSN address, please ensure this wallet address is secure eg. Ledger. We cannot changed it once enrolled.
For both `URL (RAW)` and `API URL`, please provide the port number.

To ensure fair competition among all existing SSN operators, the initial commission rate we allow an SSN to set will be bwtween 0- 20%. The SSN operator, however, can subsequently re-adjust the commission rate via [`UpdateComm`](staking-commission-management#update-commission-rate) transition.
