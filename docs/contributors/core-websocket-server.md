---
id: core-websocket-server
title: WebSocket Server
keywords:
  - core
  - websocket
  - server
description: Core protocol design - websocket server.
---

---

A lookup or seed node has the option (using `ENABLE_WEBSOCKET`) to enable a WebSocket server on port `WEBSOCKET_PORT` (4401 by default). The WebSocket server provides users (e.g., SDK clients) with a subscription-based data querying model as an alternative to polling.

Interacting with the WebSocket server is detailed in our [Application Developers](../dev/dev-tools-websockets.md) section.

The WebSocket server is implemented in [libServer](https://github.com/Zilliqa/Zilliqa/blob/master/src/libServer/WebsocketServer.h) in the Zilliqa core, using the [WebSocket++](https://github.com/zaphoyd/websocketpp) C++ library.
