---
id: rosetta-data-block
title: Block
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
description: Block
---

---

## Get a Block

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "mainnet"
  },
  "block_identifier": {
    "index": 672276,
    "hash": "23e69657bdf3de2026f4fc9b6b6b38964bf7a7d78b3e004a412ea088116ab5cd"
  }
}
```

Response:

Sample

```json
{
  "block": {
    "block_identifier": {
      "index": 672276,
      "hash": "23e69657bdf3de2026f4fc9b6b6b38964bf7a7d78b3e004a412ea088116ab5cd"
    },
    "parent_block_identifier": {
      "index": 672275,
      "hash": "f6928b5e4017487eb4e519890908f43489999cdf950aeca7ade07ad1f113ef51"
    },
    "timestamp": 1594882462967,
    "transactions": [
      {
        "transaction_identifier": {
          "hash": "e26d4cb1fa01003298b626dcc78351f10bc4e19b0c8c77d12f42cbd5d9dae694"
        },
        "operations": [
          {
            "operation_identifier": {
              "index": 0
            },
            "type": "TRANSFER",
            "status": "SUCCESS",
            "account": {
              "address": "zil14dzm27r68jpdjdnjrnw98ezs8unlp5mrhwal7x",
              "metadata": {
                "base16": "aB45b5787A3c82d936721cDC53E4503f27F0d363"
              }
            },
            "amount": {
              "value": "-199999000000000000",
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
            "status": "SUCCESS",
            "account": {
              "address": "zil1dthkxpk6dh30lkjfjysn9xz75s4d5xtd6gmv04",
              "metadata": {
                "base16": "6aeF6306DA6DE2FFDA49912132985Ea42ADa196d"
              }
            },
            "amount": {
              "value": "199999000000000000",
              "currency": {
                "symbol": "ZIL",
                "decimals": 12
              }
            },
            "metadata": {
              "gasLimit": "1",
              "gasPrice": "1000000000",
              "nonce": "2393",
              "receipt": {
                "accept": false,
                "errors": null,
                "exceptions": null,
                "success": true,
                "cumulative_gas": "1",
                "epoch_num": "672276",
                "event_logs": null,
                "transitions": null
              },
              "senderPubKey": "0x0252D19817A2956C34A3CC8C063BEF1F4A6E678FCF613711EC2E0D5ADA536FDBBB",
              "signature": "0x45AD9BC1413379A34D45B87B54741713392904F63CD741DCDD4C1561E47B68B8113C5E877CB64585E900AC9AC7221240D7753F703F6C1D112F804A0BCE89960B",
              "version": "65537"
            }
          }
        ]
      },
      {
        "transaction_identifier": {
          "hash": "71a0da72e03e4d6581505094e1716e02dc23d859923321b9452fd15ea6780403"
        },
        "operations": [
          {
            "operation_identifier": {
              "index": 0
            },
            "type": "TRANSFER",
            "status": "SUCCESS",
            "account": {
              "address": "zil1z3zky3kv20f37z3wkq86qfy00t4a875fxxw7sw",
              "metadata": {
                "base16": "14456246cc53d31f0a2EB00FA0248F7aEbD3fa89"
              }
            },
            "amount": {
              "value": "-103594390000000000",
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
            "status": "SUCCESS",
            "account": {
              "address": "zil1sfxppp4fvg9s20myeawzz6p5kqau448eh5npar",
              "metadata": {
                "base16": "824C1086A9620B053f64cF5C216834B03bcaD4F9"
              }
            },
            "amount": {
              "value": "103594390000000000",
              "currency": {
                "symbol": "ZIL",
                "decimals": 12
              }
            },
            "metadata": {
              "gasLimit": "1",
              "gasPrice": "1000000000",
              "nonce": "70611",
              "receipt": {
                "accept": false,
                "errors": null,
                "exceptions": null,
                "success": true,
                "cumulative_gas": "1",
                "epoch_num": "672276",
                "event_logs": null,
                "transitions": null
              },
              "senderPubKey": "0x038274E73930301B82B43345F442A07E0A08BF8B5DCDEFC01CFD688BA3077B194C",
              "signature": "0x04962BB97CAC6C24E076E46CC487B2959E017ACAF639CD40C8F99CF644B2C897CF44DA4795B65612F29E3E48DF4DFBBDC693FD32FBEF165AC365FBB5B00DD802",
              "version": "65537"
            }
          }
        ]
      },
      {
        "transaction_identifier": {
          "hash": "8e79839cf02fd01c1669d639756c9dcac303ae193cc44f936b8664231994ec31"
        },
        "operations": [
          {
            "operation_identifier": {
              "index": 0
            },
            "type": "TRANSFER",
            "status": "SUCCESS",
            "account": {
              "address": "zil1z3zky3kv20f37z3wkq86qfy00t4a875fxxw7sw",
              "metadata": {
                "base16": "14456246cc53d31f0a2EB00FA0248F7aEbD3fa89"
              }
            },
            "amount": {
              "value": "-1100888000000000",
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
            "status": "SUCCESS",
            "account": {
              "address": "zil12xnu6zvlulr6qceqlxqr7pyznjfgsyd8a909t6",
              "metadata": {
                "base16": "51a7Cd099Fe7c7a06320F9803f04829c928811a7"
              }
            },
            "amount": {
              "value": "1100888000000000",
              "currency": {
                "symbol": "ZIL",
                "decimals": 12
              }
            },
            "metadata": {
              "gasLimit": "1",
              "gasPrice": "1000000000",
              "nonce": "70612",
              "receipt": {
                "accept": false,
                "errors": null,
                "exceptions": null,
                "success": true,
                "cumulative_gas": "1",
                "epoch_num": "672276",
                "event_logs": null,
                "transitions": null
              },
              "senderPubKey": "0x038274E73930301B82B43345F442A07E0A08BF8B5DCDEFC01CFD688BA3077B194C",
              "signature": "0x59C7A52C85B5222F181294249AAD006B79330D405DBF77A3E9CC78DD892F96E37F8E55FE86EC1DF4F646094E22116446D462B8B12CEFFAC8647D6C4D6101F590",
              "version": "65537"
            }
          }
        ]
      }
    ]
  }
}
```
