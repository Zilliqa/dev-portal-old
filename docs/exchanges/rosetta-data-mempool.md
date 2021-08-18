---
id: rosetta-data-mempool
title: Mempool
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - data
  - menpool
description: Mempool
---

---

## Get All Mempool Transactions

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
  "transaction_identifiers": [
    {
      "hash": "af6e2a81812f7834312e8e2358b51f2f9d7ca696c4d315258102ed868389a7c1"
    }
  ]
}
```
