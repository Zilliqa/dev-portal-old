---
id: core-overview
title: Overview
---
## Network layout

The image below shows all the different components that comprise the mainnet. The subsections that follow provide a brief description of each component.

### Zilliqa network

This is composed of the miner nodes (DS and shard), both Zilliqa-owned (i.e., guard nodes) and otherwise. The mainnet is currently configured to have 600 DS committee nodes and a maximum of three 600-node shards.

### Lookup

Lookup nodes are Zilliqa-owned full nodes, which means they store all of the mined blockchain data - including state deltas, transaction bodies, and microblocks.

The mainnet currently has 5 lookup nodes, each one with a specific purpose:

- `lookup-0`: This lookup uploads incremental data to AWS S3 storage after every transaction epoch. It also uploads its entire persistence data after every 80th transaction epoch.
- `lookup-1`: This lookup acts as a back-up to `lookup-0`, uploading both entire persistence and incremental data to a separate AWS S3 location.
- `lookup-2` / `lookup-3`: These lookups act as upper seeds to `level2lookup` seed nodes. As upper seeds, they process requests from these seed nodes, including transaction creation and data fetching. Transaction creation requests are dispatched by these lookups to the Zilliqa Network nodes.
- `lookup-4`: This lookup acts as an upper seed to `newlookup` seed nodes. It provides similar services as `lookup-2` and `lookup-3`.

JSON queries are generally not routed to these lookups, to avoid overloading them.

### Level2lookup

`Level2lookup` nodes are essentially seed or archival nodes, i.e., full nodes whose primary purpose is the storage of blockchain data, which they receive from the Zilliqa Network through the multipliers. The mainnet API for JSON queries is configured to use these nodes. There are currently 15 `level2lookup` nodes in the mainnet.

Additionally, `level2lookup-10` to `level2lookup-14` are used by miners for syncing until the vacuous epoch, after which these `level2lookup` nodes also provide the signal to start PoW mining.

### Newlookup

`Newlookup` nodes are also seed nodes, and are intended for use by our partner exchanges. Private API endpoints are assigned to these nodes so that exchanges can perform JSON queries. `Newlookup` nodes are scaled up or down in the mainnet according to our needs.

Exchange-hosted seed nodes also fall under the category of `newlookup`.

### Multiplier

A multiplier is a special node whose purpose is to receive data from Zilliqa Network nodes, and then to re-transmit that data to a list of nodes that are registered with it. The mainnet currently has 5 multipliers, with the following assignments normally done:

- `multiplier-0`: Assigned to transmit data to `level2lookup-0` to `level2lookup-4`. Usually also assigned after bootstrap to `newlookup-0` to `newlookup-1`.
- `multiplier-1`: Assigned to transmit data to `level2lookup-5` to `level2lookup-9`. Usually also assigned after bootstrap to `newlookup-2` to `newlookup-4`.
- `multiplier-2`: Assigned to transmit data to `level2lookup-10` to `level2lookup-14`.
- `multiplier-3` / `multiplier-4`: Usually configured after bootstrap to transmit data to exchange-hosted seed nodes.

## Epoch architecture

## General node operation

A Zilliqa node requires the following information during launch:

- Schnorr key pair
- IP address and listening port
- Sync type
- Whether to retrieve persistence from S3

Most other operational parameters are defined in the file `constants.xml`.

During launch, a node will assume its identity as follows:

- New, shard, or DS node based on sync type and bootstrap conditions (e.g., `DSInstructionType::SETPRIMARY`)
- DS or shard guard node if `GUARD_MODE=true` and public key is in `ds_guard` or `shard_guard` list in `constants.xml`
- Lookup node if `LOOKUP_NODE_MODE=true`
- Seed node if `LOOKUP_NODE_MODE=true` and `ARCHIVAL_LOOKUP=true`

A node will generally do the following upon startup:

- Start the incoming and outgoing message queue managing threads
- Populate some information (e.g., key and IP, list of guard nodes, list of initial DS committee nodes)
- Set up the persistence (e.g., retrieve data from S3)
- Sync up according to sync type specified, and continue operation from there

Refer to the other sections for in-depth description of the operation of various features.