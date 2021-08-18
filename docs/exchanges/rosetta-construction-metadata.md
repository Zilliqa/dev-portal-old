---
id: rosetta-construction-metadata
title: Metadata
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - metadata
description: Metadata
---

---

## Create a Request to Fetch Metadata

Using the payload from `preprocess`, `metadata` return essential information required to construct a transaction. In Rosetta Zilliqa, information such as `nonce` and `version` is returned.

Request:

`options` is from `/construction/preprocess`

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "options": {
    "amount": "2000000000000",
    "gasLimit": "50",
    "gasPrice": "2000000000",
    "senderAddr": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
    "toAddr": "zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0"
  },
  "public_keys": [
    {
      "hex_bytes": "02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e",
      "curve_type": "secp256k1"
    }
  ]
}
```

Response:

Sample

```json
{
  "metadata": {
    "amount": "2000000000000",
    "gasLimit": "50",
    "gasPrice": "2000000000",
    "nonce": 187,
    "pubKey": "02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e",
    "senderAddr": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
    "toAddr": "zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0",
    "version": 21823489
  }
}
```
