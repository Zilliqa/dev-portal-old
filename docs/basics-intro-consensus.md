---
id: basics-intro-consensus
title: Consensus mechanism
---

The blockchain network being decentralized has to have a mechanism to agree
upon the next state of system. This is achieved via a _consensus protocol_.


## Types of Consensus Mechanism

Over the last two decades, several new consensus protocols have been developed
and used in the blockchain space. The most common ones are:


### BFT: Byzantine Fault Tolerance Protocol

This is the most classical way to reach consensus which works on the assumption
that the network has at most 1/3 of malicious nodes. The protocol requires each
honest to agree on the state via voting. This involves several rounds of
communication among the nodes.

### PoW: Proof of Work 

Proof-of-Work as a consensus mechanism was pioneered by Bitcoin, where nodes
are required to solve a computational puzzle and the node fastest to find a
solution decides the state of the system.

### PoS: Proof of Stake

In Proof-of-Stake, nodes are required to stake an amount of assets (e.g.,
native currency of the blockchain). Those who stake are allowed to decide on
the next state of the system. By putting a stake, the expectation is that they
will not make detrimental decisions. And in fact, the probability that a
certain node is chosen to propose the next state is proportional to its stake. 
