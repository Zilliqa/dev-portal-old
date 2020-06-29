---
id: dev-tools-websockets
title: WebSocket Server
---

This page describes the protocol - between the Zilliqa WebSocket Server and the SDK client - for querying subscription and message pushing.

## Introduction

Zilliqa WebSocket Server provides WebSocket service, enabling dApp developers or other builders on Zilliqa blockchain to subscribe to specific topics (e.g., new block has been produced, payment transaction has been confirmed, events issued by smart contracts). With the WebSocket service, developers no longer need to poll the blockchain routinely in order to get specific information.

WebSocket endpoints:
- Mainnet: wss://api-ws.zilliqa.com
- Testnet: wss://dev-ws.zilliqa.com

## Feature workflow

Clients can subscribe to or unsubscribe from certain topics by sending a query. If the query fails, clients will normally be informed immediately through a relevant error message. For every Tx block, the subscribed content will be sent out by the server to each client in one message. This message (herein referred to as the **notification**) includes an array that contains all the updates to subscribed topics.

## Supported query

The following types of data are currently supported for querying:

- **New TxBlock**. This includes the recently generated Tx block and hashes of all the transactions processed within this block.
- **Event log**. This includes all the event logs generated for the specified contract address.
- **Unsubscribe**. This tells the server to unsubscribe the client from a certain topic.

## Exception handling

An **error message** will usually be sent to the client if a query fails:

```json
{
  "type":"Error",
  "error":"..."
}
```

The following error message applies to all kinds of invalid queries:

- **invalid query field**. This informs the client that the query is invalid, cannot be found, empty, malformed, or not available.

## Message encoding

For convention, we still use JSON as our encoding format.

The epoch message will be presented in this way:

```json
{
	"type": "Notification",
	"values": [{
		"query": "NewBlock",
		"value": {
			"TxBlock": {
				"body": {
					"BlockHash": "b2214da8e25efbd4291f85016094824a8fcd46075d06e365282d39ee4ba8ca24",
					"HeaderSign": "E276EFC8B01AC51804272AAAB4FC59DD96B08B3988F9DA6BED28657CC74A1A609E73B203AA58664EAEB4A960FFEF3D636A7691EBD7F89A03CEFEB12FA8797615",
					"MicroBlockInfos": [{
						"MicroBlockHash": "9e811581454211ea5a757678460bb62a73860d1be9e5b8b805d3b176d4d92451",
						"MicroBlockShardId": 0,
						"MicroBlockTxnRootHash": "eec45db6a9b70463a8ac32bec853bcb5fe1d73ffec1244e1cc0427036483bbfa"
					}, {
						"MicroBlockHash": "066ff187ff392a9a9cd430a248552f10759f98e0ac530015091ffa430d68ba83",
						"MicroBlockShardId": 1,
						"MicroBlockTxnRootHash": "0000000000000000000000000000000000000000000000000000000000000000"
					}, {
						"MicroBlockHash": "250091b5c626143bde230813c527f77a007303e6dc3502642c7d468bc2d064e4",
						"MicroBlockShardId": 2,
						"MicroBlockTxnRootHash": "0000000000000000000000000000000000000000000000000000000000000000"
					}]
				},
				"header": {
					"BlockNum": "15",
					"DSBlockNum": "1",
					"GasLimit": "15000000",
					"GasUsed": "1",
					"MbInfoHash": "4b2d20a0bcb382ad2e2560791ed90ed21100e8e84ebac63d62d3c0b1a3fb11fe",
					"MinerPubKey": "0x02FC9ED69524A23AEFCB85B8A36C998F512C0512C6932DED74680A044F9D3EBC95",
					"NumMicroBlocks": 3,
					"NumTxns": 1,
					"PrevBlockHash": "5bda21605e7ea9404c58a40eebe99563adf330bab5b39e7438f8e4db28607b37",
					"Rewards": "1000000000",
					"StateDeltaHash": "2f878030ab9b0a211c1e584e140707c79d62d067390bfe3ccaf08fdaeaad2229",
					"StateRootHash": "94abb63e27984f46e914db2601de6af2048a3bf72f69eaac34421b7dfbd34a82",
					"Timestamp": "1572512230807870",
					"Version": 1
				}
			}
		},
		"TxHashes": [
			["1beb32a5435e993aa3025a70d8a5e71df43c10e2fe3f6ef832d1a5c371a63852"],
			[],
			[]
		]
	}, {
		"query": "EventLog",
		"value": [{
			"address": "0x0000000000000000000000000000000000000000",
			"event_logs": [{
				"_eventname": "foo1",
				"params": [{
					"vname": "bar1",
					"type": "String",
					"value": "abc"
				}, {
					"vname": "bar2",
					"type": "ByStr32",
					"value": "0x0000000000000000000000000000000000000001"
				}]
			}]
		}]
	}, {
		"query": "Unsubscribe",
		"value": ["NewBlock"]
	}]
}
```

The following sections provide the details for each subscription topic.

### Subscribe New Block

#### Query message

```json
{
	"query": "NewBlock"
}
```

#### Response message

Once successfully subscribed, the server will echo the query message to the client. Otherwise, the server will return an error message.

#### Error messages specific to this topic

None

#### Sample notification

