---
id: core-lookup
title: Lookup
---
## API Server

## Transaction Dispatch

### Steps

1. User using the json rpc server sends a json to the Zilliqa api (calls the CreateTransaction function). The transaction json contains essential information about the transaction.
2. The transaction json is then validated and then converted into the cpp class format.
3. The lookup node then decides the shard of the txn to send to and stores the txn into a map. The key of the map is the shard number.
4. After the lookup receives a ds or tx block, it dispatches these txns to the corresponding shards.
5. After it reaches a shard, the shard node again validates this txn and then adds it to the txn mempool.
6. The shard leader then proposes the list of txns to be included in the microblock, the other shard nodes then verify the corresponding txns.
7. If the microblock is then included in the final block, the nodes commits the txns and sends the txn receipts to the lookup.
8. The lookup use this receipt to tell the user the status of the txn.

![image01](core/features/transaction-dispatch/image01.png)

## # Incremental DB

This document describes the purpose behind incremental-db which levereges AWS S3 service and its implementation details.

### Description

- The goal is to provide an efficient way to miners and seed nodes to get blockchain data in order to join the network.

### Purpose

- Basic idea would have been to upload or sync entire persistence to S3 bucket every TxEpoch. And new nodes fetch the entire persistence from S3 bucket.
- This would have been alright for all databases except for leveldb `state` because aws-cli sync for `state` database will result in uploading all file in the db which will be time consuming and not bandwidth efficient.
- Uploading of `state` leveldb for every TxEpoch is bottle neck and solution is to use `incremental-db`.

**Note:** _Its practically possible that all files in `stateDB` gets updated every TxEpoch if transactions in that epoch changes states of addresses which updates TrieDB across all files in levelDB._

### Building Blocks

Following two scripts are main building blocks:

#### Upload Incremental DB script

This script `uploadIncrDB.py` runs on one of the lookup node. It performs following steps:

- Add Lock file to S3 bucket - `incremental`

