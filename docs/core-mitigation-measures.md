---
id: core-mitigation-measures
title: Mitigation Measures
---
## Guard Mode

### Description

Guard mode is a special operating mode in Zilliqa. Guard mode is a safety feature that can be used at the start of the mainnet til mainnet is stable. Guard mode will ensure the following:

- Up to `n` (for instance, 2/3) nodes in DS committee are controlled by Zilliqa Research
- DS leader selection, in normal scenario and view change scenario, will only be done from nodes controlled by Zilliqa Research
- Up to `n` (for instance, 1/3) nodes across all shards are controlled by Zilliqa Research

**Guard mode is designed to be toggleable and does not interfere with standard protocol when not in guard mode.**

### Terminology

- DS guard - DS node controlled by Zilliqa Research
- Shard guard - Shard node controlled by Zilliqa Research

### Operation

1. To enable guard mode, set `GUARD_MODE` to `true` in `constants.xml`
1. Add `n` DS guard public keys to `ds_guard.DSPUBKEY` in `constants.xml`
1. Add `n` shard guard public keys to `shard_guard.SHARDPUBKEY` in `constants.xml`

### Design of DS guard and non-DS guard nodes

#### Normal operation

DS guard is designed to be statically placed in the DS committee. The first `n` nodes in the DS committee will be designated as DS guards. These do not change or shift during each DS consensus or view change while in guard mode.

| 1...n = DS guards (controlled by Zilliqa Research) | n+1...m = non-guard nodes |
|----------------------------------------------------|---------------------------|

DS Leader is selected from DS guards, by doing `mod n` rather than `mod m`.

Non-guard node joins the DS committee via PoW (according to DS difficulty). It will be emplaced starting from `n+1` index. As per usual operation, the last few DS nodes (non-guards) will be ejected from the DS committee.

> Note: The DS reputation feature (starting v5.0.0) also impacts DS committee member placement. Please refer to both DS MIMO and DS Reputation documents for more information on how DS committee membership is managed.

#### View change operation

When there is a view change, it is likely that a DS guard (leader) is faulty or the network failed to agree with what the DS guard (leader) proposed. In such a case, view change will happen. View change candidate leader will be selected from `1...n` DS guards by doing `mod n` rather than `mod m`.

Upon view change completion, there is no shifting of DS guard nodes. The DS guards stay in place. Shard nodes who receive the VC block will also not adjust the DS committee.

The DS committee updates `m_consensusLeaderID` to the new leader and the protocol resumes.

#### Rebalancing for shards

In the event that there is a reduction in the number of shards, we ensure that the remaining shards will not be entirely made up of guards. To do this, we trim the overall number of shard guards to 2/3 of the expected population (e.g., 1200 out of 1800), and then complete the count with non-shard guards. In the case where there are insufficient non-guard nodes, shard guard nodes will fill up the remaining slots.

Keywords to look for in the logs:

```console
DS leader:
trimmedGuardCount: [some value] trimmedNonGuardCount: [some value] Total number of accepted soln: [some value]

Example:
trimmedGuardCount: 80 trimmedNonGuardCount: 40 Total number of accepted soln: 120
```

#### Reducing shard guards

Reference: [PR 1508](https://github.com/Zilliqa/Zilliqa/pull/1508)

> Note: This section may need to be revised once shard guard reduction is planned for the mainnet.

When we need to reduce shard nodes, we will need to adjust the following constants which dictate the min % of shard guards per shard.

```console
<SHARD_GUARD_TOL>0.334</SHARD_GUARD_TOL>
```

The key idea to remove shard guard from shard is to remove `<SHARDPUBKEY>` from `constants.xml` during the upgrading.

For recovery and upgrading approach, you may follow the following testnet steps to conduct testing. The current steps remove 80 shard nodes (shard guards included).

```console
Baseline testnet (eg. current latest release).
Bootstrap one or skip this if you are getting from persistence from mainnet

./bootstrap.py -c <latest release commit> -n 200 -d 50 --guard 34/102 -l 1 --host-network true --gentxn false --lookup-multiplier true --default-genesis 5 --extra-genesis 5 --port 33133 <original testnet name>

Upload persistence
./testnet.sh upload dev.k8s.z7a.xyz <original testnet name>

Recover and upgrade to a smaller testnet
./bootstrap.py -c <new commit> -n 120 -d 50 --guard 34/51 -l 1 --host-network true --gentxn false --lookup-multiplier true --default-genesis 5 --extra-genesis 5 --port 33133 --recover-from-testnet jh3420 --recover-from-cluster dev.k8s.z7a.xyz <new testnet name>
```

#### Best effort approach for electing shard guard as shard leader

Reference: [PR 1513](https://github.com/Zilliqa/Zilliqa/pull/1513)

A best effort approach for selecting shard guard as shard leader was introduced in the PR. Recall that whether or not we are in guard mode, the calculation of new shard leader is:

```console
Leader index = last block hash % shard size
```

The new calculation is as follows:

```console
Leader index = last block hash % shard size

while leader is not shard guard (iterate up to n times)
Hash = sha2(last block hash)
Leader index = Hash % shard size

n is defined in constant SHARD_LEADER_SELECT_TOL
```

#### Runtime validation

Guard mode is designed to run when the following assumption holds:

- Number of new DS node injected into shard >= number of allowed non-guard shard nodes

Using a simple local run as an example:

- Number of nodes: 20
- DS nodes: 10
- Shard size: 5
- DS MIMO: 2

| 10 DS Node (8 guards) | Shard 1: 5 Nodes (4 guards) | Shard 2: 5 Nodes (4 guards) |
|-----------------------|-----------------------------|-----------------------------|

In such a case, when the network is reduced from 2 shards to 1 shard (due to some reason), the injection phase will inject more nodes than the shard limit. There is no good solution around it. Hence, `ValidateRunTimeEnvironment()` checks for such a condition and logs fatal if it happens.

| 10 DS Node (8 guards) | Shard 1: 6 Nodes (4 guards) | No longer exists |
|-----------------------|-----------------------------|------------------|

### Changing network information of DS guard node

#### Purpose

Nodes (or, specifically, docker containers) can be terminated due to software or hardware reasons. Under normal operation without guard mode, faulty DS node(s) can be gracefully kicked out of the DS committee using regular shifting and view change if necessary. However, in guard mode, DS guards do not shift and stay in the DS committee indefinitely. As such, we can possibly lose a node forever as Kubernetes does not support static IP addressing.

As such, we have devised a simple protocol for the DS guard to rejoin and update the network about its new information.

#### Updating mechanism

1. DS guard relaunches in a new pod
1. DS guard enters the DS guard rejoin stage and syncs with lookup
1. DS guard successfully enters `FinishRejoinAsDS()`
1. As part of the finish rejoin process, DS guard broadcasts its new network information and other relevant information to the lookup and gossips to DS committee (pubkey, network info and timestamp)
1. DS committee and lookup update their view of the DS committee
1. Lookup stores the updated information
1. At the next vacuous epoch, all shard nodes query the lookup for any new DS guard network update info, and set a flag to indicate that they are waiting for the new network information of DS guard
1. Lookup will not respond if there is no new information
1. Otherwise, lookup sends to requesting shard node the new DS guard network information. The lookup also signs the message.
1. Requesting shard node verifies the signature and proceeds to update its view of the DS committee.

#### Testing procedures

1. Run 20 nodes testnet with guard mode enabled
1. Kill 2nd DS guard node
   - netstat -antp | less
   - Look for port 4002
   - Get the process id
   - kill -9 [pid]
1. Relaunch DS guard node 2 using `./tests/Node/test_node_rejoindsguardnode2`
1. Check that DS committee, lookup and shard nodes are aware of the DS guard's updated network information
   - DS committee:

   ```console
   [update ds guard] DS guard to be updated is at index
   [indexOfDSGuard] [old network info] [new network info]
   ```

   - Shards:

   ```console
   [update ds guard][pubkey]new network info is [network info]
   ```

   - Lookup:
      - Received network info:

        ```console
        [update ds guard] DS guard to be updated is at index
        [indexOfDSGuard] [old network info] [new network info]
        ```

      - Add to in-memory data structure:

        ```console
        [update ds guard] No existing record found for dsEpochNumber [ds epoch number]. Adding a new record

        Or

        [update ds guard] Adding new record for dsEpochNumber [ds epoch number]
        ```

      - Send to shard node:

        ```console
        [update ds guard] Sending guard node update info to [requesting node]
        ```

#### Sequence Diagram

![image01](../assets/core/features/guard-mode/image01.png)

### Design of shard guard and non-shard guard nodes

Shard guard is designed to ensure that across all shards there are sufficient Zilliqa-controlled nodes. These nodes are special as

- They do PoW with difficulty 1
- Their PoW submissions are given priority by DS committee over normal shard nodes' submissions
- They do not join DS committee

As per the Zilliqa protocol, shard nodes (guard and non-guard) perform PoW. A non-guard node may perform up to 2 rounds of PoW (one for DS and one for shard). **However, a shard guard only performs PoW to enter shard.**

After the PoW window is over, the DS committee will begin to compose the sharding structure. The DS leader, as per current protocol, will trim the sharding structure such that each shard has exactly `COMM_SIZE` number of shard nodes. During the trimming, shard guards are given priority, and non-shard guard nodes are trimmed from the structure first. With the trimmed list, the DS leader will then randomly assign each node (shard guard and non-shard guard) to its respective shard.

Inline code comments:

```console
If total num of shard nodes to be trim, ensure shard guards do not get
 trimmed. To do it, a new map  will be created to include all shard
 guards and a subset of normal shard nods
Steps:
 1. Maintain a map that called "FilteredPoWOrderSorter". It will
 eventually contains Shard guards + subset of normal nodes
 2. Maintain a shadow copy of "PoWOrderSorter" called
 "ShadowPoWOrderSorter". It is to track non-guards node.
 3. Add shard guards to "FilteredPoWOrderSorter" and remove it from
 "ShadowPoWOrderSorter"
 4. If there are still slots left, obtained remaining normal shard node
 from "ShadowPoWOrderSorter". Use it to populate
 "FilteredPoWOrderSorter"
 5. Finally, sort "FilteredPoWOrderSorter" and stored result in
 "PoWOrderSorter"
```

### Running in local test mode

Local scripts have been retrofitted and DS/shard guard node key pairs have been pre-generated in the python local script. To run guard mode, use `tests/Node/pre_run_guard.sh` instead of the regular `pre_run` script.

```console
cd build && tests/Node/pre_run_guard.sh && ./tests/Node/test_node_lookup.sh && ./tests/Node/test_node_simple.sh
```

### Test scenarios

1. Normal operation with guard mode
   - Build as per normal
   - Enable guard mode
1. Guard mode with view change at DS block consensus
   - Build with VC1
   - Enable guard mode
1. Guard mode with view change at final block consensus
   - Build with VC3
   - Enable guard mode

### Validating the results via sampling

1. Check a DS guard node (e.g., node 1) to see whether or not it stays in DS committee indefinitely with no shifting
2. Check a DS guard node to ensure DS leader is always among the DS guard nodes
3. Check a shard guard node to ensure it never joins the DS committee
4. Check a non-shard guard node to ensure it has the chance to join the DS committee
5. Check view change in guard mode doesn’t shift the DS committee
6. Check lookup for any abnormal behavior

### Future todos

1. How to gracefully transit out of guard mode? ([Issue 336](https://github.com/Zilliqa/Issues/issues/336))

## Rejoin Mechanism

This document will walk through joining and rejoining of different types of nodes.

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

## Recovery Mechanism

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

## View Change

This document describes the view change process in Zilliqa. For automation of viewchange tests, please refer to this [link](https://github.com/Zilliqa/testnet/blob/master/vc_test/VCTESTS.md)

<!-- TOC depthTo:2 -->

- [Description](#description)
- [Usage](#usage)
- [Terminology](#terminology)
- [Trigger conditions](#trigger-conditions)
- [Setup](#setup)
- [Procedure](#procedure)
- [Test scenario setup](#test-scenario-setup)
- [General test scenario](#general-test-scenario)
- [Special test scenario](#special-test-scenario)
- [Test macro](#test-macro)
- [Known issues](#known-issues)

<!-- /TOC -->

### Description

This version of view change supports random candidate leader selection and re-selection of the candidate leader if it is faulty. It also fixes the issue where the wrong ds leader is ejected to the back of the queue, which is the result of a previous hotfix that fixes view change issue after random DS leader election.

To conduct view change, the general steps are as follows:

1. A stall in consensus must have happened
2. Network enters into view change state
3. Candidate leader leads the view change consensus using PBFT
4. Backups validate the announcement
5. View change consensus is reached
6. Re-run the stalled consensus

### Usage

Allows election of a new leader when the network cannot reach an agreement of the next state and stalled the consensus process

### Terminology

1. Candidate leader: Known as the proposed leader, the candidate leader will lead view change consensus round
2. Faulty leader(s): The current or previous DS leader(s) that is deemed to be faulty
3. Ejection: Eject the faulty leader(s) to the back of the ds committee. It will then be fully kicked out of the DS committee after the next DS consensus

### Trigger conditions

1. Node entered “RunConsensusOnDSBlock” but DS block consensus did not complete within the time stipulated
2. Node entered “RunConsensusOnFinalBlock” but final consensus did not complete within the time stipulated
3. Node entered “RunConsensusOnViewChange” but view change consensus did not complete within the time stipulated

### Setup

1. `[VC Block header]` Removal of candidate leader index as the index will be adjusted after view change and will be obsolete
2. `[VC Block header]` Addition of `vector<pair<PubKey, Peer>>` for tracking all the faulty leaders
3. `[Macro]` Add the related test scenario macro. Refer to test macros section.

### Procedure

1. Consensus stalled during DS consensus or Final block consensus
2. View change condition variable is triggered
3. Enter view change consensus
4. `[Precheck]` Enter the precheck phase. DS nodes contact lookup to ask for new blocks
5. `[Precheck]` If no new blocks (DS and FB) is obtained, proceeds to do view change
6. `[Precheck]` Else, rejoin as a DS node
7. All nodes calculate the new candidate leader index using `CalculateNewLeaderIndex()`
8. `CalculateNewLeaderIndex()` calculates candidate leader index using

    ```text
    H(finalblock or vc block hash, vc counter) % size (or num of DS guard)

    If a previous vc block (for current consensus) exists, use vc block hash. Else use final block hash. If new candidate leader index is current faulty leader, re-calculate using
    H(H(finalblock or vc block hash, vc counter)) repeatedly till an index is not the current faulty leader.
    ```

9. Candidate leader leads the consensus round
10. Backups validate leader announcement
11. View change consensus completed/stalled
a. If stalled, wait for timeout and re-run view change consensus with a new candidate leader
12. Remove faulty leaders (found in Faulty leader vector) from DS Committee
13. Add faulty leaders (found in Faulty leader vector) to the back DS Committee (if not in guard mode)
14. Recalculate `m_consensusMyID` by searching for own node inside the DS committee
15. Set new DS `m_consensusLeaderID`
16. Store VC block to persistent storage
17. If stalled consensus is at final block consensus, send the VC block to the lookup and shard nodes. Lookups and shard nodes update the ds composition respectively
18. If stalled consensus is at DS block consensus, hold and collect VC block(s) to the lookup and shard nodes.
19. Re-run stalled consensus (DS block or final block consensus). If re-run is at final block consensus, gas limit will be adjusted using exponential backoff algorithm.
20. Consensus completed
21. If DS block consensus, concatenate the DS block with VC block(s) and send to lookup and shard nodes
22. Lookup and shard nodes will process VC block(s) linearly followed by DS block

### Test scenario setup

A total of 6 general view change tests is built into the codebase as macro. To perform the test,

1. Remove the build folder
2. For a single test scenario

    ```bash
    ./build.sh vc<1-6>
    ```

3. For multiple test scenario

    ```bash
    ./build.sh vc<1-6> vc<1-6>
    ```

4. Build twice as the `ccache` may be hindering the macros

### General test scenario

#### Single failure

1. `vc1` - DS leader stalled at DS block consensus
2. `vc3` - DS leader stalled at Final block consensus

#### Multiple failures (after view change is completed)

1. `vc2` - DS leader stalls at DS block consensus and 2 candidate leaders stall at DS block consensus
2. `vc4` - DS leader stalls at Final block consensus and 2 candidate leaders stall at Final block consensus

#### Multiple failures (with view change consensus failure)

1. `vc1 vc5` - DS leader stalls at DS block consensus and candidate leaders stall at View Change consensus
2. `vc3 vc5` - DS leader stalls at Final block consensus and candidate leader stall at View Change consensus
3. `vc1 vc6` - DS leader stalls at DS block consensus and 2 candidate leaders stall at View Change consensus
4. `vc3 vc6` - DS leader stalls at Final block consensus and 2 candidate leaders stall at View Change consensus

#### VC Pre-check failed

1. `vc7` - When a DS backup is lagged (ds epoch) and the whole network did not enter into view change, check whether the node will rejoin as DS or not. Node with `consensusMyID` 3 will stall for 45s and enter view change to simulate node lagging behind.
2. `vc8` - When a DS backup is lagged (tx epoch) and the whole network did not enter into view change, check whether the node will rejoin as DS or not. Node with `consensusMyID` 3 will stall for 45s and enter view change to simulate node lagging behind.

### Special test scenario

Test plan for merging DS Microblock into FinalBlock consensus

1. Objective: Check fetching missing txn
   Scenario : DS leader has some txn that one of the backups doesn't have
   Adoption : Letting one of the backups accept fewer txns from lookup comparing to the others

2. Objective: Check View Change due to dsblock check failure within FinalBlock consensus
   Scenario : DS leader has some txn that all of backups don't have
   Adoption : Letting all of the backups accept fewer txns from lookup comparing to the leader

3. Objective: Check fetching missing microblock
   Scenario : DS leader has more microblock received than one of the backups
   Adoption : Letting one of the backups refuse some Microblock submission
4. Objective: Check View Change after fetching missing microblock
   Scenario : DS leader has more microblock received than all of the backups
   Adoption : Letting all of the backups refuse some Microblock submission

5. Objective: Check View Change due to TxBlock check failure within FinalBlock consensus
   Scenario : DS leader composed invalid TxBlock
   Adoption : Done by composing wrong state root hash

### Test macro

1. `vc1` - stall at the start of ds consensus for 1 time
2. `vc2` - stall at the start of ds consensus for 3 times
3. `vc3` - stall at the start of final consensus for 1 time
4. `vc4` - stall at the start of final consensus for 3 times
5. `vc5` - stall at the start of vc consensus for 1 time
6. `vc6` - stall at the start of vc consensus for 2 times
7. `vc7` - Node with `consensusMyID 3` will stall for 45s and enter view change to simulate node lagging behind at DS block consensus. Node will precheck and rejoin as DS. Network will not undergo view change
8. `vc8` - Node with `consensusMyID 3` will stall for 45s and enter view change to simulate node lagging behind at Final block consensus. Node will precheck and rejoin as DS. Network will not undergo view change
9. `dm1` - letting one of the backups accept fewer txns from lookup comparing to the others
10. `dm2` - letting all of the backups accept fewer txns from lookup comparing to the leader
11. `dm3` - letting one of the backups refuse some Microblock submission
12. `dm4` - letting all of the backups refuse some Microblock submission
13. `dm5` - compose the wrong TxBlock, done by composing wrong state root hash in the TxBlock
14. `dm6` - compose the wrong DSMicroBlock, done by composing wrong tranhashes in the DSMicroBlock
15. `dm7` - letting the ds leader accept fewer txns from lookup comparing to the others
16. `dm8` - letting the ds leader and half of the ds committee members accept fewer txns from lookup comparing to the others
17. `dm9` - letting the ds leader and half of the ds committee members refuse some MicroBlock submission

### Known issues

1. `VC7` and `VC8` require uploading of persistent storage from lookup. However, this process is not automated. Hence, these two tests will require manual intervention.
   - Run test
   - Upload lookup incremental DB at epoch 5
   - Observe DS node with `consensusMyID` 3 goes into view change and pre-checking
   - Check for invocation of `RejoinAsDS()` and `FinishRejoinAsDS()`
2. `DM3` not working due to constant settings. This is not an issue
3. `DM8` and `DM9` cannot be accurately validated using script

## Transaction Backup

## Diagnostic Data

We store in LevelDB a limited amount of some operational data about the network that is intended for use when diagnosing any issues with the mainnet.

Globally, the amount of data stored is controlled by the constant `MAX_ENTRIES_FOR_DIAGNOSTIC_DATA`, which is usually set to either 25 or 50.

This is the current data stored for diagnostic purposes:

|LevelDB location           |Data stored                     |Storage timing     |Tool for data extraction|
|---------------------------|--------------------------------|-------------------|------------------------|
|persistence/diagnosticNodes|DS and shard peers              |Every vacuous epoch|getnetworkhistory       |
|persistence/diagnosticCoinb|Coinbase values and distribution|Every DS block     |getrewardhistory        |

To use the diagnostic tools:

1. Make sure there is a `persistence` subfolder in your current directory.
1. Make sure `persistence/diagnosticNodes` `persistence/diagnosticCoinb` contains the data you want to extract.
1. Run `getnetworkhistory <name of output CSV file>` or `getrewardhistory <name of output CSV file>`.
1. Output CSV file will appear in the current directory. Use Excel or LibreOffice Calc to open it.

## Internal API

This API server runs on port 4301 by default on a node locally (i.e., cannot be accessed from outside).

### Available Methods

- **`AddToBlacklistExclusion`**: Can be used to add an API to the blacklist exclusion list (or whitelist).
- **`RemoveFromBlacklistExclusion`**: Can be used to remove an API from the blacklist exclustion list.
- **`GetNodeState`**: Used to get the state of the node, e.g., POW, COMMIT_DONE etc.
- **`GetEpochFin`**: Tells the epoch number for the lookup for which the microblocks and txns have been received.
- **`GetDSCommittee`**: Returns the list of IPs and PubKeys of the current DS Committee.
- **`IsTxnInMemPool`**: Used to query local mempool of the nodes. Can tell, given a particular txnhash, if it is in mempool and why (e.g., nonce too high or gas price low).