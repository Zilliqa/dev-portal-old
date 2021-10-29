---
id: rosetta-construction-payloads
title: Payloads
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - payloads
description: Payloads
---

---

## Generate an Unsigned Transaction and Signing Payloads

Payloads is called with an array of operations and the response from `/construction/metadata`. It returns an unsigned transaction blob and a collection of payloads that must be signed by particular account using Zilliqa Schnorr signature algorithm.

Request:

`metadata` for `operation_identifier 1` is from `/construction/metadata`

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "operations": [
    {
      "operation_identifier": {
        "index": 0
      },
      "type": "TRANSFER",
      "status": "",
      "account": {
        "address": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
        "metadata": {
          "base16": "99f9d482abbdC5F05272A3C34a77E5933Bb1c615"
        }
      },
      "amount": {
        "value": "-2000000000000",
        "currency": {
          "symbol": "ZIL",
          "decimals": 12
        }
      }
    },
    {
      "operation_identifier": {
        "index": 1
      },
      "related_operations": [
        {
          "index": 0
        }
      ],
      "type": "TRANSFER",
      "status": "",
      "account": {
        "address": "zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0",
        "metadata": {
          "base16": "4978075dd607933122f4355B220915EFa51E84c7"
        }
      },
      "amount": {
        "value": "2000000000000",
        "currency": {
          "symbol": "ZIL",
          "decimals": 12
        }
      }
    }
  ],
  "metadata": {
    // from construction/metadata
    "amount": "2000000000000",
    "gasLimit": "50",
    "gasPrice": "2000000000",
    "nonce": 187,
    "pubKey": "02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e",
    "senderAddr": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
    "toAddr": "zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0",
    "version": 21823489
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
  "unsigned_transaction": "{\"amount\":2000000000000,\"code\":\"\",\"data\":\"\",\"gasLimit\":1,\"gasPrice\":2000000000,\"nonce\":187,\"pubKey\":\"02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e\",\"senderAddr\":\"zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r\",\"toAddr\":\"zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0\",\"version\":21823489}",
  "payloads": [
    {
      "address": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
      "hex_bytes": "088180b40a10bb011a144978075dd607933122f4355b220915efa51e84c722230a2102e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e2a120a100000000000000000000001d1a94a200032120a10000000000000000000000000773594003801",
      "account_identifier": {
        "address": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
        "metadata": {
          "base16": "99f9d482abbdC5F05272A3C34a77E5933Bb1c615"
        }
      },
      "signature_type": "schnorr_1"
    }
  ]
}
```
