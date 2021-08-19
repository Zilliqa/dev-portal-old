---
id: core-ds-reputation
title: DS Reputation
keywords:
  - core
  - directory
  - service
  - committee
  - reputation
description: Core protocol design - DS reputation.
---

---

The integration of the DS reputation within DS MIMO enables identification and removal of underperforming DS nodes instead of simply the oldest DS nodes. This encourages node owners to use better hardware for the DS nodes, improving the stability and efficiency of the network, particularly during consensus protocol.

The steps are:

1. During DS Block consensus, the performance of each DS node is evaluated based on the rewards they received in the last DS epoch
1. DS leader calls `DetermineByzantineNodes()` to find out which DS nodes underperformed (according to the criteria set in `constants.xml`). The public keys of these underperforming nodes are included in DS Block consensus announcement
1. DS backup nodes call `VerifyRemovedByzantineNodes` when processing the announcement to verify that the DS nodes proposed for removal from the committee are really underperforming. Verification must pass for consensus to succeed; a view change will be triggered otherwise
1. After DS Block consensus, the underperforming DS nodes are removed from the DS committee and the blockchain network. They will need to do PoW again to rejoin the network

## References

1. [DS Reputation Proposal](https://github.com/nnamon/zilliqa-research/blob/master/ds_reputation/proposal.md)
2. [PR 1587](https://github.com/Zilliqa/Zilliqa/pull/1587)
