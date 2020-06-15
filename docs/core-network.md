---
id: core-network
title: Network communication and topographies
---
## Gossip protocol

This document describes the rumor manager which enforces Gossip protocol for messaging in Zilliqa.

### Description

- The goal is to provide an efficient replacement to the existing broadcasting mechanism.
- The current broadcasting mechanism in `P2PComm::SendBroadcastMessage` is resource hungry; it sends O(n^2) messages, requires a lot of threads and opens a lot of TCP connections.
- The gossip algorithm, described in detail in this [link](https://zoo.cs.yale.edu/classes/cs426/2013/bib/karp00randomized.pdf) paper, provides a method to spread a message in O(logn) rounds and O(ln(ln(n))) messages,
where n is the number of peers participating in the gossip.
- RumorManager plays a role of managing all the gossips/rumors and their states.

### Interfaces

Following interfaces are exposed for node to enable gossiping messages in network.

#### InitializeRumorManager

Every node in network intializes the RumorManager with the peers from their shard or DSCommittee at start of new DS epoch or after successful view change.

Initialization involves following:

- Storing peerlist
- Storing pubkeys of peers from peerlist, DSCommitte members and lookup nodes
- Storing self peer-info and pub/priv key
- Starting of Rounds - that runs loop every `ROUND_TIME_IN_MS` ms.
  - Checks the state of every rumor in RumorHolder (More on RumorHolder later) and sends to `MAX_NEIGHBORS_PER_ROUND` random peers if not old enough.
  - RumorHolder monitors/changes state of each rumor it holds using Median Counter algorithm as explained in paper ( section 3 ) for every round.

#### SpreadRumor

Enables node to initiate the rumor to be gossipped with his peerlist. It will basically add the rumor to RumorHolder which in turn manages it states and further gossiping.

#### SpreadForeignRumor

Enables node to initiate spreading out rumor received from node not part of his peerlist ( hence foreign ).
It verifies the sender node against all the pubkeys stored during initialization of RumorManager

#### StopRounds

Stops the Round. Thereby stops gossiping rumors to peers.
  
### Rumor State Machine

Every rumor will be in one of following state at any time

- `NEW` : the peer `v` knows `r` and `counter(v,r) = m` (age/round)
- `KNOWN` : cooling state, stay in this state for a `m_maxRounds` rounds, participating in rumor spreading
- `OLD` : final state, member stops participating in rumor spreading

Every rumor starts with NEW. It either stay in same state or move on to KNOWN /OLD state immediately or in successive rounds based on algo mentioned in whitepaper. Every rumor is tied up with round ( consider it as rumor age).

Rumor is configured to stay in NEW and KNOWN state for max `<MAX_ROUNDS_IN_BSTATE>` and `<MAX_ROUNDS_IN_CSTATE>` respectively.
And to brutefully mark rumor as OLD, total rounds is limited to not exceed `<MAX_TOTAL_ROUNDS>`.

```xml
    <gossip_custom_rounds>
      <MAX_ROUNDS_IN_BSTATE>2</MAX_ROUNDS_IN_BSTATE>
      <MAX_ROUNDS_IN_CSTATE>3</MAX_ROUNDS_IN_CSTATE>
      <MAX_TOTAL_ROUNDS>6</MAX_TOTAL_ROUNDS>
    </gossip_custom_rounds>
```

Rumor State Machine is managed by `RumorHolder`

### Gossip Message Format

| START_BYTE_GOSSIP (0X33) | HDR | GOSSIP_MSGTYPE | GOSSIP_ROUND | GOSSIP_SNDR_PORT | PUB_KEY_SIZE | SIGNATURE | Payload Message |
|--------------------------|-----|----------------|--------------|------------------|--------------|-----------|-----------------|

### Optimization with Pull-Push Mechanism

Following are the GOSSIP_MSGTYPE :

- `PUSH` = 0x01
   Indicates response to PULL request and payload contains real raw message and send out to requesting peer

- `PULL` = 0x02
   Indicates request for real raw message of given hash and payload contains hash. Its being send out to sender in response to LAZY_PUSH or LAZY_PULL

- `EMPTY_PUSH` = 0x03
   Being send out every round to random neighbors if it has not active rumor in it store. Indicates asking for any rumors from neighbors. Payload contains unused dummy data.

- `EMPTY_PULL` = 0x04
   Being send out to sender of EMPTY_PULL or LAZY_PULL that it don't have any active rumors either. Payload contains unused dummy data.

- `FORWARD` = 0x05
   Special type that indicates that message being send out is from foreign peer. This would mean sender is from another shard or is lookup node.
   This would mean message is send out from :
    -lookup node to shard node or DSCommitte node
    -shard node to DSCommitte node and vice-versa

- `LAZY_PUSH` = 0x06
   Being send out every round to random neighbors for each active rumor in it store. Its payload contains the hash of real raw message intented to be gossiped eventually.

- `LAZY_PULL` = 0x07
   Indicates the response to the sender if it is the first time 'sender' have sent a LAZY_PUSH/EMPTY_PUSH message in this round. Its payload contains the hash of real raw message

  **(Note: Every gossip message is verified for signature before being accepted.)**

As mentioned above, Standard Push Pull mechanism is optimized further to gossip the hashes using EMPTY_* and LAZY_* and fetching the real messages using PUSH and PULL.
So, LAZY_PUSH and LAZY_PULL are the backbone for gossiping of hashes and are only ones which has valid `GOSSIP_ROUND` for underlying rumor (hash in our case).
For rest of message type, GOSSIP_ROUND is just set to -1 since it's not of any use.

### Further optimization

Due to nature of quick gossip, its possible that node might not have real message and only hash at some point of time. In such case, if node receives `PULL` message for that hash it adds that node to `subscription list`. As soon as nodes receives real message for that hash, it send it all peers in its subscription list.

### Reference

1. [Randomized Rumor Spreading](https://zoo.cs.yale.edu/classes/cs426/2013/bib/karp00randomized.pdf)

## Tree Based Cluster Broadcasting

This document describes the purpose, implementation details and application of Tree-Based-Cluster-Broadcasting.

### Description

- Gossip / Rumor spreading mechanism is used widely in zilliqa network for messaging. Refer [link](https://github.com/Zilliqa/dev-docs/blob/master/core/gossip-protocol.md) for more details of gossip protocol.
- However gossip protocol at it very basic needs the information of peer to spread the rumor with. This basic requirement of peer's info is available almost every time except when new DS block is mined.
- DS Block contains information of peers belonging to each shard which is leveraged by each node to initialize their peer list and restart gossip engine.
- However, spreading the DS Block itself is problem to be solved. Solution is `Tree-Based-Cluster-Broadcasting`.

### Purpose

In the new DS epoch, before receiving the DS block, a shard node doesn’t know the information of the other nodes in the same shard.
Thus, we should leverage multicast to broadcast the DS block to the nodes within a shard.

### Design

1. Assume that we have `X` nodes in a shard, each cluster has `Y` nodes, a cluster has `Z` children clusters, and every node has its sequence number `n` starting from `0`. `X / Y`  represents `[_X / Y_]`, e.g., `2/10 = 0, 11/10 = 1`.

2. Therefore, we have `X / Y` clusters , say `0 .. X/Y-1`. For a node `n`, it belongs to cluster `n / Y` and it’s at level `log_z(n/Y)`.

3. Then the node will multicast the message to the node `(n/Y * Z + 1)*Y` ~ `((n/Y * Z + Z + 1)* Y - 1)`.
    Bound checks on node index are needed to be done before multicasting. If check fails don’t broadcast.

![image01](core/features/tree-based-cluster-broadcasting/image01.jpg)

### Application

Based on above algorithm, below are the parameters which control broadcasting of DSBLOCK by ds-node to all nodes in the shard.

```xml
<data_sharing>
        <BROADCAST_TREEBASED_CLUSTER_MODE>true</BROADCAST_TREEBASED_CLUSTER_MODE>
        <NUM_FORWARDED_BLOCK_RECEIVERS_PER_SHARD>3</NUM_FORWARDED_BLOCK_RECEIVERS_PER_SHARD>
        <MULTICAST_CLUSTER_SIZE>10</MULTICAST_CLUSTER_SIZE>
        <NUM_OF_TREEBASED_CHILD_CLUSTERS>3</NUM_OF_TREEBASED_CHILD_CLUSTERS>
</data_sharing>
```

- `BROADCAST_TREEBASED_CLUSTER_MODE` : Enable/Disable Tree Based Cluster Broadcasting and fallback to pure multicasting.

- `NUM_FORWARDED_BLOCK_RECEIVERS_PER_SHARD` : Number of shard-nodes receiving the DSBLOCK from ds-node initially.

- `MULTICAST_CLUSTER_SIZE` : Number of nodes in each cluster.

- `NUM_OF_TREEBASED_CHILD_CLUSTERS` : Number of child clusters for given cluster.

## Blacklist

Zilliqa has a blacklisting feature implemented in `libNetwork`. The idea is to keep track of IP addresses of peers that, for conditions listed below, can potentially disrupt the operation of the node. Once blacklisted, the peer is effectively excluded from further interactions with the node.

### Blacklisting conditions

- Socket write failure (according to `P2PComm::IsHostHavingNetworkIssue`)
- Socket connect failure (according to `P2PComm::IsHostHavingNetworkIssue`)
- Gossip message from peer exceeds `MAX_GOSSIP_MSG_SIZE_IN_BYTES`
- Bytes read from peer exceeds `MAX_READ_WATERMARK_IN_BYTES`

### Blacklist checking

Outgoing

- `Lookup::SendMessageToRandomSeedNode`
- `P2PComm::SendMessageNoQueue`
- `SendJob::SendMessageCore`
- `SendJobPeer::DoSend`
- `SendJobPeers<T>::DoSend`

Incoming

- `P2PComm::AcceptConnectionCallback`

### Blacklist exemptions

Adding exclusion privilege

1. DS guards
   - When `NEWDSGUARDNETWORKINFO` is received (new IP)
   - Whenever DS committee is updated
1. Lookup nodes
   - Every time a message is sent out
1. Manual addition of an IP using `miner_info.py whitelist_add`

Removing exclusion privilege

1. DS guards
   - When `NEWDSGUARDNETWORKINFO` is received (old IP)
1. Manual removal of an IP using `miner_info.py whitelist_remove`

## Blacklist removal and clearing

- Non-lookup nodes remove `BLACKLIST_NUM_TO_POP` number of peers from the blacklist at the start of the DS epoch
- Non-lookup nodes also remove all blacklisted seed nodes from the blacklist at the start of the DS epoch
- Lookup nodes clear the entire blacklist upon receiving the DS Block

### Blacklist enabling

Blacklist is enabled by default, and is only temporarily disabled when doing node recovery (`RECOVERY_ALL_SYNC`). In that situation, the blacklist is re-enabled once the final block is processed.

## Messaging Limits

The volume and size of peer-to-peer communication for a Zilliqa node is controlled by several factors at different parts of the stack.

### Message Size

- `MIN_READ_WATERMARK_IN_BYTES`: The minimum number of bytes read from the socket before we act on the data. It is basically the `lowmark` parameter required by the libevent function `bufferevent_setwatermark`.
- `MAX_READ_WATERMARK_IN_BYTES`: The maximum number of bytes read from the socket before we stop accepting further input. It is basically the `highmark` parameter required by the libevent function `bufferevent_setwatermark`.
- `MAX_GOSSIP_MSG_SIZE_IN_BYTES`: The maximum size of a socket message with start byte = `START_BYTE_GOSSIP`. If a message reaches this size, the sender is blacklisted.

### Message Count

- `MAXMESSAGE`: The number of active threads for each job pool. For the incoming pool, this is the maximum number of concurrent messages to be dispatched for processing. For the outgoing pool, this is the maximum number of jobs for sending out each message to its own peer list.
- `MSGQUEUE_SIZE`: The maximum size of the incoming message queue (before transfer to the incoming pool), beyond which any further messages are dropped.
- `SENDQUEUE_SIZE`: The maximum size of the outgoing message queue (before transfer to the outgoing pool), beyond which any further messages are dropped.

### Sending Frequency

- `MAXRETRYCONN`: The maximum number of socket connection attempts to perform for sending messages to a peer.
- `PUMPMESSAGE_MILLISECONDS`: The maximum wait time (minimum being 1 ms) before re-attempting socket connection.

### Active Connections

- `MAX_PEER_CONNECTION`: The maximum number of active connections to a specific peer.