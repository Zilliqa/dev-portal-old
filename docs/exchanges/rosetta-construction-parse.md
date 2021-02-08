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
    "signed": true,
    "transaction": "{\"amount\":2000000000000,\"code\":\"\",\"data\":\"\",\"gasLimit\":1,\"gasPrice\":1000000000,\"nonce\":186,\"pubKey\":\"02e44ef2c5c2031386faa6cafdf5f67318cc661871b0112a27458e65f37a35655e\",\"signature\":\"51c69af638ad7afd39841a7abf937d5df99e20adedc4287f43c8070d497ba78136c951192b3920914feb83b9272ccb2ca7facd835dfad10eff2b848b13616daf\",\"toAddr\":\"zil1f9uqwhwkq7fnzgh5x4djyzg4a7j3apx8dsnnc0\",\"version\":21823489}"
}
```

Response:

Sample

```json
{
    "signers": [
        "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r"
    ],
    "operations": [
        {
            "operation_identifier": {
                "index": 0
            },
            "type": "transfer",
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
            "type": "transfer",
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
    "account_identifier_signers": [
        {
            "address": "zil1n8uafq4thhzlq5nj50p55al9jvamr3s45hm49r",
            "metadata": {
                "base16": "99f9d482abbdC5F05272A3C34a77E5933Bb1c615"
            }
        }
    ]
}
```
