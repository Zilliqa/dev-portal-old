---
id: core-message-queues
title: Message Queues and Jobs
keywords:
  - core
  - message
  - queues
  - jobs
description: Core protocol design - message queues and jobs.
---

---

Incoming and outgoing message queues are maintained between `P2PComm` and the rest of the Zilliqa core. This helps provide some ordering in the processing of messages, and it also adds some control over the number of messages that can be buffered. Once ready for processing, messages enter a thread pool, which regulates the number of messages that can be processed concurrently.

After an incoming message is read from a socket, it is first inserted into `Zilliqa::m_msgQueue`, whose maximum size is controlled by `MSGQUEUE_SIZE`. When the queue reaches full capacity, any further incoming messages are dropped. A dedicated thread launched during startup manages dequeueing of messages and sending them to `Zilliqa::m_queuePool`, a thread pool limited by `MAXRECVMESSAGE`. Once assigned to a thread, the message gets dispatched according to the earlier section.

Equivalently, before an outgoing message is written out to a socket, it is first inserted into `P2PComm::m_sendQueue`, whose maximum size is controlled by `SENDQUEUE_SIZE`. Any further outgoing messages are also dropped once the queue is full. A dedicated thread launched during startup also manages dequeueing of messages and sending them to `Zilliqa::m_SendPool`, which is also limited by `MAXSENDMESSAGE`. One assigned to a thread, the message gets sent out according to the `P2PComm::SendJob` settings for the message.
