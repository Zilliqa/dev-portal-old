---
id: core-rejoin-mechanism
title: Rejoin Mechanism
keywords:
  - core
  - rejoin
  - mechanism
description: Core protocol design - rejoin mechanism.
---

---

The sections below explain the joining and rejoining process for the different types of nodes.

Some terms used are:

1. **Launch script**: This refers to either of the scripts supplied in the Mainnet joining page (i.e., `launch_docker.sh` and `launch.sh`) or `start.sh` for guard nodes
1. **Upper seed**: A seed node that the node can query for blockchain data. One or more upper seeds are normally listed in `constants.xml`

The joining or rejoining process relies on a `m_syncType` setting, which can be any of these values:

| SyncType                | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `(0) NO_SYNC`           | Indicates that a node is fully synced             |
| `(1) NEW_SYNC`          | New node (possibly sharded) joining or rejoining  |
| `(2) NORMAL_SYNC`       | New node (unsharded) joining                      |
| `(3) DS_SYNC`           | DS node rejoining                                 |
| `(4) LOOKUP_SYNC`       | Lookup node rejoining                             |
| `(5) RECOVERY_ALL_SYNC` | Launching entire network from existing blockchain |
| `(6) NEW_LOOKUP_SYNC`   | New lookup node joining                           |
| `(7) GUARD_DS_SYNC`     | DS guard node rejoining                           |

:::note
Guard-specific sequences have been omitted to simplify the sections below.
:::

## New Node Joining

:::note
This also applies to existing shard nodes who attempt to rejoin using the launch script.
:::

1. Launch script downloads the latest persistence from AWS S3 [incremental DB](core-incremental-db.md) using `download_incr_db.py`
1. Launch script starts the node (i.e., the `zilliqa` process) with `m_syncType = NEW_SYNC`
1. The node reads out the local `persistence` which was updated by the launch script
1. The node recreates the current state using the base state and state deltas fetched from incremental DB
1. Since `m_syncType` is not `NO_SYNC`, the node blocks some messages that will normally be processed by a synced node
1. The node starts synchronization using `Node::StartSynchronization()`

### `Node::StartSynchronization()`

1. Send request to all upper seeds to remove the node's IP address from their [relaxed blacklist](core-blacklist.md#relaxed-blacklist)
1. Fetch the more recent DS blocks and Tx blocks from a random upper seed
1. Separate threads process Tx blocks upon receipt, fetching the corresponding state deltas and calculating the current state for each one
1. If the latest Tx block is for a non-vacuous epoch:
   1. Fetch the latest sharding structure from a random upper seed and check if this node is already part of a shard
   1. If it's not part of any shard, then it's considered a new miner, in which case continue to fetch recent blocks according to the earlier step
   1. If it's already part of a shard
      1. Set the shard parameters (members and ID)
      1. Change `m_syncType` to `NO_SYNC` and stop blocking messages
      1. Send request to shard peers for removal from relaxed blacklist
      1. Start next Tx epoch by initializing node variables (e.g., `m_consensusID`, `m_consensusLeaderID`, etc.), checking current role (i.e., shard leader or backup), initializing Rumor Manager, and proceeding with microblock consensus
      1. At this point the node has successfully rejoined the network as an existing shard node
1. If the latest Tx block is for a vacuous epoch:
   1. Move state updates to disk after calculating the state
   1. Fetch latest DS committee information, and send request to a random upper seed to let this node know when to start PoW mining
   1. Start mining upon receiving the notification from the upper seed
   1. If the next DS block includes this node in the sharding information:
      1. Change `m_syncType` to `NO_SYNC` and stop blocking messages
      1. At this point the node has successfully joined the network as a new shard node
   1. If the node fails to receive the next DS block in time:
      1. Fetch the latest DS block from a random upper seed
      1. If a new DS block was in fact created, it means this node lost PoW. Continue syncing until next vacuous epoch as done above
      1. If the node fails to get a new DS block from the upper seed, set `syncType = NORMAL_SYNC` and trigger `Node::RejoinAsNormal`

The node maintains a while loop within `Node::StartSynchronization()` while all the steps above are performed (except the relaxed blacklist removal request). It exits the while loop when `m_syncType` becomes `NO_SYNC`.

### `Node::RejoinAsNormal()`

1. Set `SyncType = NORMAL_SYNC`
1. Download latest persistence from AWS S3 incremental DB
1. Retrieve the downloaded persistent storage
1. Recreate the current state using the base state and state deltas fetched from incremental DB
1. Since `m_syncType` is not `NO_SYNC`, block some messages that will normally be processed by a synced node
1. Start synchronization using `Node::StartSynchronization()`

## DS Node Joining

:::note
This also applies to existing DS nodes who attempt to rejoin using the launch script.
:::

This procedure mirrors that of new node joining, with some differences:

