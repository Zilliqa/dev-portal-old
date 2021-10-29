---
id: rosetta-construction-preprocess
title: Preprocess
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - preprocess
description: Preprocess
---

---

## Create a Request to Fetch Metadata

Preprocess is called prior to /construction/payloads to construct a request for metadata (such as `nonce`) that are needed for transaction construction.
The options object returned from `preprocess` will be sent to the `/construction/metadata`.

Request:

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
      },
      "metadata": {
        "senderPubKey": "0x02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e"
      }
    }
  ],
  "metadata": {}
}
```

Response:

Sample

```json
{
  "options": {
    "amount": "2000000000000",
    "gasLimit": "50",
    "gasPrice": "2000000000",
    "senderAddr": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
    "toAddr": "zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0"
  },
  "required_public_keys": [
    {
      "address": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
      "metadata": {
        "base16": "99f9d482abbdC5F05272A3C34a77E5933Bb1c615"
      }
    }
  ]
}
```
