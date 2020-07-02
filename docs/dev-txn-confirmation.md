---
id: dev-txn-confirmation
title: Confirmation
language_tabs: # must be one of https://git.io/vQNgJ
  - javascript: node.js
  - go: go
  - java: java
---
Now the transaction object is in one of the shard. Each shard will produce a __Micro Block__. Micro Blocks are aggregated by the DS Committee into a Transaction Block, after the DS Committee agrees on the Transaction Block through the pBFT consensus mechanism.

After the DS Committee reaches consensus on the Transaction Block, it multicases the result to all shard nodes and lookup nodes. At this stage, the seed node will have a result for our transaction object. The result can be retrieved using the same `GetTransaction` JSON RPC API.

__Note:__ The example below uses the ZilliqaJS SDK to retrieve the transaction response. The structure may be _slightly different_ from the __JSON RPC__ `GetTransaction` results.

Example of getting transaction:
```javascript
const txn = await zilliqa.blockchain.getTransaction("1899b381d644a4892ca5ba5d8d60bbcc7bd121d511d55e438a8ddbdcc53272c4");
console.log(JSON.stringify(txn));
```

```go
provider := NewProvider("https://dev-api.zilliqa.com/")
result, _ := provider.GetTransaction("c7d6550a6558edcddbf4b3c7cf14db9f1025200b89bcbcd6a570c84db58d554f")
resStr,_ := json.Marshal(result)
fmt.Println(string(resStr))
```

```java
HttpProvider client = new HttpProvider("https://api.zilliqa.com/");
Transaction transaction = client.getTransaction("055294ba67b3073d66ef078fb149dfb0490b2d46156479a9f2c9327fb762f4e9").getResult();
System.out.println(new Gson().toJson(transaction))
```

Example of a contract call transaction response:
```
{
   "gasPrice" : "3b9aca00",
   "signature" : "0xA518EF3544C2089FB9191941D716AAD9992225851BC780CDCAD821C508284C6CFEEB9E57666B3527923910BC9C20D0192A748FDAFC4037085AF4FF9F378FAF11",
   "nonce" : 145,
   "pubKey" : "025498B9D4F573AFA2BA817D0284A634316D6590F31763DF7310E3B430C97B9D14",
   "code" : "",
   "status" : 2,
   "amount" : "0",
   "blockConfirmation" : 0,
   "toAddr" : "0x3A6Fa878230EE35a30FbECE5173A9b725Ac6AC08",
   "eventEmitter" : {
      "emitter" : {},
      "handlers" : {},
      "promise" : {}
   },
   "gasLimit" : {
      "unsigned" : false,
      "low" : 30000,
      "high" : 0
   },
   "toDS" : false,
   "provider" : {
      "resMiddleware" : {},
      "reqMiddleware" : {},
      "nodeURL" : "https://dev-api.zilliqa.com",
      "middleware" : {
         "response" : {},
         "request" : {}
      }
   },
   "data" : "",
   "version" : 21823489,
   "receipt" : {
      "errors" : {},
      "event_logs" : [
         {
            "_eventname" : "Burn",
            "params" : [
               {
                  "value" : "0x38be3a7b971ee76aed36e75c863f93516962f9fd",
                  "vname" : "pool",
                  "type" : "ByStr20"
               },
               {
                  "vname" : "address",
                  "type" : "ByStr20",
                  "value" : "0x4776f50024464df5aa4588e4827dcf031c2b95f1"
               },
               {
                  "vname" : "amount",
                  "value" : "50000000000000",
                  "type" : "Uint128"
               }
            ],
            "address" : "0x3a6fa878230ee35a30fbece5173a9b725ac6ac08"
         },
         {
            "address" : "0x38be3a7b971ee76aed36e75c863f93516962f9fd",
            "params" : [
               {
                  "vname" : "sender",
                  "value" : "0x3a6fa878230ee35a30fbece5173a9b725ac6ac08",
                  "type" : "ByStr20"
               },
               {
                  "type" : "ByStr20",
                  "vname" : "recipient",
                  "value" : "0x4776f50024464df5aa4588e4827dcf031c2b95f1"
               },
               {
                  "value" : "42809837938793",
                  "vname" : "amount",
                  "type" : "Uint128"
               }
            ],
            "_eventname" : "TransferSuccess"
         }
      ],
      "transitions" : [
         {
            "addr" : "0x3a6fa878230ee35a30fbece5173a9b725ac6ac08",
            "depth" : 0,
            "msg" : {
               "params" : [],
               "_tag" : "",
               "_amount" : "59431276462803",
               "_recipient" : "0x4776f50024464df5aa4588e4827dcf031c2b95f1"
            }
         },
         {
            "accepted" : false,
            "msg" : {
               "params" : [
                  {
                     "value" : "0x4776f50024464df5aa4588e4827dcf031c2b95f1",
                     "vname" : "to",
                     "type" : "ByStr20"
                  },
                  {
                     "vname" : "amount",
                     "type" : "Uint128",
                     "value" : "42809837938793"
                  }
               ],
               "_tag" : "Transfer",
               "_amount" : "0",
               "_recipient" : "0x38be3a7b971ee76aed36e75c863f93516962f9fd"
            },
            "addr" : "0x3a6fa878230ee35a30fbece5173a9b725ac6ac08",
            "depth" : 0
         },
         {
            "addr" : "0x38be3a7b971ee76aed36e75c863f93516962f9fd",
            "depth" : 1,
            "msg" : {
               "params" : [
                  {
                     "vname" : "sender",
                     "value" : "0x3a6fa878230ee35a30fbece5173a9b725ac6ac08",
                     "type" : "ByStr20"
                  },
                  {
                     "vname" : "recipient",
                     "value" : "0x4776f50024464df5aa4588e4827dcf031c2b95f1",
                     "type" : "ByStr20"
                  },
                  {
                     "type" : "Uint128",
                     "vname" : "amount",
                     "value" : "42809837938793"
                  }
               ],
               "_tag" : "RecipientAcceptTransfer",
               "_amount" : "0",
               "_recipient" : "0x4776f50024464df5aa4588e4827dcf031c2b95f1"
            }
         },
         {
            "msg" : {
               "_recipient" : "0x3a6fa878230ee35a30fbece5173a9b725ac6ac08",
               "_amount" : "0",
               "_tag" : "TransferSuccessCallBack",
               "params" : [
                  {
                     "type" : "ByStr20",
                     "vname" : "sender",
                     "value" : "0x3a6fa878230ee35a30fbece5173a9b725ac6ac08"
                  },
                  {
                     "vname" : "recipient",
                     "type" : "ByStr20",
                     "value" : "0x4776f50024464df5aa4588e4827dcf031c2b95f1"
                  },
                  {
                     "value" : "42809837938793",
                     "vname" : "amount",
                     "type" : "Uint128"
                  }
               ]
            },
            "addr" : "0x38be3a7b971ee76aed36e75c863f93516962f9fd",
            "depth" : 1,
            "accepted" : false
         }
      ],
      "epoch_num" : "1474024",
      "accepted" : false,
      "success" : true, // indicates a transaction is confirmed
      "cumulative_gas" : 5826
   }
}
```
A transaction is confirmed if under the `receipt` section, `"success": true` is shown.