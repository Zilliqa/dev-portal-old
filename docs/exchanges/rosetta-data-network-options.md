---
id: rosetta-data-network-options
title: Options
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - data
  - network
  - options
description: Options
---

---

## Get Network Options

Returns the

1. Version information of Zilliqa Rosetta and Zilliqa seed node.
2. Type of network operation supported by Zilliqa Rosetta
3. List of errors code in Zilliqa Rosetta

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "metadata": {}
}
```

Response:

Sample

```json
{
  "version": {
    "rosetta_version": "1.4.9",
    "node_version": "v6.3.0-alpha.0"
  },
  "allow": {
    "operation_statuses": [
      {
        "status": "SUCCESS",
        "successful": true
      },
      {
        "status": "FAILED",
        "successful": false
      }
    ],
    "operation_types": [
      "TRANSFER",
      "CONTRACT_DEPLOYMENT",
      "CONTRACT_CALL",
      "CONTRACT_CALL_TRANSFER"
    ],
    "errors": [
      {
        "code": 400,
        "message": "network identifier is not supported",
        "retriable": false
      },
      {
        "code": 401,
        "message": "block identifier is empty",
        "retriable": false
      },
      {
        "code": 402,
        "message": "block index is invalid",
        "retriable": false
      },
      {
        "code": 403,
        "message": "get block failed",
        "retriable": true
      },
      {
        "code": 404,
        "message": "block hash is invalid",
        "retriable": false
      },
      {
        "code": 405,
        "message": "get transaction failed",
        "retriable": true
      },
      {
        "code": 406,
        "message": "signed transaction failed",
        "retriable": false
      },
      {
        "code": 407,
        "message": "commit transaction failed",
        "retriable": false
      },
      {
        "code": 408,
        "message": "transaction hash is invalid",
        "retriable": false
      },
      {
        "code": 409,
        "message": "block is not exist",
        "retriable": false
      },
      {
        "code": 500,
        "message": "services not realize",
        "retriable": false
      },
      {
        "code": 501,
        "message": "address is invalid",
        "retriable": true
      },
      {
        "code": 502,
        "message": "get balance error",
        "retriable": true
      },
      {
        "code": 503,
        "message": "parse integer error",
        "retriable": true
      },
      {
        "code": 504,
        "message": "json marshal failed",
        "retriable": false
      },
      {
        "code": 505,
        "message": "parse tx payload failed",
        "retriable": false
      },
      {
        "code": 506,
        "message": "currency not config",
        "retriable": false
      },
      {
        "code": 507,
        "message": "params error",
        "retriable": true
      },
      {
        "code": 508,
        "message": "contract address invalid",
        "retriable": true
      },
      {
        "code": 509,
        "message": "pre execute contract failed",
        "retriable": false
      },
      {
        "code": 510,
        "message": "query balance failed",
        "retriable": true
      },
      {
        "code": 511,
        "message": "tx not exist in mem pool",
        "retriable": false
      },
      {
        "code": 512,
        "message": "historical compute balance height less than req height",
        "retriable": false
      },
      {
        "code": 513,
        "message": "db store error",
        "retriable": true
      },
      {
        "code": 514,
        "message": "public hex error",
        "retriable": false
      },
      {
        "code": 515,
        "message": "unsupported address format",
        "retriable": false
      },
      {
        "code": 516,
        "message": "signature provided in transaction is invalid",
        "retriable": false
      }
    ],
    "historical_balance_lookup": false
  }
}
```
