---
id: rosetta-construction-mempool-transaction
title: transaction
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - mempool
  - transaction
description: transaction
---

---

## Get a Mempool Transaction

Return transactions that are inside mempool.

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "transaction_identifier": {
    "hash": "af6e2a81812f7834312e8e2358b51f2f9d7ca696c4d315258102ed868389a7c1"
  }
}
```

Response:

Sample

```json
{
  "code": 0,
  "message": "transaction not pending",
  "retriable": false
}
```
