---
id: core-local-storage
title: Local Node Storage
---
## Lookup Nodes

1. Lookups are full nodes. Hence, they store all the data: transactions, blocks, microblocks, state, and state deltas (of previous 10 DS epochs) are stored by lookups.
1. Lookup persistence is also uploaded by a designated lookup node to AWS Simple Storage Service (S3) for synchronization of nodes.

## DS and Shard Nodes

1. These nodes store DS Blocks, Tx Blocks, and the current state.
1. Shard nodes also store processed transactions for the current DS epoch in temporary storage. These are uploaded to S3 for backup.
1. DS nodes also store all the microblocks as they receive them from the shard nodes.