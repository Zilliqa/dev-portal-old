---
id: staking-error-codes
title: Smart Contract Error Codes
keywords:
  - staking
  - ssn
  - smart contract
  - zilliqa
  - error codes
description: Smart Contract Error Codes
---

---

## Overview

The `ssnlist` smart contract will emit out exception with an error code when an error condition is encountered. An example is shown below.

```
Exception thrown: (Message [(_exception : (String "Error")) ; (code : (Int32 -13))]) :188
  Raised from IsProxy :269
  Raised from IsPaused :279
  Raised from DelegateStake :797
```

Here, we will demystify the error codes.

## Error codes

| Error Name                     | Error Code | Description                                                                                                                                   |
| ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ContractFrozenFailure          | -1         | `ssnlist` contract is currently paused state                                                                                                  |
| VerifierValidationFailed       | -2         | The initiator should be a `verifier`                                                                                                          |
| AdminValidationFailed          | -3         | The initiator should be an `admin`                                                                                                            |
| StagingAdminNotExist           | -4         | No staging admin is set                                                                                                                       |
| StagingAdminValidationFailed   | -5         | Failed to validate staging admin                                                                                                              |
| ProxyValidationFailed          | -6         | The caller of this transition must be a registered proxy address                                                                              |
| DelegDoesNotExistAtSSN         | -7         | `Delegator` does not exist for the current `SSN`                                                                                              |
| DelegHasBufferedDeposit        | -8         | `Delegator` has buffered deposit with the current `SSN` and is unable to proceed with this current operation                                  |
| ChangeCommError                | -9         | `SSN operator` has just changed commission in the current reward cycle and will not be able to change it again for this cycle                 |
| SSNNotExist                    | -10        | `SSN` does not exists                                                                                                                         |
| SSNAlreadyExist                | -11        | There is another `SSN` with the same address as what the initiator provided                                                                   |
| DelegHasUnwithdrawRewards      | -12        | `Delegator` has unwithdrawn rewards and is unable to proceed with the current operation                                                       |
| DelegHasNoSufficientAmt        | -13        | `Delegator` is unable to withdraw or redelegate stake as the amount provided is larger than his currnet dekegaed amount with a particular SSN |
| SSNNoComm                      | -14        | `SSN` has no commission for the `SSN operator` to withdraw                                                                                    |
| DelegStakeNotEnough            | -15        | The delegation amount is less than `min stake`                                                                                                |
| ExceedMaxChangeRate            | -16        | The commission change amount is larger than what is allowed by max commission change rate                                                     |
| ExceedMaxCommRate              | -17        | The commission rate cannot be more than the max comission rate i.e 100%                                                                       |
| InvalidTotalAmt                | -18        | Cannot decrease total stake amount                                                                                                            |
| VerifierNotSet                 | -19        | `verifer` is not set                                                                                                                          |
| VerifierRecvAddrNotSet         | -20        | `verifer` receiving address is not set                                                                                                        |
| ReDelegInvalidSSNAddr          | -21        | The initiator is trying to redelegate to a non-existence `SSN`                                                                                |
| AvailableRewardsError          | -22        | Reward validation failure                                                                                                                     |
| InvalidSwapAddr                | -23        | No such address for the swap request or delegator is swapping to the same address                                                             |
| SwapAddrValidationFailed       | -24        | Requestor swap address does not match requestor address                                                                                       |
| SwapAddrAlreadyExistsAsRequest | -25        | A cyclic swap request detected                                                                                                                |
