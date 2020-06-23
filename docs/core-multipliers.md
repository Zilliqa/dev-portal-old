---
id: core-multipliers
title: Multipliers
---
This section describes the purpose of multiplier and some implementation details

### Purpose

- Node types `newlookup` and `level2lookup`  need new blocks data every time new txBlock is mined in order to be synced with progressing network.
- This new block data include `DSBlock`, `FinalBlock`, `Microblocks` and `Transactions` for new epoch.
- Multiplier plays a role of receiving above messages from network and forwarding them to `newlookup` and/or `level2lookup`.

### Brief

- Mainnet runs with `5` multiplier where each multiplier is configured to forward the messages to those nodes `<IP:PORT>` registered with them.
- Every multiplier say `multiplier-0` has corresponding `multiplier-0-downstreams.txt` which contains list of `<IP:PORT>` of nodes receiving forwarded messages.
- All `level2lookup` nodes are automatically registered with multiplier during bootstrap.
- All newly launched zilliqa controlled `newlookup` and exchanges `seed` nodes needs to be registered with any of the multipliers.
- Network nodes are aware of multiplier's `IP:PORT` from constants.xml since multipliers are always launced during bootstrap.

### Details

- Multiplier is a simple go program which basically listens at a particular port for incoming messages and forwards the message to forwarding list.
- It checks for any update in `multiplier-x-downstreams.txt` for new or deleted `<IP:PORT>` periodically. This enables us to add new seed nodes anytime.
- It uses hashes to ignore duplicate messsages from being received and forwarded.
- It retries sending message to destination `<IP:PORT>` for error `i/o timeout` which could happen due to network glitches on either ends.
