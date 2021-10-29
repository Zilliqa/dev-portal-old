---
id: rosetta-construction-parse
title: Parse
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - parse
description: Parse
---

---

## Parse a Transaction

Parse is called on either unsigned or signed transactions to understand the intent of the formulated transaction. This is run as a sanity check before signing (after `/construction/payloads`) and before broadcast (after `/construction/combine`).

:::info
Set the `signed` flag accordingly to denote whether the transaction is signed or unsigned.
:::

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "testnet"
  },
  "signed": false,
  "transaction": "{\"amount\":2000000000000,\"code\":\"\",\"data\":\"\",\"gasLimit\":50,\"gasPrice\":2000000000,\"nonce\":467,\"pubKey\":\"02e819146a9685ab282e4cacc0de7c00e41d52111ad4092f7ccb266a37255f31ad\",\"senderAddr\":\"zil17jljwxdwh6mvt8gxe28cd7drjkhtfa3ds9c5en\",\"toAddr\":\"zil1rm988wdvdnue5we36tr2y0yyxufcfphqcxmj55\",\"version\":21823489}"
}
```

Response:

Sample

```json
{
    "operations": [
        {
            "operation_identifier": {
                "index": 0
            },
            "type": "TRANSFER",
            "status": "",
            "account": {
                "address": "zil17jljwxdwh6mvt8gxe28cd7drjkhtfa3ds9c5en",
                "metadata": {
                    "base16": "F4bf2719AEBEB6C59D06ca8f86f9a395aeB4F62d"
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
                "address": "zil1rm988wdvdnue5we36tr2y0yyxufcfphqcxmj55",
                "metadata": {
                    "base16": "1Eca73B9ac6Cf99a3B31d2C6A23c8437138486e0"
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
    ]
}
```
