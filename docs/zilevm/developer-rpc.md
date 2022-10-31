---
id: developer-rpc
title: RPC
keywords:
  - RPC
description: Specification of ZILEVM RPC Endpoint
---

---

## RPC API specification

### Fully supported APIs

eth_getStorageAt
eth_getCode
eth_getBalance
eth_blockNumber
web3_clientVersion
web3_sha3
net_version
net_listening
net_peerCount
eth_protocolVersion
eth_chainId
eth_mining (alway returns false)
eth_getBlockTransactionCountByHash
eth_getBlockTransactionCountByNumber
eth_getUncleCountByBlockHash
eth_getUncleCountByBlockNumber
eth_call
eth_getTransactionCount
eth_getTransactionByHash
eth_getTransactionByBlockHashAndIndex
eth_getTransactionByBlockNumberAndIndex
eth_sendRawTransaction
eth_newFilter
eth_newBlockFilter
eth_newPendingTransactionFilter
eth_uninstallFilter
eth_getFilterChanges
eth_getFilterLogs
eth_getLogs
eth_subscribe
eth_unsubscribe

### Partially supported API

Partially usually means returning some constant value or partial value, which is satisfying the current testing needs, but will have to be extended in the future for the full implementation.

eth_accounts (always returns an empty set of accounts)
eth_syncing (always returns false)

### Will not be supported

Mostly APIs related to submission of mining work and deprecated APIs.

eth_getWork
eth_submitWork
eth_submitHashrate
db_putString (deprecated)
db_getString (deprecated)
db_putHex (deprecated)
db_getHex (deprecated)
shh_version (deprecated)
shh_post (deprecated)
shh_newIdentity (deprecated)
shh_hasIdentity (deprecated)
shh_newGroup (deprecated)
shh_addToGroup (deprecated)
shh_newFilter (deprecated)
shh_uninstallFilter (deprecated)
shh_getFilterChanges (deprecated)
shh_getMessages (deprecated)
