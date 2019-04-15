---
id: api-intro
title: 介绍
---

[JSON-RPC](https://en.wikipedia.org/wiki/JSON-RPC) 是一个用JSON编码的远程过程调用协议。您可以使用此API访问Zilliqa节点的数据。
JSON-RPC API服务器运行于：

主链(s) | URL(s) |
-------- | ------ | ------ 
**Zilliqa主网** | `https://api.zilliqa.com/` |
**开发者测试网络** | `https://dev-api.zilliqa.com/` |
**本地测试网络** | `http://localhost:4201/` |

所有API调用都是POST请求。

所有请求都遵循标准的JSON-RPC格式，并在数据对象中包含4个变量：

| 数据对象 |      Example      |
|----------|:-------------|
| `id` |  e.g. `"1"` |
| `jsonrpc` |    e.g. `"2.0"`   |
| `method` | e.g. `"GetBalance"` |
| `params` | e.g. `["1"]` |

要了解有关可用的JSON-RPC方法的更多信息，请访问[API文档](https://apidocs.zilliqa.com/#introduction)。

