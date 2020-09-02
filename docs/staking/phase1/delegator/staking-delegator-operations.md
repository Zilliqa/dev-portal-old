---
id: staking-delegator-operations
title: Delegator operations
keywords: 
- staking
- ssn
- smart contract
- zilliqa	
- delegator
- delegation
description: Delegator operations
---
---

The operations available to delegator on the smart contract are as follows
1.  Delegate stake 
2.  Withdraw Stake rewards
3.  Withdraw stake amount
4.  Complete withdrawal 

## Delegate stake
__Description__  
`DelegateStake` accepts $ZIL deposit and delegate stake to the SSN identified by `ssnaddr`. 

:::info
Due to the non-custodial nature of phase 1 staking program, only the owner of the wallet will be able to withdraw stake amount and stake reward. The SSN operator will not have access to user's fund. 
:::

__Parameters__

`_amount`: stake amount to be deposit into the smart contract  
`ssnaddr`: the SSN to delegate to

__Transition__
```
transition DelegateStake(ssnaddr: ByStr20) 
```

__sample code__

| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | coming soon |
| Java     | coming soon |
| Golang   | coming soon |

TODO: Add how to get list of SSN and corresponidng SSN addr

## Withdraw stake rewards
__Description__  
`WithdrawStakeRewards` withdraws delegator's stake rewards ($ZIL and gZIL) from a SSN.

:::info
If the delegator delegates to multiple SSN and wish to withdraw all rewwards from SSN, the user will need to call this transition multiple times, specifying different SSN address each time.
:::

__Parameters__
`ssn_operator`: The address of the SSN from which the delegator wish to withdraw reward form

__Transition__
```
transition WithdrawStakeRewards(ssn_operator: ByStr20)
```

__sample code__

| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | coming soon |
| Java     | coming soon |
| Golang   | coming soon |

## Withdraw stake amount

## Complete withdrawal
