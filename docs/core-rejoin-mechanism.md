---
id: core-rejoin-mechanism
title: Rejoin Mechanism
---
This section will walk through joining and rejoining of different types of nodes.

### New node joining  / Existing shard node joining(Miner node was relaunched/restarted via launcher script)

1. launch_docker.sh / launch.sh / start.sh download persistence from AWS S3 incremental db using `download_incr_db.py`. It skips downloading microbBlocks and txBodies. More details of download_incr_db.py can be found [here](incremental-db.md).
2. Above launcher script later starts the zilliqa process with `syncType = NEW_SYNC`.
3. Zilliqa process retrieves Persistence Storage from dowloaded DB in (1).
4. It regenerates the current state using base state and state-deltas already fetched from incremental db.
5. syncType is not No_SYNC. so it blocks some messages that will be received as a healthy normal node.
6. It starts synchronization with `Node::StartSynchronization`.

#### `Node::StartSynchronization`

1. Send request to upper seeds (level2lookup 10- 14) so as to remove node IP from their relaxed blacklist, if any.
2. While Loop until syncType becomes NO_SYNC:
3. Fetch Latest DSBlocks and Latest TxBlocks from a random upper seed.
4. On receiving new TxBlock, fetch the corresponding state-deltas and calculate current state. Check whether it is a vacuous block, if so, after calculating state will move the state update to disk.
5. If not vacuous epoch,
    a) Fetch the latest Sharding Structure from a random upper seed and identify if already part of any shard.
    b) If it's not part of any shard, then it's indeed a new miner then go back to step (4).
    c) **Otherwise, already part of one of shard**. Set my shard members and shardId. Set `sycType = NO_SYNC` and send request to shard peers to remove IP from their relaxed blacklist.

    ---
    **NOTE:**
    If connection to node fails with error `EHOSTDOWN` or `ECONNREFUSED`, it's blacklisted in `relaxed` category. Otherwise in strict category.

    ---

    d) Start next Tx epoch where it initializes node variables like m_consensusID, m_consensusLeaderID, etc. Identify being BACKUP or leader, initializes Rumor Manager and starts with MicroBlockConsensus.
    The normal node now successfully joined the network as Shard Node.
6. If vacuous epoch, fetch Latest DS Committee Info and send request to a random upper seed to let him know when to start pow.
7. On receiving notification message from seed, start Init Mining and submit PoW.
8. If received DSBlock within timeout and finds himself in sharding information, change `syncType = NO_SYNC`. Stop blocking messages. **The normal node now successfully joined the network as Shard Node** .
9. If timedout,
    a) Try to fetch latest DSBlock from random seed. If successfully got new DSBlock means lost pow this time.
    It will continue syncing until next vacuous epoch as above by invoking `Node::StartSynchronization`.
    b) If failed to get new DSBlock, set `syncType = NORMAL_SYNC` and triggers `Node::RejoinAsNormal`.

#### `Node::RejoinAsNormal`

1. Set `SyncType = NORMAL_SYNC`.
2. Download Persistence from S3 incremental DB.
3. Retrieves Persistence Storage from dowloaded DB in step (2).
4. It regenerates the current state using base state and state-deltas already fetched from incremental db.
5. syncType is not No_SYNC. so it blocks some messages that will be received as a healthy normal node.
6. It starts synchronization with `Node::StartSynchronization`.

### Shard node - Daemon starts the killed zilliqa process (applicable only for zilliqa nodes)

1. Daemon starts the process with syncType in previous run. `i.e. SyncType = 5`
2. Its as good as recovery of any node from exising local persistence here onwards. Refer [Recovery](recovery.md).

### Existing DS node joining ( DS node was relaunched/restarted via launcher script)

1. launch_docker.sh / launch.sh / start.sh download persistence from AWS S3 incremental db using `download_incr_db.py`. It skips downloading microBlocks and txBodies. More details of download_incr_db.py can be found here.
2. Above launcher script later starts the zilliqa process with `syncType = NEW_SYNC`.
3. Zilliqa process retrieves Persistence Storage from dowloaded DB in step (1).
4. syncType is not `NO_SYNC`. so it blocks some messages that will be received as a healthy normal node.
5. It regenerates the current state using base state and state-deltas already fetched from incremental db.
6. Check if node is part of current ds committee, If so
    a) Save coin base for final block and all microblocks, from last DS epoch to current TX epoch.
    b) Send request to upper seeds (level2lookup 10- 14) so as to remove node IP from their relaxed blacklist, if any.
    c) If any of the coinbase is missing for any epoch or any shard, request cosigs for them from a random upper seed.
    d) Set `syncType = DS_SYNC`.
7. It starts synchronization with `DirectoryService::StartSynchronization`.

#### `DirectoryService::StartSynchronization`

