---
id: core-messaging-limits
title: Messaging Limits
keywords:
  - core
  - messaging
  - limits
description: Core protocol design - messaging limits.
---

---

The volume and size of peer-to-peer communication for a Zilliqa node is controlled by several factors at different parts of the stack.

## Message Size

- `MIN_READ_WATERMARK_IN_BYTES`: The minimum number of bytes read from the socket before we act on the data. It is basically the `lowmark` parameter required by the libevent function `bufferevent_setwatermark`.
- `MAX_READ_WATERMARK_IN_BYTES`: The maximum number of bytes read from the socket before we stop accepting further input. It is basically the `highmark` parameter required by the libevent function `bufferevent_setwatermark`.
- `MAX_GOSSIP_MSG_SIZE_IN_BYTES`: The maximum size of a socket message with start byte = `START_BYTE_GOSSIP`. If a message reaches this size, the sender is blacklisted.

## Message Count

- `MAXSENDMESSAGE`: The number of active threads for the outgoing message pool.
- `MAXRECVMESSAGE`: The number of active threads for the incoming message pool.
- `SENDQUEUE_SIZE`: The maximum size of the outgoing message queue (before transfer to the outgoing pool), beyond which any further messages are dropped.
- `MSGQUEUE_SIZE`: The maximum size of the incoming message queue (before transfer to the incoming pool), beyond which any further messages are dropped.

## Sending Frequency

- `MAXRETRYCONN`: The maximum number of socket connection attempts to perform for sending messages to a peer.
- `PUMPMESSAGE_MILLISECONDS`: The maximum wait time (minimum being 1 ms) before re-attempting socket connection.

## Active Connections

- `MAX_PEER_CONNECTION`: The maximum number of active connections to a specific peer.
