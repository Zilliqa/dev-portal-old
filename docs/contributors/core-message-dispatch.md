---
id: core-message-dispatch
title: Message Dispatch and Processing
keywords:
  - core
  - message
  - dispatch
  - processing
description: Core protocol design - message dispatch and processing.
---

---

In `src/cmd/main.cpp`, we assign `Zilliqa::Dispatch` as the dispatcher inside `P2PComm::StartMessagePump`. Every message that is read from a socket by `P2PComm` then gets sent to `Zilliqa::Dispatch`.

When Zilliqa starts to process a message, it will call `Zilliqa::ProcessMessage`. The first byte of any message defines the **message type**.

:::note
The “first byte” here refers to the payload part of a socket message. At the `P2PComm` level, each socket message consists of a predefined header plus the payload.
:::

Depending on the type, `Zilliqa::ProcessMessage` will forward the message to the appropriate handler for it. The list of message types can be found in `enum MessageType` inside `src/common/Messages.h`.

Any class that inherits from `Executable` will be a message handler. For example, type `0x01` means `DIRECTORY`, and this message will be handled by `libDirectoryService`. If you go into `libDirectoryService`, you will find a function `DirectoryService::Execute`.

All classes that inherit from `Executable` will first check the second byte in the message, which defines the **instruction type**. The list of instruction types can be found in `src/common/Messages.h`.

From there, `Execute()` will further forward the message to a private function inside the class, and these functions are all named `ProcessXXX`.
