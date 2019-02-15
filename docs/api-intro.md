---
id: api-intro
title: Introduction
---

[JSON-RPC](https://en.wikipedia.org/wiki/JSON-RPC) is a remote procedure call protocol encoded in JSON. You can use this API to access data from the Zilliqa nodes.
The JSON-RPC API server runs on:

Chain(s) | URL(s) |
-------- | ------ |
**Zilliqa Mainnet** | `https://api.zilliqa.com/` |
**Developer testnet** | `https://dev-api.zilliqa.com/` |
**Local testnet** | `http://localhost:4201/` |

All API calls are POST requests.

All requests follow the standard JSON-RPC format and include 4 variables in the data object:

| Data object |      Example      |
|----------|:-------------|
| `id` |  e.g. `"1"` |
| `jsonrpc` |    e.g. `"2.0"`   |
| `method` | e.g. `"GetBalance"` |
| `params` | e.g. `["1"]` |

To find out more about the JSON-RPC methods available, please visit the [API documentation](https://apidocs.zilliqa.com/#introduction)