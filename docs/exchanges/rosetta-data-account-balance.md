---
id: rosetta-data-account-balance
title: Balance
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - data
  - account
  - balance
description: Balance
---

---

## Get an Account Balance

Return the account balance and nonce of a particular account.

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "account_identifier": {
    "address": "2141bf8b6d2213d4d7204e2ddab92653dc245c5f",
    "sub_account": {
      "address": "empty"
    },
    "metadata": {}
  },
  "block_identifier": {
    "index": 0
  }
}
```

Response:

Sample

```json
{
  "block_identifier": {
    "index": 0,
    "hash": "1947718b431d25dd65c226f79f3e0a9cc96a948899dab3422993def1494a9c95"
  },
  "balances": [
    {
      "value": "529909051575",
      "currency": {
        "symbol": "ZIL",
        "decimals": 12
      }
    }
  ],
  "metadata": {
    "nonce": 48
  }
}
```
