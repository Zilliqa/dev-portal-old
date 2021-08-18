---
id: rosetta-data-network-list
title: List
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - data
  - network
  - list
description: List
---

---

## Get List of Available Networks

Returns a list of NetworkIdentifiers that the Rosetta server supports, namely `testnet` and `mainnet`.

Request:

```json
{
  "metadata": {}
}
```

Response:

Sample

```json
{
  "network_identifiers": [
    {
      "blockchain": "zilliqa",
      "network": "mainnet"
    },
    {
      "blockchain": "zilliqa",
      "network": "testnet"
    }
  ]
}
```
