---
id: core-blacklist
title: Blacklist
keywords:
  - core
  - blacklist
description: Core protocol design - blacklisting.
---

---

Zilliqa has a blacklisting feature implemented in `libNetwork`. The idea is to keep track of IP addresses of peers that, for conditions listed below, can potentially disrupt the operation of the node. Once blacklisted, the peer is effectively excluded from further interactions with the node.

## Blacklisting Conditions

- Socket write failure (according to `P2PComm::IsHostHavingNetworkIssue`)
- Socket connect failure (according to `P2PComm::IsHostHavingNetworkIssue`)
- Gossip message from peer exceeds `MAX_GOSSIP_MSG_SIZE_IN_BYTES`
- Bytes read from peer exceeds `MAX_READ_WATERMARK_IN_BYTES`

## Blacklist Checking

Outgoing

- `Lookup::SendMessageToRandomSeedNode`
- `P2PComm::SendMessageNoQueue`
- `SendJob::SendMessageCore`
- `SendJobPeer::DoSend`
- `SendJobPeers<T>::DoSend`

Incoming

- `P2PComm::AcceptConnectionCallback`

## Blacklist Exemptions

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

## Blacklist Removal and Clearing

- Non-lookup nodes remove `BLACKLIST_NUM_TO_POP` number of peers from the blacklist at the start of the DS epoch
- Non-lookup nodes also remove all blacklisted seed nodes from the blacklist at the start of the DS epoch
- Lookup nodes clear the entire blacklist upon receiving the DS Block

## Blacklist Enabling

Blacklist is enabled by default, and is only temporarily disabled when doing node recovery (`RECOVERY_ALL_SYNC`). In that situation, the blacklist is re-enabled once the Tx block is processed.

## Relaxed Blacklist

A peer can become unreachable if it temporarily goes down. In this case, socket connections to that peer would usually return `EHOSTDOWN` or `ECONNREFUSED` as the error message. When this occurs, we avoid blacklisting the peer in the "strict" sense as in the previously listed [conditions](#blacklisting-conditions). Instead, we blacklist the peer in the "relaxed" category.

While all incoming and outgoing messages from/to a peer that is strictly blacklisted are blocked, only outgoing messages to the peer are blocked for a peer that is in the relaxed blacklist. This allows the peer to have itself be removed from everyone's blacklist by sending the request for removal once it has come back online. Such a request will be accepted if the peer is found to be in the relaxed blacklist.
