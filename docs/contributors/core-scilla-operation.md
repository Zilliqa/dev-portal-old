---
id: core-scilla-operation
title: Scilla Operation
keywords:
  - core
  - account
description: Core protocol design - Scilla operation.
---

---

## Overview

A Zilliqa miner node invokes the **Scilla interpreter** (aka `scilla-runner`) on every contract-related transaction processed.

In early releases of Zilliqa, the `scilla-runner` program was launched on every transaction, incurring the overhead cost associated with each launch.

To avoid this overhead, a perpetually-running **Scilla server** (aka `scilla-server`) program was added. The Zilliqa node sends `scilla-runner` requests (in the same format as in pre-server releases) to the `scilla-server` through socket "check" or "run" messages. The `scilla-server` then takes care of execution of the request and sends back the execution output result through the same socket connection.

Relevant documentation on operating the Scilla interpreter and server can be found here:
- Scilla interpreter [Read the Docs](https://scilla.readthedocs.io/en/latest/interface.html) page
- Scilla server [Github Wiki](https://github.com/Zilliqa/scilla/wiki/Scilla-Server-API) page

## Class Structure

In the diagram below, transaction processing is handled by `UpdateAccounts()` in `AccountStoreSC` through the `AccountStoreTemp` instance. `AccountStoreSC` also contains most of the internal functions related to interacting with the Scilla server.

![image01](/img/contributors/core/scilla-operation/image01.png)

## Scilla Operation Steps

The diagram below details the steps related to Scilla server execution for both contract deployment and contract call transactions. Note the following:
1. A contract deployment requires running initial checks on the contract using the Scilla server before the actual deployment call.
1. The first steps in the diagram involve preparation of the input files needed by the Scilla interpreter.
   1. For contract deployment, we may actually be deploying either a contract or a library.
   1. For contract call, an additional file (`input_message.json`) includes the information required to invoke the transition in the contract.
1. The Scilla server (for each Scilla version) is only launched once, i.e., the first time a transaction for that particular Scilla version is processed.
1. After file preparation and server launch, the "check" or "call" method is invoked on the server with the interpreter parameters specific to the invocation. The parameters are different for contract deployment check, contract deployment call, and contract call.
1. After interpreter invocation, the output from the server is evaluated. This is in JSON format, and different members are expected for contract deployment check, contract deployment call, and contract call.
1. Finally, in the case of contract call, the output may include one or more messages. Each message is basically a chain call and will require repeating all the steps starting from input files preparation. Of course, the context (e.g., the source and destination account) will be different for each call in the chain.

![image02](/img/contributors/core/scilla-operation/image02.png)
