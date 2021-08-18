---
id: core-transaction-dispatch
title: Transaction Dispatch
keywords:
  - core
  - transaction
  - dispatch
description: Core protocol design - transaction dispatch.
---

---

From creation to confirmation, a transaction lifecycle proceeds in the following sequence:

1. An end user sends a `CreateTransaction` JSON request through the Zilliqa API. The transaction JSON contains the essential information about the transaction
1. The seed node that receives the request validates its contents and converts it into the core's transaction definition format
1. The seed node forwards this transaction (and other processed transaction requests) to a lookup node at intervals determined by `SEED_TXN_COLLECTION_TIME_IN_SEC`
1. The lookup node that receives the forwarded transaction decides which shard should process the transaction, and adds it to the transaction packet meant for that shard
1. At the start of every Tx epoch (plus a short delay determined by `LOOKUP_DELAY_SEND_TXNPACKET_IN_MS`), the lookup node dispatches its transaction packets to all the shards (including the DS committee)
1. The transaction packets are gossiped within the shards. Each node buffers the packet after receipt
1. Within the interval determined by `TX_DISTRIBUTE_TIME_IN_MS`, each node processes transaction packets buffered from the previous Tx epoch. Processing packets involves validating each transaction and adding these into the node's transaction memory pool
1. After the interval, the nodes (shards) first perform microblock, and then Tx block (DS committee) consensus. During consensus, transactions in the memory pool are consumed in a deterministic manner
1. After creation of the Tx block, the shard and DS nodes commit the transactions to the blockchain and forward the transaction receipts to the lookup nodes (and the seed nodes, through the [multipliers](core-multipliers.md))
1. The end user queries the transaction status through the Zilliqa API. The seed node that receives the request uses the transaction receipt to inform the user of the transaction's status
