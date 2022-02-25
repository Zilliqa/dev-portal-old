---
id: core-node-operation
title: General Node Operation
keywords:
  - core
  - node
  - operation
description: Core protocol design - general node operation.
---

---

A Zilliqa node requires the following information during launch:

- Schnorr key pair
- IP address and listening port
- Sync type
- Whether to retrieve persistence from S3

Most other operational parameters are defined in the file `constants.xml`.

During launch, a node will assume its [identity](../basics/basics-zil-nodes.mdx) as follows:

- New, shard, or DS node based on sync type and bootstrap conditions (e.g., `DSInstructionType::SETPRIMARY`)
- DS or shard guard node if `GUARD_MODE=true` and public key is in `ds_guard` or `shard_guard` list in `constants.xml`
- Lookup node if `LOOKUP_NODE_MODE=true`
- Seed node if `LOOKUP_NODE_MODE=true` and `ARCHIVAL_LOOKUP=true`

A node will generally do the following upon startup:

- Start the incoming and outgoing message queue managing threads
- Populate some information (e.g., key and IP, list of guard nodes, list of initial DS committee nodes)
- Set up the persistence (e.g., retrieve data from AWS S3)
- Sync up according to sync type specified, and continue operation from there

Refer to the other sections for an in-depth description of the operation of the various features.
