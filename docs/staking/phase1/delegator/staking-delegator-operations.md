---
id: staking-delegator-operations
title: Smart Contract Operations
keywords:
  - staking
  - ssn
  - smart contract
  - zilliqa
  - delegator
  - delegation
description: Smart contract operations
---

---

The operations available to the delegator on the smart contract are as follows:

1. [Delegate stake](#delegate-stake)
1. [Withdraw stake rewards and gZIL](#withdraw-stake-rewards-and-gzil)
1. [Withdraw stake amount](#withdraw-stake-amount)
1. [Complete withdrawal](#complete-withdrawal)
1. [Stake amount redelegation](#stake-amount-redelegation)

## Representation of Values in the Smart Contract

`_amount` and `amt` are represented in `Qa`, where 1 `ZIL` = 1 \* 1e12 `Qa`.

## Delegate Stake

### Description

`DelegateStake` accepts $ZIL deposit and delegates stake to the SSN identified by `ssnaddr`.

In case of failure to accept the stake, an `exception` will be thrown and the transaction will be reverted. This stake will be buffered if the SSN is already active else it will be added to the stake pool of the SSN. The transition should throw an error in case the amount being delegated is less than `mindelegstake`.

:::info
Due to the non-custodial nature of the staking program, only the owner of the wallet will be able to withdraw the stake amount and stake reward. The SSN operator will not have access to the fund.
:::

### Parameters

`_amount`: the stake amount to be deposited into the smart contract  
`ssnaddr`: the SSN to delegate to

### Transition

```
transition DelegateStake(ssnaddr: ByStr20)
```

### Sample Code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |

## Withdraw Stake Rewards and gZIL

### Description

`WithdrawStakeRewards` withdraws the delegator's stake rewards ($ZIL and `gZIL`) from an SSN. If gZIL issuance is still ongoing, for every 1 $ZIL stake reward given, the delegator will receive 0.001 `gZIL`.

:::info
If the delegator delegates to multiple SSNs and wishes to withdraw all rewards from SSNs, the user will need to call this transition multiple times, specifying a different SSN address each time.
:::

### Parameters

`ssnaddr`: the address of the SSN from which the delegator wishes to withdraw the reward from

### Transition

```
transition WithdrawStakeRewards(ssnaddr: ByStr20)
```

### Sample Code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |

## Withdraw Stake Amount

### Description

`WithdrawStakeAmt` is the first of two operations to withdraw the delegator's stake amount from an SSN. Upon successful calling of this transition, the withdrawn stake amount will enter an **unbonding** state. The delegator will need to wait for the unbonding period to complete before the delegator can successfully invoke `CompleteWithdrawal` transition to complete the withdrawal back to the delegator's wallet. When the stake amount is in unbonding state, it will not be eligible for any new rewards ($ZIL and/or gZIL).

The current unbounding period can be found at [general information](../staking-general-information) page.

:::info
If the delegator delegates to multiple SSNs and wishes to withdraw all rewards from SSNs, the user will need to call this transition multiple times, specifying a different SSN address each time.
:::

### Pre-condition

Thee delegator should not have any unclaimed stake reward or buffered depsoit.
After withdrawal, the delegator remaining stake amount must be bigger than the min delegator stake amount specify in the contract i.e 10 ZIL

### Parameters

`ssnaddr`: the address of the SSN from which the delegator wishes to withdraw reward from  
`amt`: the amount of stake amount to withdraw from the delegation to a particular SSN

### Transition

```
 WithdrawStakeAmt(ssnaddr: ByStr20, amt: Uint128)
```

### Sample Code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |

## Complete Withdrawal

### Description

`CompleteWithdrawal` is the second of two operations required for the withdrawal of delegator's stake amount from a SSN, The delegator will first need to invoke `WithdrawStakeAmt` transition successfully, wait for unbonding of stake amount to be over, and finally call `CompleteWithdrawal` in a separate transaction to complete the withdrawal and receive the stake amount back into the delegator's wallet.

`CompleteWithdrawal` will iterate through all stake amount that has transitted to `unbonding` state, identify the amount that have completed the unbonding process and withdraw it back to delegator's wallet. This operation is agnostic to SSN.

The current unbounding period can be found at [general information](../staking-general-information) page.

### Pre-condition

Thee delegator should not have any unclaimed stake reward or buffered depsoit.

### Parameters

None

### Transition

```
 CompleteWithdrawal()
```

### Sample code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |

## Stake Amount Redelegation

### Description

`ReDelegateStake` allows the delegator to transfer the stake amount from one SSN to another SSN. The stake amount will not enter unbonding state. However, buffering of stake amount may still apply.

### Parameters

`ssnaddr`: the existing SSN where the stake amount will be withdrawn from and transferred to a new SSN
`to_ssn`: the new SSN to accept the stake amount delegation
`amount`: the amount of the stake amount to transfer to the new SSN

### Transition

```
transition ReDelegateStake(ssnaddr: ByStr20, to_ssn: ByStr20, amount: Uint128)
```

### Sample Code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |
