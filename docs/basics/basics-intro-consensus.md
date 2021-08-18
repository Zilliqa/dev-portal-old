---
id: basics-intro-consensus
title: Consensus mechanism
keywords:
  - intro
  - conesnsus
  - mechanism
  - pbft
  - proof of work
  - proof of stake
description: Types of Blockchain consensus mechanisms
---

---

The blockchain network being decentralized has to have a mechanism to agree
upon the next state of system. This is achieved via a _consensus protocol_.

## Types of Consensus Mechanism

Over the last two decades, several new consensus protocols have been developed
and used in the blockchain space. The most common ones are:

### BFT: Byzantine Fault Tolerance Protocol

This is the most classical way to reach consensus which works on the assumption
that the network has at most 1/3 of malicious nodes. The protocol requires each
honest node to agree on the state via voting. This involves several rounds of
communication among the nodes.

### Nakamoto Consensus

Nakamoto consensus was pioneered by Bitcoin. It uses proof-of-work and
longest-chain-win rule to reach consensus among all honest nodes. Using
proof-of-work, each node is required to solve a computational puzzle and the node
fastest to find a solution decides the next state of the system. In the
longest-chain-win rule, the node will adopt the longest chain and extend it
with new valid block. A block in the blockchain is deemed to be committed once
there is a sufficient number of block mined after the block.

### PoS: Proof of Stake

In Proof-of-Stake, nodes are required to stake an amount of assets (e.g.,
native currency of the blockchain). Those who stake are allowed to decide on
the next state of the system. By putting a stake, the expectation is that they
will not make detrimental decisions. And in fact, the probability that a
certain node is chosen to propose the next state is proportional to its stake.
