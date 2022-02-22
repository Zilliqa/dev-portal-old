---
id: core-gossip
title: Gossip
keywords:
  - core
  - gossip
description: Core protocol design - gossip.
---

---

A `RumorManager` library is available in the Zilliqa core to support message gossiping between nodes.

## Overview

- The goal is to provide an alternative communication method to broadcasting, particularly in large-scale clusters.
- The broadcasting implemented in `P2PComm::SendBroadcastMessage` is resource-hungry; it sends `O(n^2)` messages, requires a lot of threads, and opens too many TCP connections.
- The gossip algorithm, described in detail in this [paper](https://web.archive.org/web/20180329145609/https://zoo.cs.yale.edu/classes/cs426/2013/bib/karp00randomized.pdf), provides a method to spread a message in `O(logn)` rounds and `O(ln(ln(n)))` rumor messages (where `n` is the number of peers participating in the gossip).
- `RumorManager` plays the role of managing all the gossips/rumors and their states.

## Interfaces

The following interfaces are exposed for a node to enable gossiping messages in the network.

### InitializeRumorManager

Every node in the network intializes `RumorManager` with the list of peers from their own shard or committee at the start of a new DS epoch (or after a successful view change).

Initialization involves the following:

- Storing peer list
- Storing public keys of the peers in the peer list, the DS committee members, and lookup nodes
- Storing the node's own peer information and key pair
- Starting of rounds (that runs a loop every `ROUND_TIME_IN_MS` ms), which includes:
  - Checking the state of every rumor in `RumorHolder` and sending to `MAX_NEIGHBORS_PER_ROUND` random peers (if the rumor is not old enough).
  - `RumorHolder` monitors/changes the state of each rumor it holds using the Median Counter algorithm (as explained in Section 3 of the whitepaper) for every round.

### SpreadRumor

This enables the node to initiate the rumor to be gossiped with its peer list. It will basically add the rumor to `RumorHolder`, which in turn manages its states and further gossiping.

### SpreadForeignRumor

This enables the node to initiate spreading of the rumor received from a node that is not part of its peer list (hence, "foreign"). It verifies the sender node against all the public keys stored during the initialization of `RumorManager`.

### StopRounds

Stops the gossip round, thereby stopping the gossiping of rumors to peers.

## Rumor State Machine

The rumor state machine is managed by `RumorHolder`.

Every rumor will be in one of following states at any time:

- `NEW`: The peer `v` knows `r` and `counter(v,r) = m` (age/round)
- `KNOWN`: Cooling state; stay in this state for `m_maxRounds` rounds, and participate in rumor spreading
- `OLD`: Final state; member stops participating in rumor spreading

Every rumor starts in the `NEW` state. It either stays in this state, or moves on to `KNOWN` or `OLD` state immediately or in successive rounds based on the algorithm mentioned in the whitepaper. Every rumor is tied up with the round (consider it as the rumor age).

A rumor is configured to stay in `NEW` and `KNOWN` state for a maximum of `<MAX_ROUNDS_IN_BSTATE>` and `<MAX_ROUNDS_IN_CSTATE>`, respectively.
The total rounds is configured to not exceed `<MAX_TOTAL_ROUNDS>`, after which the rumor is marked as `OLD`. These settings are found in the node's constants file, like thus:

```xml
<gossip_custom_rounds>
  <MAX_ROUNDS_IN_BSTATE>2</MAX_ROUNDS_IN_BSTATE>
  <MAX_ROUNDS_IN_CSTATE>3</MAX_ROUNDS_IN_CSTATE>
  <MAX_TOTAL_ROUNDS>6</MAX_TOTAL_ROUNDS>
</gossip_custom_rounds>
```

## Gossip Message Format

| Field             | Description                          |
| ----------------- | ------------------------------------ |
| START_BYTE_GOSSIP | 0x33 (indicates gossip message type) |
| HDR               | Message header                       |
| GOSSIP_MSGTYPE    | See next section                     |
| GOSSIP_ROUND      | Rumor age (as per sender of message) |
| GOSSIP_SNDR_PORT  | Listening port of sender             |
| PUB_KEY           | Sender's public key                  |
| SIGNATURE         | Signature over the payload           |
| Payload           | Rumor to be gossiped                 |

## Optimized Pull-Push Mechanism

`GOSSIP_MSGTYPE` can refer to any of the following:

- `PUSH (0x01)`: The response to a `PULL` request. The payload contains the raw message. It is sent out to the requesting peer.
- `PULL (0x02)`: The request for the raw message for a given hash. The payload contains the hash. It is sent out in response to the node who sent `LAZY_PUSH` or `LAZY_PULL`.
- `EMPTY_PUSH (0x03)`: This is sent out at every round to random neighbors if the node does not have any active rumors in its store. It indicates asking for any rumors from the node's neighbors. The payload contains unused dummy data.
- `EMPTY_PULL (0x04)`: This is sent out to the sender of `EMPTY_PULL` or `LAZY_PULL` to indicate that it doesn't have any active rumors either. The payload contains unused dummy data.
- `FORWARD (0x05)`: A special type that indicates that the message being sent out is from a foreign peer. This means the sender does not belong to the current shard or committee. Normally it is sent from a lookup to a shard or DS committee node, or between a shard node and DS committee node (in either direction).
- `LAZY_PUSH (0x06)`: This is sent out at every round to random neighbors for each active rumor in its store. The payload contains the hash of the raw message intended to be gossiped.
- `LAZY_PULL (0x07)`: The response to the sender if it is the first time that sender has sent a `LAZY_PUSH`/`EMPTY_PUSH` message during this round. The payload contains the hash of the raw message.

:::note
Every gossip message is signed, and the signature is verified before being accepted.
:::

Through the messages above, the standard Push-Pull mechanism is optimized by gossiping the hashes using `EMPTY_*` and `LAZY_*` and fetching the actual raw messages using `PUSH` and `PULL`.

So, `LAZY_PUSH` and `LAZY_PULL` are the backbone for gossiping of hashes, and are the only gossip messages that have a valid `GOSSIP_ROUND` for their underlying rumor (i.e., the hash). For the other message types, `GOSSIP_ROUND` is just set to -1 since it has no use in these types.

## Message Subscription

Due to the nature of quick gossip, it's possible that a node might have just the hash and not the raw message yet at a particular point in time. In such cases, if the node receives a `PULL` message for that hash, it adds that node to a subscription list. As soon as the node receives the raw message for that hash, it then sends it out to all the peers in the subscription list.