- Perform sync between local `persistence` on lookup node and `incremental\peristence` on S3 every TxEpoch. However, syncing criterias differs based on TxEpoch number.
  Following are possibilities:
  
  - Script startup
    - Clean both buckets i.e. `incremental` and `statedelta`
    - Sync entire persistence to S3 bucket - `incremental` (including `state, stateroot, txBlocks, txnBodies, txnBodiesTmp, microblock, etc` ( every thing that exists in persistence folder ) at every 10th vacuous epoch.
    - Clean all statedeltas from S3 bucket - `statedelta`

  - Every 10th DS Epoch (first txEpoch from 10th DS epoch)
    - Sync entire persistence to S3 bucket - `incremental` (including `state, stateroot, txBlocks, txnBodies, txnBodiesTmp, microblock, etc` ( every thing that exists in persistence folder ).
    - Clean all statedeltas from S3 bucket - `statedelta`

  - Any other txEpoch
    - Sync entire persistence to S3 bucket - `incremental` (excluding `state, stateroot, contractCode, contractStateData, contractStateIndex`) every txEpoch.
    - If `current txBlkNum == vacuous epoch + 1`
     (i.e. first txBlock in current DS epoch e.g 100, 200, 300, ... ), we don't need to upload statedelta diff here. Instead complete stateDelta db is uploaded to S3 bucket - `statedelta` ( e.g. `stateDelta_100.tar.gz` ).
    Else upload the statedelta diff to S3 bucket - `statedelta` (e.g. `stateDelta_101.tar.gz, stateDelta_101.tar.gz, .... stateDelta_199.tar.gz`).

- Remove Lock file from S3 - `incremental`.

#### Download Incremental DB script

This script `downloadIncrDB.py` is first ran by every miner node or seed node to get latest block chain data. It perform following steps:

- Check if Lock file existed. Wait until no Lock file is found. Otherwise go to Step 2.

- Clean existing persistence, if any. And download Entire Persistence from S3 bucket - `incremental`.
  If node is `miner`, `microblocks` and `txBodies` are not downloaded.

- Check if Lock file existed. If yes, start again with step 1).

- Clean any `StateDeltasFromS3` folder. Download all statedeltas from S3 bucket - `statedelta` to `StateDeltasFromS3`.

#### Joining node

- Node uses the `downloadIncrDB.py` to download the `peristence` from S3 bucket `incrementalDB` and all the state-deltas from S3 bucket `statedelta` to `StateDeltasFromS3`.
- Node startsup with downloaded `peristence` and starts syncup. After this, node has **base state** `say X`.
- Node then recreates latest state using state-deltas from `StateDeltasFromS3` (i.e.  `stateDelta_101.tar.gz, stateDelta_101.tar.gz, .... stateDelta_199.tar.gz, stateDelta_200.tar.gz, stateDelta_201.tar.gz, stateDelta_201.tar.gz, .... stateDelta_299.tar.gz` ).

  Final State `Y = X + x1 + x2  +  ... +  x99 + x100 + x101 + x102 + ...`

## Multiplier

This section describes the purpose of multiplier and some implementation details

### Purpose

- Node types `newlookup` and `level2lookup`  need new blocks data every time new txBlock is mined in order to be synced with progressing network.
- This new block data include `DSBlock`, `FinalBlock`, `Microblocks` and `Transactions` for new epoch.
- Multiplier plays a role of receiving above messages from network and forwarding them to `newlookup` and/or `level2lookup`.

### Brief

- Mainnet runs with `5` multiplier where each multiplier is configured to forward the messages to those nodes `<IP:PORT>` registered with them.
- Every multiplier say `multiplier-0` has corresponding `multiplier-0-downstreams.txt` which contains list of `<IP:PORT>` of nodes receiving forwarded messages.
- All `level2lookup` nodes are automatically registered with multiplier during bootstrap.
- All newly launched zilliqa controlled `newlookup` and exchanges `seed` nodes needs to be registered with any of the multipliers.
- Network nodes are aware of multiplier's `IP:PORT` from constants.xml since multipliers are always launced during bootstrap.

### Details

- Multiplier is a simple go program which basically listens at a particular port for incoming messages and forwards the message to forwarding list.
- It checks for any update in `multiplier-x-downstreams.txt` for new or deleted `<IP:PORT>` periodically. This enables us to add new seed nodes anytime.
- It uses hashes to ignore duplicate messsages from being received and forwarded.
- It retries sending message to destination `<IP:PORT>` for error `i/o timeout` which could happen due to network glitches on either ends.

## Websocket Server

This page describes the protocol, between the Zilliqa Websocket Server and the sdk client, for querying subscription and message pushing.

### Feature workflow

Client can subscribe their interested topics or unsubscribe certain topic by sending query, if the query failed they will normally be informed immediately with related error message. For every Tx block(epoch), the subscribed content will be sent from server to each client in one message where an array contains all their subscribed topic if updated, which we name **notification**.

### Supported query

The following types of data are the current main focus that we want to consider to be supported by ZWS:

- **New TxBlock**. Which includes TxBlock recently generated and hashes of all the transaction being processed within this block.
- **Event log**. Which includes all the event log generated for interested contract address
- **Unsubscribe**. Which tells the server to unsubscribe certain topic for the client

### Exception handling

Usually an **error message** will be responded to the client if the query failed, it may looks like

```json
{
  "type":"Error",
  "error":"..."
}
```

The following error messages will be applied to all kinds of query if being invalid:

- **invalid query field**. Which tells the client if the query is invalid, it could be not found, empty, malformed, or not available

### Message encoding

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

#### Subscribe New Block

##### query message

```json
{
  "query":"NewBlock",
}
```

##### response message

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

#### Subscribe Event Log

##### query message

```json
{
  "query":"EventLog",
  "addresses":[
    "0x0000000000000000000000000000000000000000",
    "0x1111111111111111111111111111111111111111"
  ]
}
```

##### response message

Once succesfully subscribed, server will echo the query message to the client,
otherwise will return error message.

Special error message:

- **invalid addresses field**, which tells the client the addresses field is invalid, it could either be not found, malformed or empty
- **no contract found in list**, which tells the client the addresses provided are all of non contract

##### expected field in notification

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

#### Unsubscribe

##### query message

```json
{
  "query":"Unsubscribe",
  "type":"EventLog"
}
```

##### response message

Once succesfully ubsubscribed, server will echo the query message to the client,
otherwise will return error message.

Special error message:

- **invalid type field**, which tells the client the type field is invalid, if could either be not found, malformed or not available.

##### expected field in notification

```json
{
  "query":"Unsubscribe",
  "value":["NewBlock", "EventLog"]
}
```

### Example

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