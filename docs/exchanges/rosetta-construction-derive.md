---
id: rosetta-construction-derive
title: Derive
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
  - derive
description: Derive
---

---

## Derive an Address from a Public Key

Returns the address associated with the public key. Both `bech32` and checksummed `base16` format is returned.

Request:

```json
{
  "network_identifier": {
    "blockchain": "zilliqa",
    "network": "mainnet"
  },
  "public_key": {
    "hex_bytes": "026c7f3b8ac6f615c00c34186cbe4253a2c5acdc524b1cfae544c629d8e3564cfc",
    "curve_type": "secp256k1"
  },
  "metadata": {
    "type": "bech32"
  }
}
```

Response:

Sample

```json
{
  "address": "zil1y9qmlzmdygfaf4eqfcka4wfx20wzghzl05xazc",
  "account_identifier": {
    "address": "zil1y9qmlzmdygfaf4eqfcka4wfx20wzghzl05xazc",
    "metadata": {
      "base16": "2141BF8B6D2213d4d7204E2DDAB92653dC245c5F"
    }
  }
}
```
