---
id: staking-commission-management
title: Commission Management
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

The operations available to delegators on the smart contract are as follows:

1. [Update commission rate](#update-commission-rate)
1. [Withdraw commission](#withdraw-commission)
1. [Update address for receiving commission](#update-address-for-receiving-commission)

:::info
Commission and commission change rate in the staking smart contract are represented by `uint128`. The last 7 digits represent the decimal points. As such, if the percentage is 5.2%, then the value of the commission will be 5.2 x 10^7 represented as an integer).
:::

## Update Commission Rate

### Description

`UpdateComm` allows the SSN operator to update the commission to a new rate. The delta of rate changes must not exceed [max commission change rate](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md#staking-parameters) (`maxcommchangerate`) per cycle. This is to prevent flash changing and allow for a more gradual adjustment of the commission rate. Finally, the new rate must be less than or equal to `maxcommchangerate`.

### Pre-condition

The node operator must not have change commission rate in the current cycle.

### Parameter

`new_rate`: the new commission rate

### Transition

```
transition UpdateComm(new_rate: Uint128)
```

### Sample Code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |

## Withdraw Commission

### Description

`WithdrawComm` allows the SSN operator to withdraw all the commission earned to the commission receiving address `rec_addr`.

:::info
Regardless of whether the receiving address has been updated or not, this operation can only be called from the SSN operator address.
:::

### Parameters

None

### Transition

```
transition WithdrawComm()
```

### Sample Code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |

## Update Address for Receiving Commission

### Description

`UpdateReceivedAddr` changes the receiving commission address to a new address.

### Parameters

`new_addr`: the new address for receiving commission when calling `WithdrawComm` transition

### Transition

```
transition UpdateReceivedAddr(new_addr: ByStr20)
```

### Sample Code

| Language | Link to Sample Code |
| -------- | ------------------- |
| NodeJS   | coming soon         |
| Java     | coming soon         |
| Golang   | coming soon         |
