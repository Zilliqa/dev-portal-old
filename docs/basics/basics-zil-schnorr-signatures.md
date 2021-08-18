---
id: basics-zil-schnorr-signatures
title: Schnorr Signatures
keywords:
  - schnorr signatures
  - zilliqa
description: Schnorr Signatures
---

---

Zilliqa employs Elliptic Curve Based Schnorr Signature Algorithm (EC-Schnorr) as the base signing algorithm. Schnorr allows for multisignatures, is faster than ECDSA, and has a smaller signature size (64 bytes).

The Schnorr algorithm was initially based on section 4.2.3 page 24 of version 1.0 of BSI TR-03111 Elliptic Curve Cryptography (ECC). A more complete discussion of the algorithm is also contained in the Zilliqa [whitepaper](https://docs.zilliqa.com/whitepaper.pdf).

The Schnorr algorithm is used during the consensus protocol, message signing, and generally anywhere where a signature is needed within the protocol. Zilliqa nodes are also identified by their Schnorr public keys, alongside their IP information.
