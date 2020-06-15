---
id: core-directory-service
title: Directory service
---
## Operational Details (State Machine)

## DS MIMO

## DS Committee Multiple In Multiple Out (DS MIMO)

### Notice

DS committee ejection has been superseded by [DS Reputation](ds-reputation.md)

### Usage

Allows `n` nodes to join and leave DS committee every DS epoch.

### Setup

1. [DS Block header] Removal of `nonce` and `minerPubKey`
1. [DS Block header] Add `ordered_map<PubKey, Peer>` to represent `n` number of incoming DS members. Ordering based on `Pubkey`
1. [DS Block header] Update `operator==` to reflect changes to DS block header
1. [DS Block header] Change `SIZE` to a member function of DS Block header as calculation of size is no longer static due to `n` number of incoming DS members
1. [Unit test] Update unit test for DS persistence. Use `blocknum` instead of `nonce`
1. [DS Block announcement] Removal of “winner peer” as the information is now embedded inside DS block
1. [Protobuf] Various serialization/deserialization changes to reflect new DS block structure

### Procedure

1. Nodes submit PoWs (For Diff and DS Diff) as per the existing protocol
1. DS leader composes DS Block
   - DS leader determines how many nodes to elect into DS committee by using `min(number of eligible pow submission, NUM_DS_ELECTION)` where `NUM_DS_ELECTION` is a constant in constants.xml
   - Hence, number of incoming nodes ranges from 0 to `NUM_DS_ELECTION`
1. DS leader adds incoming DS members information into the map inside DS Block
1. DS leader removes incoming DS members from `sortedPoWSolns` to ensure the incoming DS members do not get sharded into any of the shards
1. After composing DS Block, the function returns the number of incoming DS members, to be used a later time
1. Now, it is time to eject `n` number of (oldest) DS members from the DS committee and downgrade these to shard members
1. DS leader manually adds the ejected members into `m_allPoWConns` and `sortedPoWSolns`
   - As downgraded members do not perform PoWs, dummy PoW solution is added in its place
   - Dummy PoW solution in this case is calculated using `sha256(node’s pubkey)`
1. Now, it is time to compose the sharding structure. There is no major change to this portion
1. DS Block consensus begins and is successfully completed
1. DS leader and backups do the following
   - DS leader and backups will now do `UpdateDSCommitteeComposition()` first before doing `UpdateMyDSModeAndConsensusId()`. This is to be consistent with what the incoming members will do. Also, having such changes enable much easier calculation of `consensusMyID`. `UpdateMyDSModeAndConsensusId()` was also refactored to make it look cleaner
   - Add `n` number of incoming DS members inside mediator DS committee data structure
   - Pop `n` number of DS members from mediator DS committee data structure
   - Oldest `n` members are decided by `(consensusID + n incoming DS members) >= size of DS committee`. Such nodes change their mode to IDLE
   - Other DS members increment their `consensusMyID` by `n` and update the status to either DS leader or backup (based on existing protocol)
1. DS committee sends the DS Block and sharding structure to all PoW submitters. This message now does not include winner peer as part of the changes highlighted in setup section
1. Incoming DS members receive the DS Block, process it, and update their DS `consensusMyID` based on ordering found in the map in the DS Block. From here onwards, these nodes are part of the DS committee
1. Shard members process the DS Block and update the DS committee composition based on number of incoming DS member(s)

### Other fixes

1. Fixed `operator<` for DS Block header

### Known issues

1. Explorer displays blank information for Miner Public Key and Nonce ([Issue 218](https://github.com/Zilliqa/Issues/issues/218))
1. Explorer not displaying new DS Block information such as incoming DS members and DS difficulty ([Issue 218](https://github.com/Zilliqa/Issues/issues/218))
1. JSON RPC APIs need to be updated ([Issue 218](https://github.com/Zilliqa/Issues/issues/218))
1. Unit test failed when checking cosig of DS Block after retrieval from LevelDB under test case `testBlockStorage`

## DS Reputation

This feature is to evaluate the performance of DS nodes. The underperformed DS nodes will be kicked out of DS committee first instead of the oldest DS nodes. It can push node owners to use better hardware and network for the DS nodes, so can improve the stability and the efficiency of the blockchain consensus protocol.

### Working Mechanism

1. When run DS block consensus, the performance of each DS node will be evaluated based on the rewards they got from last DS epoch until the current DS epoch.
1. At the beginning of each DS epoch, DS leader will call "DetermineByzantineNodes" to find out the underperformed DS nodes based on the criteria set in constants.xml. If found underperformed ds nodes, their pubkeys will be included in DS block announcement and send to all DS backup nodes.
1. A DS backup node receives the DS announcement, it call "VerifyRemovedByzantineNodes" to verify the proposed DS nodes going to remove from DS committee are really unerperformed. If the check pass, it will accept it and continue the consensus protocol. Otherwise, it will refuse to commit to the announcement made by the leader. If more than 1/3 of the nodes in the DS committee does not commit to the announcement, view change will be triggered.
1. After the DS block consensus is done, the selected underperformed DS nodes will be removed from the DS committee and the blockchain network, they need to do PoW again to rejoin the network. The shard nodes which finished DS PoW will join DS committee to replace the removed DS nodes, hence, can keep the size of the DS committee the same.

### Reference

1. [DS Reputation Proposal](https://github.com/nnamon/zilliqa-research/blob/master/ds_reputation/proposal.md)
2. [PR 1587](https://github.com/Zilliqa/Zilliqa/pull/1587)