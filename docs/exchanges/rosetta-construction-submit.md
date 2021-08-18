---
id: rosetta-construction-submit
title: Submit
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - submit
description: Submit
---

---

## Submit a Signed Transaction

Submit a signed transaction to the Zilliqa network. This call is non-blocking and will return immediately with a transaction hash.

:::info
Before calling `/submit`, please call `/combine` to obtain the `signed_transaction` required for the request parameters.
:::

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "signed_transaction": "{\"amount\":2000000000000,\"code\":\"\",\"data\":\"\",\"gasLimit\":1,\"gasPrice\":2000000000,\"nonce\":187,\"pubKey\":\"02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e\",\"senderAddr\":\"zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r\",\"signature\":\"fcb93583d963a7c11f52f04b1ecbd129aa3df896e618b47ff163dc18c53b59afc4289851fd2d5a50eaa7d7ae0763eb912797b0b34e1cf1e6d3865a218e1066b7\",\"toAddr\":\"zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0\",\"version\":21823489}"
}
```

Response:

Sample

```json
{
  "transaction_identifier": {
    "hash": "963a984ee255cfd881b337a52caf699d4f05799c45cc0948d8a8ce72a6a12d8e"
  }
}
```
