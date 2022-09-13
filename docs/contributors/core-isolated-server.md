---
id: core-isolated-server
title: Isolated Server
keywords:
  - core
  - isolated
  - server
description: Core protocol design - isolated server.
---

---

## Overview

The Isolated Server is a standalone Zilliqa seed node specifically configured to allow instantaneous blockchain operations (e.g., transaction creation) outside of any network (e.g., Zilliqa Mainnet). This makes it a very useful tool for dApp development and testing.

These are the available documentation on Isolated Server:
- Isolated server design and API list in [ZIP-6](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-6.md)
- Isolated server build instructions in [Zilliqa Github Wiki](https://github.com/Zilliqa/Zilliqa/blob/master/ISOLATED_SERVER_setup.md)
- Isolated server launch instructions in [Ceres documentation](../dev/dev-tools-ceres#isolated-server)

## Implementation Details

The Isolated Server is built as a binary file `isolatedServer` (from source `isolated_server.cpp`) separate from `zilliqa` (from source `main.cpp`). While majority of the underlying source code is shared between the two CPP files, `isolated_server.cpp` is primarily different from `main.cpp` in these ways:
- It instantiates an **IsolatedServer** object. The **IsolatedServer** class inherits from **LookupServer** and thus we are able to reuse most of the JSON-RPC API handler functions defined in **LookupServer**.
- It does **not** instantiate a **Zilliqa** object, and therefore the `isolatedServer` process does not start listening to port 33133 for socket messages. All interactions are done through the **IsolatedServer** JSON-RPC port only (and additionally through the websocket port if enabled).

Apart from these differences, developers just need to take note of the other features supported by the Isolated Server as described in detail in the other available documentation, namely:
- Two ways to artificially produce blocks (i.e., using either automated block time or the `IncreaseBlocknum` API)
- Ability to pre-generate accounts from an input JSON file
- Ability to pre-load existing blockchain data during launch
- Ability to pause the Isolated Server using the `TogglePause` API (which prevents automated block generation and disables `CreateTransaction` API)

:::info
In the Isolated Server there are no properly-formed DS or Tx blocks. While the artificially-produced blocks conform to the Tx block template, all the Tx block fields are not set properly. Only the transaction information is set in the block.
:::