```json
{
	"query": "NewBlock",
	"value": {
		"TxBlock": {
			"body": {
				"BlockHash": "b2214da8e25efbd4291f85016094824a8fcd46075d06e365282d39ee4ba8ca24",
				"HeaderSign": "E276EFC8B01AC51804272AAAB4FC59DD96B08B3988F9DA6BED28657CC74A1A609E73B203AA58664EAEB4A960FFEF3D636A7691EBD7F89A03CEFEB12FA8797615",
				"MicroBlockInfos": [{
					"MicroBlockHash": "9e811581454211ea5a757678460bb62a73860d1be9e5b8b805d3b176d4d92451",
					"MicroBlockShardId": 0,
					"MicroBlockTxnRootHash": "eec45db6a9b70463a8ac32bec853bcb5fe1d73ffec1244e1cc0427036483bbfa"
				}, {
					"MicroBlockHash": "066ff187ff392a9a9cd430a248552f10759f98e0ac530015091ffa430d68ba83",
					"MicroBlockShardId": 1,
					"MicroBlockTxnRootHash": "0000000000000000000000000000000000000000000000000000000000000000"
				}, {
					"MicroBlockHash": "250091b5c626143bde230813c527f77a007303e6dc3502642c7d468bc2d064e4",
					"MicroBlockShardId": 2,
					"MicroBlockTxnRootHash": "0000000000000000000000000000000000000000000000000000000000000000"
				}]
			},
			"header": {
				"BlockNum": "15",
				"DSBlockNum": "1",
				"GasLimit": "15000000",
				"GasUsed": "1",
				"MbInfoHash": "4b2d20a0bcb382ad2e2560791ed90ed21100e8e84ebac63d62d3c0b1a3fb11fe",
				"MinerPubKey": "0x02FC9ED69524A23AEFCB85B8A36C998F512C0512C6932DED74680A044F9D3EBC95",
				"NumMicroBlocks": 3,
				"NumTxns": 1,
				"PrevBlockHash": "5bda21605e7ea9404c58a40eebe99563adf330bab5b39e7438f8e4db28607b37",
				"Rewards": "1000000000",
				"StateDeltaHash": "2f878030ab9b0a211c1e584e140707c79d62d067390bfe3ccaf08fdaeaad2229",
				"StateRootHash": "94abb63e27984f46e914db2601de6af2048a3bf72f69eaac34421b7dfbd34a82",
				"Timestamp": "1572512230807870",
				"Version": 1
			}
		}
	},
	"TxHashes": [
		["1beb32a5435e993aa3025a70d8a5e71df43c10e2fe3f6ef832d1a5c371a63852"],
		[],
		[]
	]
}
```

### Subscribe Event Log

#### Query message

```json
{
  "query":"EventLog",
  "addresses":[
    "0x0000000000000000000000000000000000000000",
    "0x1111111111111111111111111111111111111111"
  ]
}
```

#### Response message

Once successfully subscribed, the server will echo the query message to the client. Otherwise, the server will return an error message.

#### Error messages specific to this topic

- **invalid addresses field**. This tells the client that the addresses field is invalid, meaning it could not be found or is either malformed or empty.
- **no contract found in list**. This tells the client that the addresses provided are all non-contracts.

#### Sample notification

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

#### Query message

```json
{
  "query":"Unsubscribe",
  "type":"EventLog"
}
```

#### Response message

Once successfully unsubscribed, the server will echo the query message to the client. Otherwise, the server will return an error message.

#### Error messages specific to this topic

- **invalid type field**. This tells the client that the type field is invalid, meaning it could not be found or is either malformed or empty.

#### Sample notification

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
  "type":"Notification",
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

After the above message, during the next Tx block, the client will no longer receive a `NewBlock` in the notification.

## Example using Zilliqa-JavaScript-Library

Our [Zilliqa-JavaScript-Library](https://github.com/Zilliqa/Zilliqa-JavaScript-Library) provides an easier way to subscribe to topics.

### Subscribe New Block

```js
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
  SocketConnect,
  StatusType,
  MessageType,
} = require('@zilliqa-js/subscriptions');

async function test() {
  const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
  
  const subscriber = zilliqa.subscriptionBuilder.buildNewBlockSubscriptions(
    'wss://dev-ws.zilliqa.com',
  );
  
  // if subscribe success, it will echo the subscription info
  subscriber.emitter.on(StatusType.SUBSCRIBE_NEW_BLOCK, (event) => {
    console.log('get SubscribeNewBlock echo: ', event);
  });

  subscriber.emitter.on(MessageType.NEW_BLOCK, (event) => {
    // doing what you want with new block
    console.log('get new block: ', event.value.TxBlock.header);
  });
  
  //if unsubscribe success, it will echo the unsubscription info
  subscriber.emitter.on(MessageType.UNSUBSCRIBE, (event) => {
    console.log('get unsubscribe event: ', event);
  });

  await subscriber.start();
}

test();
```

### Subscribe Event Log

```js
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { StatusType, MessageType } = require('@zilliqa-js/subscriptions');

async function test() {
  const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
  const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
    'wss://dev-ws.zilliqa.com',
    {
      // smart contract address you want to listen on  
      addresses: [
        '0x2ce491a0fd9e318b39172258101b7c836da7449b',
        '0x167e3980e04eab1e89ff84523ae8c77e008932dc',
      ],
    },
  );
  
  subscriber.emitter.on(StatusType.SUBSCRIBE_EVENT_LOG, (event) => {
    // if subscribe success, it will echo the subscription info
    console.log('get SubscribeEventLog echo: ', event);
  });
  
  subscriber.emitter.on(MessageType.EVENT_LOG, (event) => {
    // do what you want with new event log
    console.log('get new event log: ', JSON.stringify(event));
  });
 
  subscriber.emitter.on(MessageType.UNSUBSCRIBE, (event) => {
    //if unsubscribe success, it will echo the unsubscription info
    console.log('get unsubscribe event: ', event);
  });

  await subscriber.start();
}

test();
```
