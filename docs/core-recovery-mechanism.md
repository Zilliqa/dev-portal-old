---
id: core-recovery-mechanism
title: Recovery Mechanism
---
`Recovery` enables zilliqa controlled nodes to be recovered if they go out of sync with network.
Recovery mechanism can be used with different nodes of types - dsguard, shard guard, other normal nodes,
lookup, newlookup and level2lookup.

**Procedure :**

```Usage: ./testnet.sh recover TYPE "INDEX1 INDEX2 INDEX3 ..." [ -u UPLOAD_TYPE UPLOAD_INDEX ]

TYPE could be normal, lookup, new, newlookup, level2lookup, dsguard
INDEX needs be a valid integer
UPLOAD_TYPE could be normal, lookup, new, newlookup, level2lookup, dsguard to indicate the upload node type
UPLOAD_INDEX needs be a valid integer, to indicate to upload node index

```

Above script will download persistence from the specified `UPLOAD_TYPE` node and restart the zilliqa process using daemon (already running in container) with `syncType = RECOVERY_ALL_SYNC`.

Refer [how to recover](https://github.com/Zilliqa/dev-docs/blob/master/devops/mainnet-maintenance.md#how-to-recover-a-node) for details.

Based on the type of node being recovered and its existing state in current network, it will be recovered as  detailed out below.

### DS Guard Node Recovery

1. Kills Zilliqa process, and suspend the new process re-launching.
2. Testnet script downloads Persistence Storage.
3. Resumes to launch Zilliqa process with `syncType 5` i.e. `RECOVERY_ALL_SYNC`
4. Zilliqa process retrieves Persistence Storage downloaded earlier by testnet script in step (2).
5. syncType is not `NO_SYNC`. So it blocks some messages that will be received as a healthy node.
6. Checks if node is part of current ds committee, (which will always be the case for dsguards)
    a) Save coin base in memory (not saved to persistence) for final block and all microblocks, from last DS epoch to current TX epoch .
    b) Send request to upper seeds `level2lookup 10- 14` to remove node IP from their relaxed blacklist, if any.
    c) If any of the coinbase is missing for any epoch or any shard, request cosigs for them from a random upper seed.
    d) Set `m_shardID` and `m_consensusMyID`.
7. Invokes `WakeupAtTxEpoch` which will start with `FinalBlockConsensus`.

There are two possibilities hereafter:

- Start consensus on next block successfully and rejoined.
- We missed new final block during recovery process in which case it will go for VC Precheck failure followed by **triggering of `RejoinAsDS`**. Refer [Rejoin](join-rejoin.md###`DirectoryService::RejoinAsDS`)

### DS Guard Node Pod/Instance Deletion

1. On instance or Pod deletion of dsguard, new pod is assigned to that dsguard and zilliqa process is launced with `syncType = GUARD_DS_SYNC`.
2. Set `m_ds.m_awaitingToSubmitNetworkInfoUpdate = true`.
3. Set `m_ds.m_dsguardPodDelete = true`.
4. Triggers `DirectoryService::RejoinAsDS`.Refer [Rejoin](join-rejoin.md###`DirectoryService::RejoinAsDS`)

### Shard Guard Node Recovery

1. Kills Zilliqa process, and suspend the new process re-launching.
2. Testnet script downloads Persistence Storage.
3. Resumes to launch Zilliqa process with `syncType 5` i.e. `RECOVERY_ALL_SYNC`
4. Zilliqa process retrieves Persistence Storage downloaded earlier by testnet script in step (2).
5. syncType is not `NO_SYNC`. So it blocks some messages that will be received as a healthy node.
6. Checks if node is part of sharding structure,
    a) Set `m_shardID` and `m_consensusMyID`.
7. Invokes `WakeupAtTxEpoch` which will start with state on `WAITING_FINALBLOCK`.
8. Send request to upper seeds and his peers to remove node IP from their relaxed blacklist, if any.

There are two possibilities hereafter:

- Receives next final block and joined back.
- We missed new final block during recovery process in which case **it will trigger `RejoinAsNormal`**. Refer [Rejoin](join-rejoin.md###`Node::RejoinAsNormal`)

### Shard Guard Node Pod/Instance Deletion

1. On instance or Pod deletion of dsguard, new pod is assigned to that dsguard and zilliqa process is launced with `syncType = RECOVER_ALL_SYNC`.
2. Node don't receive any messages from peers because of IP change and is stuck.
3. We can recover such node in next ds epoch, after which it will not be part of any shard and will trigger `RejoinAsNormal`**. Refer [Rejoin](join-rejoin.md###`Node::RejoinAsNormal`)

### Other Node (Not part of ds committe or any shard)

1. Kills Zilliqa process, and suspend the new process re-launching.
2. Testnet script downloads Persistence Storage.
3. Resumes to launch Zilliqa process with `syncType 5` i.e. `RECOVERY_ALL_SYNC`
4. Zilliqa process retrieves Persistence Storage downloaded earlier by testnet script in step (2).
5. syncType is not `NO_SYNC`. So it blocks some messages that will be received as a healthy node.
6. If node is not part of sharding structure or current ds committee, **It triggers `RejoinAsNormal`**. Refer [Rejoin](join-rejoin.md###`Node::RejoinAsNormal`)

### NewLookup / Level2Lookup Node Recovery

1. Kills Zilliqa process, and suspend the new process re-launching.
2. Testnet script downloads Persistence Storage.
3. Resumes to launch Zilliqa process with `syncType 5` i.e. `RECOVERY_ALL_SYNC`
4. Zilliqa process retrieves Persistence Storage downloaded earlier by testnet script in step (2).
5. syncType is not `NO_SYNC`. So it blocks some messages that will be received as a healthy node.
6. Invokes `WakeupAtTxEpoch` which will start with state on `WAITING_FINALBLOCK`.

There are two possibilities hereafter:

- Receives next final block and joined back.
- We missed new final block during recovery process in which case **it will trigger `RejoinAsNewlookup`**.
Based on number of final blocks missed over period of recovery, Rejoin will be either based out of incremental db or it will continue syncing the missing blocks from lookup. For details refer [Rejoin](join-rejoin.md###`Lookup::RejoinAsNewlookup`)

### Lookup Node Recovery

1. Kills Zilliqa process, and suspend the new process re-launching.
2. Testnet script downloads Persistence Storage.
3. Resumes to launch Zilliqa process with `syncType 5` i.e. `RECOVERY_ALL_SYNC`
4. Zilliqa process retrieves Persistence Storage downloaded earlier by testnet script in step (2).
5. syncType is not `NO_SYNC`. So it blocks some messages that will be received as a healthy node.
6. Invokes `WakeupAtTxEpoch` which will start with state on `WAITING_FINALBLOCK`.

There are two possibilities hereafter:

- Receives next final block and joined back.
- We missed new final block during recovery process in which case **it will trigger `RejoinAsLookup`**. Refer [Rejoin](join-rejoin.md###`Lookup::RejoinAsLookup`)