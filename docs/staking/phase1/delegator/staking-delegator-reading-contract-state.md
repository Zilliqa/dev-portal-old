---
id: staking-delegator-reading-contract-states
title: Reading Contract States
keywords:
  - staking
  - ssn
  - smart contract
  - zilliqa
  - delegator
  - contract states
description: Reading contract states
---

In this section, we will cover a few read operations that are useful from a delegator's perspective. These are:

- [Current list of SSNs](#getting-the-current-list-of-ssns)
- [List of delegators for a SSN](#getting-the-list-of-delegators-for-a-ssn)
- [Delegator's buffered deposit](#getting-the-delegators-buffered-deposit)
- [Delegator's stake amount](#getting-the-delegators-stake-amount)
- [Delegator's stake reward](#getting-the-delegators-stake-reward)
- [Delegator's reward history](#getting-the-delegators-reward-history)
- [Delegator's pending stake withdrawal request](#getting-the-delegators-pending-stake-withdrawal-request)
- [Delegation history](#getting-delegation-history)

In order to read the above information from the smart contract, you should use the [`GetSmartContractSubState`](https://apidocs.zilliqa.com/#getsmartcontractsubstate) API by querying it from the `ssnlist` smart contract.

## Getting the Current List of SSNs

### Inputs

- Address of `ssnlist` smart contract
- `ssnlist`

```json
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetSmartContractSubState",
    "params": ["<ssnlist contract address>","ssnlist",[]]
}' -H "Content-Type: application/json" -X POST "<api endpoint>"
```

### Output

Map of SSN with the corresponding SSN data type

Map SSN address -> [SSN data type](https://github.com/Zilliqa/staking-contract/tree/spec/contracts#data-types)

```json
{
  "id": "1",
  "jsonrpc": "2.0",
  "result": {
    "ssnlist": {
      "<ssn addr>": {
        "argtypes": [],
        "arguments": [
          {
            "argtypes": [],
            "arguments": [],
            "constructor": "<ActiveStatus>"
          },
          "<StakeAmount>",
          "<StakeRewards>",
          "<name of ssn>",
          "<staking api url>",
          "<api url>",
          "<buffered deposit>",
          "<comission rate>",
          "<commssion rewards>",
          "<ssn commission receiving address>"
        ]
      }
    }
  }
}
```

## Getting the List of Delegators for a SSN

### Inputs

- Address of `ssnlist` smart contract
- `ssn_deleg_amt`
- Address of SSN

**Example**

```bash
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetSmartContractSubState",
    "params": ["<ssnlist contract addresss>","ssn_deleg_amt",["0x<address of SSN>"]]
}' -H "Content-Type: application/json" -X POST "<api endpoint>"
```

### Output

Map `SSN addreess` -> Map `delegator address` `stake deposit amount`

**Example**

```json
{ "<ssn address>": { "<delegator address>": "<stake deposit amount>" } }
```

## Getting the Delegator's Buffered Deposit

### Inputs

- Address of `ssnlist` smart contract
- `buff_deposit_deleg`
- Address of delegator

**Example**

```bash
curl -d '{
>     "id": "1",
>     "jsonrpc": "2.0",
>     "method": "GetSmartContractSubState",
>     "params": ["<ssnlist contract address>","buff_deposit_deleg",["0x<address of delegator>"]]
> }' -H "Content-Type: application/json" -X POST "<api endpoint>"
```

### Output

Map of `ssn address` with the value being a map of `cycle number` and the `buffered deposit` at that particular `cycle number`

Map `SSN address` -> Map `Cycle number` `buffered deposit amount in Qa`

:::info
Cycle number refers to the cycle number of the smart contract when the deposit was submitted to buffered deposit.
:::

**Example**

```json
{ "<ssn address>": { "<cycle number>": "<deposit amount>" } }
```

## Getting the Delegator's Stake Amount

### Inputs

- Address of `ssnlist` smart contract
- `deposit_amt_deleg`
- Address of `delegator`

**Example**

```bash
curl -d '{
>     "id": "1",
>     "jsonrpc": "2.0",
>     "method": "GetSmartContractSubState",
>     "params": ["<ssn contract address>","deposit_amt_deleg",["<delegator address>"]]
> }' -H "Content-Type: application/json" -X POST "api endpoint"
```

### Output

Map consisting of SSN address and the corresponding delegated amount for a particular delegator

Map `ssn address` -> `delegated amount`

```json
{ "<ssn addr>": "<delegated amount>", "<ssn addr>": "<delegated amount>" }
```

## Getting the Delegator's Stake Reward

Coming soon

## Getting the Delegator's Reward History

Coming soon

## Getting the Delegator's Pending Stake Withdrawal Request

### Inputs

- Address of `ssnlist` smart contract
- `withdrawal_pending`
- Address of `delegator`

**Example**

```bash
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetSmartContractSubState",
    "params": ["<ssnlist contract address>","withdrawal_pending",["0x<address of delegator>"]]
}' -H "Content-Type: application/json" -X POST "<api endpoint>"

```

### Output

Map consisting of the `epoch number` when the withdrawal was initiated and the corresponding `amount` to withdraw

Map `epoch number` -> `Pending withdrawal amount`

```json
{
  "<epoch number>": "<amount (Qa) to be withdrawn>",
  "<epoch number>": "<amount (Qa) to be withdrawn>"
}
```

## Getting Delegation History

Coming soon
