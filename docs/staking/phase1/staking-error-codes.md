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

| Error Name | Error Code | Description |
| ---------- | ---------- | ----------- | 
| ContractFrozenFailure | -1 | `ssnlist` contract is currently paused state | 
| VerifierValidationFailed | -2 | The initiator should be a `verifier` | 
| AdminValidationFailed | -3 | The initiator should be an `admin` | 
| ProxyValidationFailed | -4 | The caller of this transition must be a registered proxy address | 
| DelegDoesNotExistAtSSN | -5 | `Delegator` does not exist for the current `SSN` | 
| DelegHasBufferedDeposit | -6 | `Delegator` has buffered deposit with the current `SSN` and is unable to proceed with this current operation | 
| ChangeCommError | -7 | `SSN operator` has just changed commission in the current reward cycle and will not be able to change it again for this cycle | 
| SSNNotExist | -8 | `SSN` does not exists | 
| SSNAlreadyExist | -9 | There is another `SSN` with the same address as what the initiator provided | 
| DelegHasUnwithdrawRewards | -10 | `Delegator` has unwithdrawn rewards and is unable to proceed with the current operation | 
| DelegHasNoSufficientAmt | -11 | `Delegator` is unable to withdraw or redelegate stake as the amount provided is larger than his currnet dekegaed amount with a particular SSN | 
| SSNNoComm | -12 | `SSN` has no commission for the `SSN operator` to withdraw | 
| DelegStakeNotEnough | -13 | The delegation amount is less than `min stake` | 
| ExceedMaxChangeRate | -14 | The commission change amount is larger than what is allowed by max commission change rate | 
| ExceedMaxCommRate | -15 | `The commission rate cannot be more than the max comission rate i.e 100% | 
| InvalidTotalAmt | -16 | Cannot decrease total stake amount | 
| InvalidRecvAddr | -17 | Depreciated | 
| VerifierNotSet | -18 | `verifer` is not set | 
| VerifierRecvAddrNotSet | -19 | `verifer` receiving address is not set | 
| ReDelegInvalidSSNAddr | -20 | The initiator is trying to redelegate to a non-existence `SSN` | 

