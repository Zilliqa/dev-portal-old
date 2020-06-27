---
id: core-view-change
title: View Change
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
1. Ejection: Placement of all faulty leader(s) to the back of the DS committee. This means those nodes will be prioritized for removal from the DS committee after the next DS consensus.

### Trigger Conditions

1. Node entered `RunConsensusOnDSBlock` but DS block consensus did not complete within the time stipulated
1. Node entered `RunConsensusOnFinalBlock` but final block consensus did not complete within the time stipulated
1. Node entered `RunConsensusOnViewChange` but view change consensus did not complete within the time stipulated

### Setup

1. `[VC Block header]` Removal of candidate leader index as the index will be adjusted after view change and will be obsolete
1. `[VC Block header]` Addition of `vector<pair<PubKey, Peer>>` for tracking all the faulty leaders
1. `[Macro]` Add the related test scenario macro. Refer to test macros section.

### Procedure

1. Consensus stalled during DS consensus or Final block consensus
1. View change condition variable is triggered
1. Enter view change consensus
1. `[Precheck]` Enter the precheck phase. DS nodes contact lookup to ask for new blocks
1. `[Precheck]` If no new blocks (DS and FB) is obtained, proceeds to do view change
1. `[Precheck]` Else, rejoin as a DS node
1. All nodes calculate the new candidate leader index using `CalculateNewLeaderIndex()`
1. `CalculateNewLeaderIndex()` calculates candidate leader index using
    ```text
    H(finalblock or vc block hash, vc counter) % size (or num of DS guard)

    If a previous vc block (for current consensus) exists, use vc block hash. Else use final block hash. If new candidate leader index is current faulty leader, re-calculate using
    H(H(finalblock or vc block hash, vc counter)) repeatedly till an index is not the current faulty leader.
    ```
1. Candidate leader leads the consensus round
1. Backups validate leader announcement
1. View change consensus completed/stalled
a. If stalled, wait for timeout and re-run view change consensus with a new candidate leader
1. Remove faulty leaders (found in Faulty leader vector) from DS Committee
1. Add faulty leaders (found in Faulty leader vector) to the back DS Committee (if not in guard mode)
1. Recalculate `m_consensusMyID` by searching for own node inside the DS committee
1. Set new DS `m_consensusLeaderID`
1. Store VC block to persistent storage
1. If stalled consensus is at final block consensus, send the VC block to the lookup and shard nodes. Lookups and shard nodes update the ds composition respectively
1. If stalled consensus is at DS block consensus, hold and collect VC block(s) to the lookup and shard nodes.
1. Re-run stalled consensus (DS block or final block consensus). If re-run is at final block consensus, gas limit will be adjusted using exponential backoff algorithm.
1. Consensus completed
1. If DS block consensus, concatenate the DS block with VC block(s) and send to lookup and shard nodes
1. Lookup and shard nodes will process VC block(s) linearly followed by DS block