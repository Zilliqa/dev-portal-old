---
id: core-consensus
title: Consensus
---
## Consensus Protocol

### Overview

This document describes how the consensus protocol (as initially designed in the Zilliqa [whitepaper](https://docs.zilliqa.com/whitepaper.pdf)) is implemented and used in the core Zilliqa code.
For a more theoretical description of the consensus protocol itself, refer to the whitepaper.

### Usage in the Protocol

Consensus is used in the following stages of the protocol:

| Data                     | Members      | Timing                                 |
|--------------------------|--------------|----------------------------------------|
| DS Block                 | DS committee | After PoW window                       |
| Shard Microblock         | Shard nodes  | After Tx processing by the shard nodes |
| DS Microblock + Tx Block | DS committee | After Tx processing by the DS nodes    |
| VC Block                 | DS committee | After DS nodes enter into view change  |

### State Machine

The consensus protocol is implemented across two classes: `ConsensusLeader` and `ConsensusBackup`. The diagram below shows the state transitions for both leader and backup.

![image01](../assets/core/features/consensus-protocol/image01.jpg)

#### Initial State

The `INITIAL` state is usually when the object for each class is first created (e.g., see `DirectoryService::RunConsensusOnDSBlockWhenDSPrimary`).

#### Announcement and Commitment Phase

After instantiation, the node running the `ConsensusLeader` kicks off the sequence by sending out the announcement message. The announcement includes the data that all the peers need to reach consensus on. Each node running a `ConsensusBackup` then processes the announcement message, which also means running the validator function relevant to the type of consensus (e.g., `DirectoryService::DSBlockValidator`).

If the announcement is accepted, a commit is sent back to the leader. The leader stays in this phase until the required number of commits (2/3) is received from the backups (note that the leader itself is part of the 2/3+1 requirement laid out in the whitepaper).

#### Challenge and Response Phase

After receiving the required number of commits, the leader generates the challenge, which is a function of the aggregated commits and public keys of everyone who committed (including the leader itself). The challenge is then sent out to the committed backups, who send back a response message afterwards.

#### Collective Signature Phase

Once all responses have been collected, the leader generates the collective signature, and sends out both the collective signature and the response map (which indicates who participated in both commit and response phases) to all peers. With this information, the backups can then verify the collective signature, and this effectively concludes the round of consensus.

### Two-Round Consensus

In actuality the state machine above represents just half of the PBFT consensus sequence. A full consensus requires running through the above phases in two rounds.

There are a couple of differences between rounds. First, the announcement triggers the start of round 1. For round 2, the collective signature message serves as the trigger. Second, the message to co-sign in round 1 is the data that the user intends to be verified (e.g., DS Block). For round 2, the message to co-sign is that same data plus the collective signature and response map from round 1.

### Consensus Subsets

The consensus protocol was initially designed as a single linear sequence from `INITIAL` to `DONE`.  However, due to unstable interaction between Zilliqa-hosted nodes and community nodes, we frequently observed stalled consensuses during the mainnet operation. This inevitably led to one or more view changes, in effect slowing down the progress of the mainnet.

To address this situation, we changed the consensus implementation to support multiple concurrently running consensuses across different subsets of peers. This is how it works:

  > **Note**: For the mainnet we have set the number of subsets to 2 at the DS level and just 1 at the shard level. The steps below assume this count. Other counts are theoretically supported by the code but may not have been fully tested at this point.

1. Instead of immediately progressing after receiving the required 2/3 commits, the leader now waits for a maximum duration of `COMMIT_WINDOW_IN_SECONDS` seconds to receive commits. It cuts the waiting time short only if the percentage of peers specified by `COMMIT_TOLERANCE_PERCENT` has already committed. This is done for both rounds of consensus.

1. Once the leader has stopped accepting commits, it generates two subsets out of the committed peers (both subsets are of size 2/3+1 and includes the leader):
   - Subset 0 = If consensus is within DS committee, prioritize DS guards, and fill in the remaining slots with other DS nodes. If consensus is within shard, nodes are randomly selected, with no bias towards guards.
   - Subset 1 = Nodes are randomly selected, with no bias towards guards (regardless of whether consensus is done at DS or shard level).

1. The leader creates two challenges and sends both to all backups who are part of at least one of the two subsets.
1. The backups validate both challenges and send back responses to both.
1. The leader goes through both responses from each backup and just picks out the ones for which the backup is part of the subset(s).
1. The consensus round concludes once one of the two subsets has reached completion.
1. The subsets are generated once again from the list of commits in the second round of consensus, and the same processing steps are followed thereafter.

### Operational Parameters

These are the relevant constants that affect the way our consensus operates:

- `BROADCAST_GOSSIP_MODE` - When this is `true`, `ConsensusLeader` sends the announcement and collective signature messages using gossip. Otherwise, the messages are sent using multicast.

- `COMMIT_TOLERANCE_PERCENT` - This specifies the percentage of the peers that are needed to send a commit to cut the waiting time (specified by `COMMIT_WINDOW_IN_SECONDS`) prematurely, if the subset count is more than 1.

- `COMMIT_WINDOW_IN_SECONDS` - This specifies the maximum duration the leader will wait to receive commits, if the subset count is more than 1.

- `CONSENSUS_MSG_ORDER_BLOCK_WINDOW` - This is used at the `DirectoryService` or `Node` level to indicate the number of seconds the node will delay processing a particular consensus message that is not applicable to the current state of the consensus object (based on `ConsensusCommon::CanProcessMessage()`).

- `CONSENSUS_OBJECT_TIMEOUT` - This is used at the `DirectoryService` or `Node` level to indicate the number of seconds the node will delay processing a consensus message that is not applicable to the current state of the `DirectoryService` or `Node` instance (e.g., a DS node may have received a view change consensus message while it is still not in the `VIEWCHANGE_CONSENSUS` state).

- `DS_NUM_CONSENSUS_SUBSETS` - This indicates the number of consensus subsets to be used for consensus within the DS committee.

- `SHARD_NUM_CONSENSUS_SUBSETS` - This indicates the number of consensus subsets to be used for consensus within the shard.

## Schnorr Algorithm

### Overview

Zilliqa employs Elliptic Curve Based Schnorr Signature Algorithm (EC-Schnorr) as the base signing algorithm. Schnorr allows for [multisignatures](#multisignatures), is faster than ECDSA, and has a smaller signature size (64 bytes).

Refer to the Zilliqa [whitepaper](https://docs.zilliqa.com/whitepaper.pdf) for a more complete discussion of the algorithm.

### Core Usage and Implementation

The Schnorr algorithm is used during the consensus protocol, message signing, and generally anywhere where a signature is needed both for authenticity and for optionally storing alongside the signed data (e.g., DS or Tx block, Tx body, etc.).

Peers are also identified by their Schnorr public keys, alongside their IP information.

The Schnorr algorithm is implemented in `libCrypto` and is broken down into these cryptographic components: `PubKey`, `PrivKey`, and `Signature`. The `Schnorr` class provides the `Sign` and `Verify` functions, as well as `GenKeyPair` for key generation.

The signing procedure is (as noted in `Schnorr::Sign`):

```console
1. Generate a random k from [1, ..., order-1]
2. Compute the commitment Q = kG, where G is the base point
3. Compute the challenge r = H(Q, kpub, m)
4. If r = 0 mod(order), goto 1
5. Compute s = k - r*kpriv mod(order)
6. If s = 0 goto 1
7. Signature on m is (r, s)
```

The verification procedure is (as noted in `Schnorr::Verify`):

```console
1. Check if r,s is in [1, ..., order-1]
2. Compute Q = sG + r*kpub
3. If Q = O (the neutral point), return false
4. r' = H(Q, kpub, m)
5. return r' == r
```

### Notes

The Schnorr algorithm was initially based on section 4.2.3 page 24 of version 1.0 of [BSI TR-03111 Elliptic Curve Cryptography (ECC)](https://www.bsi.bund.de/EN/Publications/TechnicalGuidelines/TR03111/BSITR03111.html).

## Multisignatures

### Overview

The end result of any consensus round is basically the generation of an EC-Schnorr signature that is the product of co-signing the consensus data by 2/3+1 of the participants.

This document is a brief description of how multisignatures are implemented and used in the Zilliqa core. For more information on how multisignatures work, refer to the Zilliqa [whitepaper](https://docs.zilliqa.com/whitepaper.pdf).

### Generating the Multisignature within Consensus

1. Leader sends out announcement message, which includes the data to co-sign
1. Backup generates a commit point and commit secret, and sends back the commit point
1. Leader aggregates all the received commit points
1. Leader generates and sends out `challenge = function(aggregated commit points, aggregated public keys, data to co-sign)`
1. Backup re-generates the same challenge on its end and verifies equality
1. Backup generates and sends back `response = function(commit secret, challenge, private key)`
1. Leader verifies each response as `function(response, challenge, public key, commit point)`
1. Leader generates and sends out `signature = function(challenge, aggregated responses)`
1. Both leader and backups verify signature as `function(signature, data to co-sign, aggregated public keys)`

### Implementation Details

The cryptographic components needed for multisignatures are implemented across `Schnorr.h` and `MultiSig.h`.

One can think of `Schnorr::Sign` as being the unilateral equivalent of the co-signing that is achieved through the aggregation of each participant's `CommitPoint`, `Response`, and `PubKey` components, as well as the indirect use of each participant's `PrivKey` and `CommitSecret` in the process of generating those components.

In fact, you will notice that `MultiSig::MultiSigVerify` is implemented almost the same as `Schnorr::Verify` (with the exception of an added byte for domain separated hash function). This shows that while co-signing is done through some aggregation magic, in the end a multisignature is still a Schnorr signature and can be verified as such.

### Domain-separated Hash Functions

In December 2018, [PR 1097](https://github.com/Zilliqa/Zilliqa/pull/1097) was introduced to address an issue raised during a security audit. The main idea was to make these changes:

```console
1. Leader sends announcement -> no change
2. Backup receives announcement -> no change
3. Backup sends commit + H1(commit)
4. Leader receives commit + checks H1(commit)
5. Leader sends challenge using H2(challenge inputs)
6. Backup receives challenge + checks H2(challenge inputs)
7. Backup sends response -> no change
8. Leader receives response -> no change
9. Leader sends collective sig -> no change

where:
H1(x) = SHA256(0x01||x)
H2(x) = SHA256(0x11||x)
```

This diagram illustrates the original multisignature scheme during consensus:

![image01](../assets/core/features/multisignatures/image01.png)

This diagram illustrates the modified scheme based on the auditor's proposal:

![image02](../assets/core/features/multisignatures/image02.png)

After these changes, we now identify three domains during the consensus protocol. The "separation" per se refers to the integration of unique byte values into hash operations across different points of the consensus, to effectively carve out domains during the consensus.

1. The first domain-separated hash function basically refers to the node submitting its PoW and its public key, or what we now refer to as the Proof-of-Possession (PoP) phase. While no behavioral change is done in the code for the PoW stage, we created a wrapper function `MultiSig::SignKey` to emphasize that by signing the public key, the node is effectively presenting proof of possessing the private key.

1. The second domain-separated hash function refers to the backup having to send the hash of the commit point alongside the commit point itself. To achieve this, the new data structure `CommitPointHash` was added to `MultiSig.h`.

1. The third domain-separated hash function refers to the leader introducing another byte (`0x11`) into the hash operation during the generation of the challenge value.