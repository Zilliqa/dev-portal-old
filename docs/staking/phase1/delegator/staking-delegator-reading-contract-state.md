---
id: staking-delegator-reading-contract-states
title: Reading contract states
keywords: 
- staking
- ssn
- smart contract
- zilliqa	
- delegator
- contract states
description: Reading contract states
---

In this section, we will cover through a few read operation that will be useful from a delegator's perspective.  They are

- [Current list of SSNs](#get-the-current-list-of-ssn)
- [Delegator's buffered deposit](#get-delegators-buffered-deposit)
- [Delegator's stake amount](#get-delegators-stake-amount)
- Delegator's stake reward
- Delegator's reward history
- [Delegator's pending stake withdrawal request](#get-delegators-pending-stake-withdrawa-request)
- Delegation history

In order to read the above information from the smart contract, you should use [`GetSmartContractSubState` API](https://apidocs.zilliqa.com/#getsmartcontractsubstate) and query it from the `ssnlist` smart contract

## Get the current list of SSN
### Inputs
- Address of `ssnlist` smart contract
- ssnlist

```json 
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetSmartContractSubState",
    "params": ["<ssnlist contract address>","ssnlist",[]]
}' -H "Content-Type: application/json" -X POST "https://dev-api.zilliqa.com/"
```

### Output
Return of map of ssn with the corresponding ssn datatype

Map SSN address -> [SSN Data type](https://github.com/Zilliqa/staking-contract/tree/spec/contracts#data-types)

```json
{
   "id":"1",
   "jsonrpc":"2.0",
   "result":{
      "ssnlist":{
         "<ssn addr>":{
            "argtypes":[
               
            ],
            "arguments":[
               {
                  "argtypes":[
                     
                  ],
                  "arguments":[
                     
                  ],
                  "constructor":"<ActiveStatus>"
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

## Get delegator's buffered deposit
### Inputs
- Address of `ssnlist` smart contract
- `buff_deposit_deleg`
- Addreess of delegator

__Example__  
```bash
curl -d '{
>     "id": "1",
>     "jsonrpc": "2.0",
>     "method": "GetSmartContractSubState",
>     "params": ["<ssnlist contract address>","buff_deposit_deleg",["0x<address of delegator>"]]
> }' -H "Content-Type: application/json" -X POST "<api endpoint>"
```

### Output
Return a map of `ssn address` with the value being a map of `cycle number` and the `buffered deposit` at that particular `cycle number` 

Map `SSN addreess` -> Map `Cycle number` `buffered deposit amount in Qa` 
:::info
Cycle number refers the cycler number of the smart contract when the deposit was submitted to buffered deposit. 
:::

__Example__  
```json
{"<ssn address>":{"<cycle number>":"<deposit amount>"}}
```

## Get delegator's stake amount
### Inputs
- Address of `ssnlist` smart contract
- `withdrawal_pending`
- Addreess of `delegator`

__Example__  
```bash
curl -d '{
>     "id": "1",
>     "jsonrpc": "2.0",
>     "method": "GetSmartContractSubState",
>     "params": ["<ssn contract address>","deposit_amt_deleg",["<delegator address>"]]
> }' -H "Content-Type: application/json" -X POST "api endpoing"
```


### Output
Return a map consisting of ssn address and the correspodning delegated amount for a particular delegator  

Map `ssn address` -> `delegatoed amount`
```json
{"<ssn addr>":"<delegated amount>",
"<ssn addr>":"<delegated amount>"}
```

## Get delegator's stake reward
Coming soon

## Get delegator's reward history
Coming soon

## Get delegator's pending stake withdrawa request 
### Inputs
- Address of `ssnlist` smart contract
- `deposit_amt_deleg`
- Addreess of `delegator`

__Example__  
```bash
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetSmartContractSubState",
    "params": ["<ssnlist contract address>","withdrawal_pending",["0x<address of delegator>"]]
}' -H "Content-Type: application/json" -X POST "<api endpoint>"

```

### Output
Return a map of consisting the `epoch number` when the withdraw was initiaited and the corresponding `amounnt` to withdraw

Map `epoch number` -> `Pending withdrawal amount`
```json
{"<epoch number>":"<amount (Qa) to be withdrawn>",
"<epoch number>":"<amount (Qa) to be withdrawn>"}
```

## Get delegation history
Coming soon 
