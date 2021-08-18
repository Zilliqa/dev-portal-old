---
id: exchange-transaction-receipts
title: Understanding Transaction Receipts
keywords:
  - transaction receipts
  - fields
  - polling
  - exchanges
  - zilliqa
description: Transaction Receipts Exchanges
---

---

## Transaction Receipts

Confirmed transactions come with a **receipt** under the **result** field when [fetching the transaction](https://apidocs.zilliqa.com/#gettransaction) in JSON format.

## Basic Fields

The following are the fields a **receipt** may have. These fields generally apply to both payment and contract transactions.

| Field              | Type    | Description                                              |
| :----------------- | :------ | :------------------------------------------------------- |
| **cumulative_gas** | string  | The total gas consumed in this transaction               |
| **epoch_num**      | string  | The epoch number in which this transaction was confirmed |
| **success**        | boolean | The result of this transaction (`true` on success)       |

For example:

```
"receipt": {
  "cumulative_gas": "10481",
  "epoch_num": "586524",
  "success": true
},
```

## Additional Fields

For smart contract transactions, additional information relating to smart contract execution is contained in additional fields under the "**receipt**".

### Successful Transactions

If a transaction is successful (i.e., the **success** field is `true`), these fields will be present:

| Field           | Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :-------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **accepted**    | boolean    | Indicates whether the last transition in this transaction incurred a **balance transfer**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **event_logs**  | json-array | A list of event logs emitted by the contract during processing. Each log contains:<ol><li>**\_eventname**: [string] The name of the event</li><li>**address**: [string] The address of the contract that emitted this event</li><li>**params**: [json-array] A list of parameters under the transition. Each entry contains:<ul><li>**vname**: [string] The name of the variable</li><li>**type**: [string] The type of the variable</li><li>**value**: [string] The value of the variable</li></ul></li></ol>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **transitions** | json-array | A list of internal transitions invoked during the processing of the transaction by the Scilla interpreter. Each transition contains:<ol><li>**addr**: [string] The address of the contract account that emitted this transition</li><li>**depth**: [int] The depth of the current transition. The transitions directly emitted by the recipient in the transaction will be in depth 0. If those transitions in depth 0 invoked transitions from other contracts, those will be in depth 1. And so on and so forth.</li><li>**msg**: [json-object] The message field emitted by the Scilla interpreter, which includes:<ul><li>**\_amount**: [string] The balance transferred from this transition</li><li>**\_recipient**: [string] The recipient of this transition, which can either be a wallet account or contract account</li><li>**\_tag**: [string] The contract-defined transition name</li><li>**params**: [json-array] A list of parameters under the transition. Each entry contains:<ul><li>**vname**: [string] The name of the variable</li><li>**type**: [string] The type of the variable</li><li>**value**: [string] The value of the variable</li></ul></li></ul></li></ol> |

For example:

```
"receipt": {
  "accepted": true,
  "cumulative_gas": "878",
  "epoch_num": "589742",
  "event_logs":[
    {
      "_eventname":"RecordsSet",
      "address":"0x708bfbba57436ed45efc13df9fab4249a354e06b",
      "params":[
        {
          "type":"ByStr20",
          "value":"0x9611c53be6d1b32058b2747bdececed7e1216793",
          "vname":"registry"
        },
        {
          "type":"ByStr32",
          "value":"0x2bb13c9b0a5dd28d42b470e2073df14608a9056310988b84b24dc342211e0627",
          "vname":"node"
        }
      ]
    },
  ],
  "success": true,
  "transitions": [
    {
      "addr": "0x9a65df55b2668a0f9f5f749267cb351a37e1f3d9",
      "depth": 0,
      "msg": {
        "_amount": "50000000000000",
        "_recipient": "0xc0e28525e9d329156e16603b9c1b6e4a9c7ed813",
        "_tag": "onFundsReceived",
        "params": [
          "vname": "emp_addr",
          "type": "ByStr20",
          "Value": "0x00345678901234567890123456789012345678ab"
        ]
      }
    }
  ]
}

```

### Unsuccessful Transactions

If a transaction is unsuccessful (i.e., the **success** field is `false`), no balance transfer will be executed. Additionally, these fields will be present:

| Field          | Type        | Description                                                                                                                                                                                                                                                                                                                                                                  |
| :------------- | :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **errors**     | json-object | An object containing a key-value field. The key [string] indicates the depth at which the error occurred. The value part is a JSON array that lists the error codes [int] reported. The list of possible error codes can be found [here](https://github.com/Zilliqa/Zilliqa/blob/8b088f8ea63f1aab43fde8bbb9741ecaf36b089b/src/libData/AccountData/TransactionReceipt.h#L32). |
| **exceptions** | json-array  | A list of exceptions returned by the Scilla interpreter. Each exception contains:<ol><li>**line”**: [int] The line in the Scilla contract code where the exception was detected</li><li>**message**: [string] The message describing the exception</li></ol>                                                                                                                 |

For example:

```
"receipt": {
  "cumulative_gas": "1220",
  "epoch_num": "588004",
  "errors": {
    "0": [
      7
    ]
  },
  "exceptions": [
    {
      "line": 87,
      "message": "Exception thrown: (Message [(_exception : (String \"Error\")) ; (code : (Int32 -2))])"
    },
    {
      "line": 100,
      "message": "Raised from IsAdmin"
    },
    {
      "line": 137,
      "message": "Raised from ConfigureUsers"
    }
  ],
  "success": false
  }
```

## Recommended Steps for Exchanges Polling for Incoming $ZIL Deposit from Smart Contract Transactions

1. Confirm that the **success** field is set to `true`.
1. Traverse the **transitions** JSON array. For each transition, for a successful deposit of `$ZIL` via the smart contract, the following must be fulfilled:
   1. **\_recipient** corresponds to a known deposit address controlled by the exchange.
   2. **\_tag** is either `AddFunds` or empty.
      :::note
      `_tag` can be found under `msg` field. If either `_tag` or `msg` is not present, there is no incoming deposit from this particular transition.
      :::
   3. **\_amount** is non-zero.
   4. Check the **\_recipient** and **\_amount** to complete the information on the balance transfer. In such a case, you can confirm that there is a deposit
      to address **\_recipient** with value **\_amount** (in `Qa`).
   5. Continue traversing the remaining transitions and checking for more deposits.
