---
id: rosetta-construction-hash
title: Hash
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - hash
description: Hash
---

---

## Get the Hash of a Signed Transaction

Returns the transaction hash for a signed transaction.

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "signed_transaction": "{\"amount\":2000000000000,\"code\":\"\",\"data\":\"\",\"gasLimit\":1,\"gasPrice\":1000000000,\"nonce\":186,\"pubKey\":\"02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e\",\"signature\":\"51c69af638ad7afd39841a7abf937d5df99e20adedc4287f43c8070d497ba78136c951192b3920914feb83b9272ccb2ca7facd835dfad10eff2b848b13616daf\",\"toAddr\":\"zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0\",\"version\":21823489}"
}
```

Response:

Sample

```json
{
  "transaction_identifier": {
    "hash": "a17367c8bcd83cdc2d9ede4571c8e27ad74278ae195263f13e10ba84f12ab13c"
  }
}
```
