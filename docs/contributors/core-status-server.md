---
id: core-status-server
title: Status Server
keywords:
  - core
  - status
  - server
description: Core protocol design - status server.
---

---

Every Zilliqa node has an API server listening on port `STATUS_RPC_PORT` (4301 by default). This server can only be accessed on localhost.

This status server provides useful information about the operational parameters of the node. It also enables the user to control the behavior of the node along different aspects of its operation (e.g., stopping PoW mining at the end of the epoch).

The utility script [miner_info.py](https://github.com/Zilliqa/Zilliqa/blob/master/scripts/miner_info.py) allows interacting with the status server.

Among the available commands supported by the utility script are:

- **checktxn**: Checks if a transaction is in the node's transaction memory pool
- **difficulty**: Returns the latest difficulty for PoW mining
- **disable_pow**: Prevents a node from performing PoW mining at the next epoch
- **ds**: Returns the list of members of the DS committee
- **ds_difficulty**: Returns the latest DS difficulty for PoW mining
- **dsepoch**: Returns the latest DS epoch number
- **epoch**: Returns the latest Tx epoch number
- **state**: Returns the state of this node according to its state machine
- **type**: Returns the node type (e.g., DS or shard)
