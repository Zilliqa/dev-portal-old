---
id: core-view-change
title: View Change
keywords:
  - core
  - view
  - change
description: Core protocol design - view change.
---

---

In the event of a network stall, the core protocol falls back to a view change. This process occurs within the DS committee, and involves the selection of a new DS committee leader to pick the blockchain's progress back up at the point just before the stall.

The general steps are as follows:

1. The DS committee consensus stalls for some reason
1. The network enters into a view change state
1. A candidate leader from the DS committee leads the view change consensus using PBFT
1. The DS backups validate the candidate leader's announcement
1. View change consensus is reached
1. The DS committee resumes the stalled consensus

### Terminology

1. Candidate leader: The proposed leader who will lead the view change consensus round
1. Faulty leader(s): The current leader prior to the stall, and any candidate leaders who could not successfully complete the view change consensus
1. Ejection: Placement of all faulty leader(s) to the back of the DS committee. This means those nodes will be prioritized for removal from the DS committee after the next DS consensus

### Trigger Conditions

These are the conditions that can cause a view change to occur:

1. Node entered `RunConsensusOnDSBlock()` but DS block consensus did not complete within the time stipulated
1. Node entered `RunConsensusOnFinalBlock()` but Tx block consensus did not complete within the time stipulated
1. Node entered `RunConsensusOnViewChange()` but VC block consensus did not complete within the time stipulated

### Procedure

1. Any trigger condition is satisfied and view change begins
1. DS nodes perform view change pre-check:
   1. Contact lookup to ask for new blocks (DS or Tx)
   1. If no new block is obtained, proceed with view change
   1. If a new block is obtained, rejoin as a DS node
1. All nodes calculate the new candidate leader index using `CalculateNewLeaderIndex()`, which uses this algorithm

   ```text
   H(finalblock or vc block hash, vc counter) % size (or num of DS guard)

   If a previous vc block (for current consensus) exists, use vc block hash. Else use Tx block hash. If new candidate leader index is current faulty leader, re-calculate using
   H(H(finalblock or vc block hash, vc counter)) repeatedly till an index is not the current faulty leader.
   ```

1. Candidate leader and backups proceed with view change consensus until completion or stall
   1. If stalled, wait for timeout and re-run view change consensus with a new candidate leader
1. All nodes remove faulty leaders (found in the VC block header's list) from DS Committee
1. All nodes add faulty leaders to the back of DS Committee (unless those are [DS guards](core-guard-mode.mdx))
1. All nodes recalculate `m_consensusMyID` and `m_consensusLeaderID` according to the updated DS committee
1. All nodes store the VC block to persistent storage
1. If stalled consensus is at Tx block consensus:
   1. VC block(s) is sent to the lookup and shard nodes
   1. Lookups and shard nodes use the VC block(s) to update the DS committee composition similarly
1. If stalled consensus is at DS block consensus:
   1. DS nodes cache all VC block(s) generated during the view change(s)
1. All nodes re-run the stalled consensus (DS block or Tx block consensus) prior to view change
   1. If the re-run consensus is for Tx block, the gas limit will be adjusted using exponential backoff algorithm
1. Consensus runs to completion (or, fails and triggers another stall)
1. If completed consensus is for DS block:
   1. DS nodes append the cached VC block(s) to the newly generated DS block
   1. DS block (together with the VC block(s)) is sent to the lookup and shard nodes
   1. Lookups and shard nodes use the VC block(s) to update the DS committee composition similarly
