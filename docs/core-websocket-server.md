---
id: core-websocket-server
title: Websocket Server
---
This page describes the protocol, between the Zilliqa Websocket Server and the sdk client, for querying subscription and message pushing.

## Feature workflow

Client can subscribe their interested topics or unsubscribe certain topic by sending query, if the query failed they will normally be informed immediately with related error message. For every Tx block(epoch), the subscribed content will be sent from server to each client in one message where an array contains all their subscribed topic if updated, which we name **notification**.

## Supported query

The following types of data are the current main focus that we want to consider to be supported by ZWS:

- **New TxBlock**. Which includes TxBlock recently generated and hashes of all the transaction being processed within this block.
- **Event log**. Which includes all the event log generated for interested contract address
- **Unsubscribe**. Which tells the server to unsubscribe certain topic for the client

## Exception handling

Usually an **error message** will be responded to the client if the query failed, it may looks like

```json
{
  "type":"Error",
  "error":"..."
}
```

The following error messages will be applied to all kinds of query if being invalid:

- **invalid query field**. Which tells the client if the query is invalid, it could be not found, empty, malformed, or not available

## Message encoding

For convention, we still use JSON as our encoding format.

The epoch message will be presented in this way:

```json
{
  "type":"notification",
  "values":[
    {
      "query":"...",
      "value":"..."
    },
    {
      "query":"...",
      "value":"..."
    }
  ]
}
```

The followings are case by case for each subscription:

### Subscribe New Block

#### query message

```json
{
  "query":"NewBlock",
}
```

#### response message

Once succsfully subscribed, server will echo the query message to the client, otherwise will return error message.

Special error message:

- **NA**`

#### expected field in notification

```json
{
  "query":"NewBlock",
  "value":{
    "TxBlock":{
      // same as the json object by quering jsonrpc for `GetTxBlock`
    },
    "TxHashes":[
      // same as the json object by querying jsonrpc for `GetTransactionsForTxBlock`
    ]
  }
}
```

### Subscribe Event Log

#### query message

```json
{
  "query":"EventLog",
  "addresses":[
    "0x0000000000000000000000000000000000000000",
    "0x1111111111111111111111111111111111111111"
  ]
}
```

#### response message

Once succesfully subscribed, server will echo the query message to the client,
otherwise will return error message.

Special error message:

- **invalid addresses field**, which tells the client the addresses field is invalid, it could either be not found, malformed or empty
- **no contract found in list**, which tells the client the addresses provided are all of non contract

#### expected field in notification

```json
{
  "query":"EventLog",
  "value":
  [
    {
      "address":"0x0000000000000000000000000000000000000000",
      "event_logs":[
        {
          "_eventname":"foo1",
          "params":[
            {
              "vname":"bar1",
              "type":"String",
              "value":"abc"
            },
            {
              "vname":"bar2",
              "type":"ByStr32",
              "value":"0x0000000000000000000000000000000000000001"
            }
          ]
        },
      ]
    }
  ]
}
```

Notice that for address `0x1111111111111111111111111111111111111111` is not presented in the message since it doesn't have any event log released in this epoch.

### Unsubscribe

#### query message

```json
{
  "query":"Unsubscribe",
  "type":"EventLog"
}
```

#### response message

Once succesfully ubsubscribed, server will echo the query message to the client,
otherwise will return error message.

Special error message:

- **invalid type field**, which tells the client the type field is invalid, if could either be not found, malformed or not available.

#### expected field in notification

```json
{
  "query":"Unsubscribe",
  "value":["NewBlock", "EventLog"]
}
```

## Example

Client subscribe NewBlock:

```json
{
 "query":"NewBlock"
}
```

Client subscribe EventLog:

```json
{
 "query":"EventLog",
 "addresses":[
   "0x000000000000000000000000000000000",
   "0x111111111111111111111111111111111"
 ]
}
```

Client unsubscribe NewBlock:

```json
{
  "query":"Unsubscribe",
  "type":"NewBlock"
}
```

Notification:

```json
{
  "type":"notification",
  "values":[
    {
      "query":"NewBlock",
      "value":{
        "TxBlock":{
          "body":{
            "BlockHash":"b2214da8e25efbd4291f85016094824a8fcd46075d06e365282d39ee4ba8ca24",
            "HeaderSign":"E276EFC8B01AC51804272AAAB4FC59DD96B08B3988F9DA6BED28657CC74A1A609E73B203AA58664EAEB4A960FFEF3D636A7691EBD7F89A03CEFEB12FA8797615",
            "MicroBlockInfos":[
              {
                "MicroBlockHash":"9e811581454211ea5a757678460bb62a73860d1be9e5b8b805d3b176d4d92451",
                "MicroBlockShardId":0,
                "MicroBlockTxnRootHash":"eec45db6a9b70463a8ac32bec853bcb5fe1d73ffec1244e1cc0427036483bbfa"
              },
              {
                "MicroBlockHash":"066ff187ff392a9a9cd430a248552f10759f98e0ac530015091ffa430d68ba83",
                "MicroBlockShardId":1,
                "MicroBlockTxnRootHash":"0000000000000000000000000000000000000000000000000000000000000000"
              },
              {
                "MicroBlockHash":"250091b5c626143bde230813c527f77a007303e6dc3502642c7d468bc2d064e4",
                "MicroBlockShardId":2,
                "MicroBlockTxnRootHash":"0000000000000000000000000000000000000000000000000000000000000000"
              }
            ]
          },
          "header":{
            "BlockNum":"15",
            "DSBlockNum":"1",
            "GasLimit":"15000000",
            "GasUsed":"1",
            "MbInfoHash":"4b2d20a0bcb382ad2e2560791ed90ed21100e8e84ebac63d62d3c0b1a3fb11fe",
            "MinerPubKey":"0x02FC9ED69524A23AEFCB85B8A36C998F512C0512C6932DED74680A044F9D3EBC95",
            "NumMicroBlocks":3,
            "NumTxns":1,
            "PrevBlockHash":"5bda21605e7ea9404c58a40eebe99563adf330bab5b39e7438f8e4db28607b37",
            "Rewards":"1000000000",
            "StateDeltaHash":"2f878030ab9b0a211c1e584e140707c79d62d067390bfe3ccaf08fdaeaad2229",
            "StateRootHash":"94abb63e27984f46e914db2601de6af2048a3bf72f69eaac34421b7dfbd34a82",
            "Timestamp":"1572512230807870",
            "Version":1
          }
        }
      },
      "TxHashes":[
        ["1beb32a5435e993aa3025a70d8a5e71df43c10e2fe3f6ef832d1a5c371a63852"],
        [],
        []
      ]
    },
    {
      "query":"EventLog",
      "value":[
        {
          "address":"0x0000000000000000000000000000000000000000",
          "event_logs":[
            {
              "_eventname":"foo1",
              "params":[
                {
                  "vname":"bar1",
                  "type":"String",
                  "value":"abc"
                },
                {
                  "vname":"bar2",
                  "type":"ByStr32",
                  "value":"0x0000000000000000000000000000000000000001"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "query":"Unsubscribe",
      "value":["NewBlock"]
    }
  ]
}

```

And in the next tx block, the client won't be receiving `NewBlock` in notification