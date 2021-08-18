---
id: core-ds-mimo
title: DS MIMO
keywords:
  - core
  - directory
  - service
  - committee
  - membership
description: Core protocol design - DS MIMO.
---

---

:::note
DS committee ejection has now been superseded by [DS Reputation](core-ds-reputation.md).
:::

DS committee membership is maintained using a multiple-in multiple-out (MIMO) setup. This setup allows `n` nodes to join and leave the DS committee at every DS epoch. The steps are:

1. Nodes submit PoWs (for difficulty and DS difficulty)
1. DS leader composes DS Block
   - DS leader determines how many nodes to elect into DS committee by using `min(number of eligible pow submission, NUM_DS_ELECTION)`
   - Hence, number of incoming DS nodes ranges from 0 to `NUM_DS_ELECTION`
1. DS leader adds incoming DS members' information to the map inside DS Block
1. DS leader removes incoming DS members from `sortedPoWSolns` to ensure the incoming DS members do not get added into any of the shards
1. After composing DS Block, `ComputeDSBlockParameters()` returns the number of incoming DS members (to be used a later step)
1. Now, it is time to eject `n` number of (oldest) DS members from the DS committee and downgrade these to shard members
1. DS leader adds the ejected members into `m_allPoWConns` and `sortedPoWSolns`
   - As downgraded members do not perform PoWs, dummy PoW solutions are given to these
   - Dummy PoW solution in this case is calculated using `sha256(node’s pubkey)`
1. Now, it is time to compose the sharding structure. There is no major change to this portion
1. DS Block consensus begins and is successfully completed
1. DS leader and backups do the following
   - DS leader and backups run `UpdateDSCommitteeComposition()` first before doing `UpdateMyDSModeAndConsensusId()`. This is to be consistent with what the incoming members will do. Also, having such changes enable much easier calculation of `consensusMyID`
   - Add `n` number of incoming DS members inside the DS committee data structure in `mediator`
   - Pop `n` number of DS members from the DS committee data structure in `mediator`
   - The oldest `n` members are decided by `(consensusID + n incoming DS members) >= size of DS committee`. These nodes change their mode to `IDLE`
   - Other DS members increment their `consensusMyID` by `n` and update the status to either DS leader or backup
1. DS committee sends the DS Block and sharding structure to all PoW submitters
1. Incoming DS members receive the DS Block, process it, and update their DS `consensusMyID` based on the ordering found in the map in the DS Block. From here onwards, these nodes are part of the DS committee
1. Shard members process the DS Block and update their view of the DS committee