1. Send request to upper seeds (level2lookup 10- 14) so as to remove node IP from their relaxed blacklist, if any.
2. While Loop until SyncType becomes NO_SYNC:
3. Fetch Latest DSBlocks and Latest TxBlocks from a random upper seed.
4. On receiving new TxBlock, fetch the corresponding statedeltas and calculate current state. Check whether it is a vacuous block, if so, after calculating state will move the state update to disk.
5. If node is dsguard and if rejoining was triggered because the pod/instance was deleted i.e. `m_ds.m_dsguardPodDelete = true`(Refer [DSGuard Pod Deletion](recovery.md##DSGuardNodePod/InstanceDeletion)), then invokes `FinishRejoinAsDS` only if its vacous epoch.
6. Otherwise, trigger `FinishRejoinAsDS` immediately.

#### `DirectoryService::FinishRejoinAsDS`

1. Recheck if node is still part of ds committee. If not triggers `RejoinAsNormal`.
2. If node is awaiting sending new IP to network i.e. `m_ds.m_awaitingToSubmitNetworkInfoUpdate = true`(Refer [DSGuard Pod Deletion](recovery.md##DSGuardNodePod/InstanceDeletion)), send new IP to the network.
3. If current epoch is already first tx epoch of new ds epoch, fetch the sharding structure again.
4. If not vacuous epoch, start next Tx epoch where it initializes node variables like m_consensusID, m_consensusLeaderID, etc. Identify being BACKUP or leader, initializes Rumor Manager and starts with state `MICROBLOCK_SUBMISSION`.
5. If vacuous epoch, start new ds epoch and starts with state `POW_SUBMISSION`.

### DS node - when VC Precheck fails

VC Precheck fails if next tx block or ds block got mined, but node failed to reach consensus for that block.
After which is triggers `DirectoryService::RejoinAsDS`.

#### `DirectoryService::RejoinAsDS`

1. Set `SyncType = DS_SYNC`.
2. Download Persistence from S3 incremental DB.
3. It retrieves Persistence Storage from dowloaded DB in step (2).
4. It starts synchronization with `DirectoryService::StartSynchronization`.

### DS node - Daemon starts the killed zilliqa process (applicable only for zilliqa nodes)

1. Daemon starts the process with syncType in previous run. `i.e. SyncType = 5`
2. Its as good as recovery of any node from existing local persistence here onwards. Refer [Recovery](recovery.md)

### New Seed Node joining

1. launch_docker.sh / launch.sh / start.sh download persistence from AWS S3 incremental db using `download_incr_db.py`. More details of download_incr_db.py can be found here [here](incremental-db.md).
2. Above launcher script later starts the zilliqa process with `syncType = NEW_LOOKUP_SYNC`.
3. Zilliqa process retrieves Persistence Storage from dowloaded DB in step (1).
4. It regenerates the current state using base state and statedeltas already fetched from incremental db.
5. SyncType is not `NO_SYNC`. so it blocks some messages that will be received as a healthy seed node.
6. It starts syncronization with `Lookup::InitSync`.

#### `Lookup::InitSync`

1. While Loop until SyncType becomes `NO_SYNC`:
2. Fetch Latest DSBlocks and Latest TxBlocks from a random upper seed.
3. On receiving new TxBlock, fetch the corresponding statedeltas and calculate current state. Check whether it is a vacuous block, if so, after calculating state will move the state update to disk.
4. Fetch UnavailableMicroBlockHashes for the newly fetched txBlocks from random lookup nodes. And also check for any missing mbs from last N txBlocks and fetch them from random lookup nodes, if any. (See `Lookup::CommitTxBlocks`)
5. Fetch latest DSInfo and Set `syncType = NO_SYNC`, then seed is ready again.

### Seed Node Rejoining (Also applicable for newlookup / level2lookup nodes)

Seed nodes might miss receiving any final block or ds block from multiplier (See more at ), in which case it triggers `RejoinAsNewlookup` to rejoin.

1. Set `syncType = NEW_LOOKUP_SYNC`.
2. If the number of missing final block are over NUM_FINAL_BLOCK_PER_POW (extreme bound), rejoin from S3 incremental db will be used. `i.e. RejoinAsNewlookup(fromLookup = false)`
3. Otherwise, rejoin by fetching missing final blocks from random lookup nodes. `i.e. RejoinAsNewlookup(fromLookup = true)`

#### `Lookup::RejoinAsNewlookup`

If `fromLookup = true`:

1. Invoke `Lookup::StartSynchronization`

If `fromLookup = false`:

1. Download Persistence from S3 incremental DB.
2. It retrieves Persistence Storage from dowloaded DB in step (1).
3. It starts syncronization with `Lookup::InitSync`.

#### `Lookup::StartSynchronization`

1. It fetches latest TxBlock and DSBlock from a random upper seed.
2. On receiving new TxBlock, fetch the corresponding statedeltas and calculate current state. Check whether it is a vacuous block, if so, after calculating state will move the state update to disk.
3. Fetch UnavailableMicroBlockHashes for the newly fetched txBlocks from random lookup nodes. And also check for any missing mbs from last N txBlocks and fetch them from random lookup nodes, if any. (See `Lookup::CommitTxBlocks`)
4. Fetch latest DSInfo and Set `syncType = NO_SYNC`, then seed/lookup is ready again.

### Lookup Node Rejoining

Lookup nodes might miss receiving any final block or ds block from network, in which case it triggers `RejoinAsLookup` to rejoin.

#### `Lookup::RejoinAsLookup`

1. Invoke `Lookup::StartSynchronization`.