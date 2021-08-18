---
id: rosetta-construction-combine
title: Combine
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - combine
description: Combine
---

---

## Create Network Transaction from Signature

Creates a Zilliqa payment transaction from an unsigned transaction and an array of provided signatures. The signed transaction returned from this method will thenbe sent to the `/construction/submit` endpoint by the caller.

:::info
Before calling `/combine`, please call `/payloads` to have the `unsigned_transaction`. Next, use [goZilliqa SDK](https://github.com/Zilliqa/gozilliqa-sdk) or other Zilliqa's SDKs to craft a transaction object and sign the transaction object; Print out the **_signature_** and **_transaction object_** in **hexadecimals** format.
:::

Refer to the [`signRosettaTransaction.js`](https://github.com/Zilliqa/zilliqa-rosetta/blob/master/examples/signRosettaTransaction.js) for an example code on how to craft and sign a transaction object.

Use them as request parameters as follows:

```json
{
    ...,
    "unsigned_transaction": ... // from /payloads
    "signatures": [
        {
            "signing_payload": {
                "address": "string", // sender account address
                "hex_bytes": "string",  // signed transaction object in hexadecimals representation obtained after signing with goZilliqa SDK or other Zilliqa SDK
                "signature_type": "ecdsa"
            },
            "public_key": {
                "hex_bytes": "string", // sender public key
                "curve_type": "secp256k1"
            },
            "signature_type": "ecdsa",
            "hex_bytes": "string" // signature of the signed transaction object
        }
    ]
}

```

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "unsigned_transaction": "{\"amount\":2000000000000,\"code\":\"\",\"data\":\"\",\"gasLimit\":1,\"gasPrice\":2000000000,\"nonce\":187,\"pubKey\":\"02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e\",\"senderAddr\":\"zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r\",\"toAddr\":\"zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0\",\"version\":21823489}",
  "signatures": [
    {
      "signing_payload": {
        "account_identifier": {
          "address": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
          "metadata": {
            "base16": "99f9d482abbdC5F05272A3C34a77E5933Bb1c615"
          }
        },
        "hex_bytes": "088180b40a10bb011a144978075dd607933122f4355b220915efa51e84c722230a2102e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e2a120a100000000000000000000001d1a94a200032120a10000000000000000000000000773594003801",
        "signature_type": "schnorr_1"
      },
      "public_key": {
        "hex_bytes": "02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e",
        "curve_type": "secp256k1"
      },
      "signature_type": "schnorr_1",
      "hex_bytes": "fcb93583d963a7c11f52f04b1ecbd129aa3df896e618b47ff163dc18c53b59afc4289851fd2d5a50eaa7d7ae0763eb912797b0b34e1cf1e6d3865a218e1066b7"
    }
  ]
}
```

Response:

Sample

```json
{
  "signed_transaction": "{\"amount\":2000000000000,\"code\":\"\",\"data\":\"\",\"gasLimit\":1,\"gasPrice\":2000000000,\"nonce\":187,\"pubKey\":\"02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e\",\"senderAddr\":\"zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r\",\"signature\":\"fcb93583d963a7c11f52f04b1ecbd129aa3df896e618b47ff163dc18c53b59afc4289851fd2d5a50eaa7d7ae0763eb912797b0b34e1cf1e6d3865a218e1066b7\",\"toAddr\":\"zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0\",\"version\":21823489}"
}
```
