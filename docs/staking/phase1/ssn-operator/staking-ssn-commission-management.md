---
id: staking-commission-management
title: SSN operators - commission management
keywords: 
- staking
- ssn
- smart contract
- zilliqa	
- node operator 
- commission
description: Commission management
---
---

The operations available to delegator on the smart contract are as follows
1.  Update commission rate
2.  Withdraw commission 
3.  Update address for receiving commission

:::info
Commision amd commission change rate in the staking smart contract are represented by `uint128`. The last 7 digits represents the decimal points. 
As such, if the percentage is 5.2%, then, the value of the commision will be 5.2 x 10^7 represented as an integer *)
:::

## Update commission rate
__Description__  
`UpdateComm` allows the SSN operator to update the commission to a new rate. However, the delta of rate changes must not exceed [max commisison change rate](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md#staking-parameters), `maxcommchangerate`, per cycle. This is to prevent flash changing and allow of gradual changing of commission rate.

__Parameters__

`new_rate`: the new commission rate //TODO what is the decimal denomiation

__Transition__
```
transition UpdateComm(new_rate: Uint128)
```
__Sample Code__

| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | coming soon |
| Java     | coming soon |
| Golang   | coming soon |

## Withdraw commission 
__Description__  
`WithdrawComm` allows the SSN operator to withdraw all the commission earned to the commission receiving address, `rec_addr`. If the SSN operator has updated the commission receiving address, the SSN operator need to call this operator from the updated receiving address.

__Parameters__

`ssnaddr`: the address of the SSN where the node operator wish to withdraw commission from

__Transition__
```
transition WithdrawComm(ssnaddr: ByStr20)
```
__Sample Code__

| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | coming soon |
| Java     | coming soon |
| Golang   | coming soon |

## Update address for receiving commission
__Description__  
`UpdateReceivedAddr` change the receiving commission address to a new address. It also change the withdrawing of commission to this new address.

__Parameters__

`new_addr`: the new address for calling `WithdrawComm  transition and receiving commission

__Transition__
```
transition UpdateReceivedAddr(new_addr: ByStr20)
```
__Sample Code__

| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | coming soon |
| Java     | coming soon |
| Golang   | coming soon |