1. After recreating the current state, check if the node is part of the current DS committee. If yes:
   1. Recreate the coinbase for all Tx blocks and microblocks from the start of the latest DS epoch
   1. Fetch missing cosignatures (needed for coinbase recreation) from a random upper seed
   1. Send request to all upper seeds for removal from relaxed blacklist
   1. Trigger `DirectoryService::StartSynchronization()`
1. If the node is not part of the current DS committee, trigger `Node::RejoinAsNormal()`

### `DirectoryService::RejoinAsDS()`

This procedure mirrors `Node::RejoinAsNormal()`, with some differences:

1. Set `SyncType = DS_SYNC`
1. Start synchronization using `DirectoryService::StartSynchronization()`

### `DirectoryService::StartSynchronization()`

This procedure mirrors `Node::StartSynchronization()`, with some differences:

1. The node doesn't need to check for shard membership. However, after recreating current state, if the node is no longer part of DS committee, then trigger `Node::RejoinAsNormal()`
1. After recreating current state, if a new DS epoch has started, then fetch the updated sharding structure again
1. Start next Tx epoch by initializing node variables (e.g., `m_consensusID`, `m_consensusLeaderID`, etc.), checking current role (i.e., DS leader or backup), initializing Rumor Manager, and proceeding with microblock consensus
1. If the latest Tx block is for a non-vacuous epoch, set state to `MICROBLOCK_SUBMISSION`
1. If the latest Tx block is for a vacuous epoch, set state to `POW_SUBMISSION`
1. At this point the node has successfully rejoined the network as an existing DS node

### Other Conditions That Trigger DS Node Rejoining

1. When a view change occurs, DS nodes initially perform a pre-check. One of the reasons pre-check can fail is if a new DS block or Tx block was mined during the pre-check and this particular node failed to participate in the consensus for that block. This will cause the node to invoke `DirectoryService::RejoinAsDS()`
1. If `Node::Install()` fails for whatever reason, the DS node checks if it is still part of the DS committee. If it is, it triggers `RejoinAsDS()`. If not, it triggers `RejoinAsNormal()`
1. If the node is started with `SyncType` of `DS_GUARD_SYNC`, it triggers `RejoinAsDS()`

## Seed Node Joining

This procedure mirrors that of new node joining, with some differences:

1. Launch script starts the node with `m_syncType = NEW_LOOKUP_SYNC`
1. The node starts synchronization using `Lookup::InitSync()`

### `Lookup::InitSync()`

1. Fetch the more recent DS blocks and Tx blocks from a random upper seed
1. Separate threads process Tx blocks upon receipt, fetching the corresponding state deltas and calculating the current state for each one
1. If the latest Tx block is for a vacuous epoch:
   1. Move state updates to disk after calculating the state
1. Fetch any microblocks from a random upper seed for newly received Tx blocks as well as for the last `N` Tx blocks read out from persistence
1. Fetch the latest sharding structure from a random upper seed
1. Set `syncType = NO_SYNC`
1. At this point the node has successfully rejoined the network as a seed node

The node maintains a while loop within `Lookup::InitSync()` while all the steps above are performed. It exits the while loop when `m_syncType` becomes `NO_SYNC`.

### `Lookup::RejoinAsNewlookup()`

A seed node can potentially miss receiving a Tx block or DS block, in which case it goes out of sync and triggers `RejoinAsNewlookup` to rejoin.

1. Set `syncType = NEW_LOOKUP_SYNC`
1. If the number of missing Tx blocks exceeds `NUM_FINAL_BLOCK_PER_POW`:
   1. Download latest persistence from AWS S3 incremental DB
   1. Retrieve the downloaded persistent storage
   1. Start synchronization using `Lookup::InitSync()`
1. If the number of missing Tx blocks does not exceed `NUM_FINAL_BLOCK_PER_POW`:
   1. Start synchronization using `Lookup::StartSynchronization()`

### `Lookup::StartSynchronization()`

1. Fetch the more recent DS blocks and Tx blocks from a random upper seed
1. Separate threads process Tx blocks upon receipt, fetching the corresponding state deltas and calculating the current state for each one
1. If the latest Tx block is for a vacuous epoch:
   1. Move state updates to disk after calculating the state
1. Fetch any microblocks from a random upper seed for newly received Tx blocks as well as for the last `N` Tx blocks read out from persistence
1. Fetch the latest DS committee information from a random upper seed
1. Set `syncType = NO_SYNC`
1. At this point the node has successfully rejoined the network as a seed node

## Lookup Node Rejoining

A lookup node can potentially miss receiving a Tx block or DS block, in which case it goes out of sync and triggers `RejoinAsLookup` to rejoin.

### `Lookup::RejoinAsLookup()`

1. Set `syncType = LOOKUP_SYNC`
1. Start synchronization using `Lookup::StartSynchronization()`
