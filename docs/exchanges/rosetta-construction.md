---
id: rosetta-construction
title: Introduction
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - API
  - contruction
description: Introduction
---

---

## Construction

Construction API enables developers to write to a blockchain (i.e. construct transactions) in a standard format. Implementations are stateless and can operate entirely offline, and support detached key generation and signing.

### Construction Flow

The construction flow is in this sequence:

1. [/construction/derive](rosetta-construction-derive.md)
2. [/construction/preprocess](rosetta-construction-preprocess.md)
3. [/construction/metadata](rosetta-construction-metadata.md)
4. [/construction/payloads](rosetta-construction-payload.md)
5. [/construction/parse](rosetta-construction-parse.md)
6. [/construction/combine](rosetta-construction-combine.md)
7. /construction/parse (to confirm correctness)
8. [/construction/hash](rosetta-construction-hash.md)
9. [/construction/submit](rosetta-construction-hash.md)

### Flow of Operations

```
                               Caller (i.e. Coinbase)                + Construction API Implementation
                              +-------------------------------------------------------------------------------------------+
                                                                     |
                               Derive Address   +----------------------------> /construction/derive
                               from Public Key                       |
                                                                     |
                             X                                       |
                             X Create Metadata Request +---------------------> /construction/preprocess
                             X (array of operations)                 |                    +
    Get metadata needed      X                                       |                    |
    to construct transaction X            +-----------------------------------------------+
                             X            v                          |
                             X Fetch Online Metadata +-----------------------> /construction/metadata (online)
                             X                                       |
                                                                     |
                             X                                       |
                             X Construct Payloads to Sign +------------------> /construction/payloads
                             X (array of operations)                 |                   +
                             X                                       |                   |
 Create unsigned transaction X          +------------------------------------------------+
                             X          v                            |
                             X Parse Unsigned Transaction +------------------> /construction/parse
                             X to Confirm Correctness                |
                             X                                       |
                                                                     |
                             X                                       |
                             X Sign Payload(s) +-----------------------------> /construction/combine
                             X (using caller's own detached signer)  |                 +
                             X                                       |                 |
   Create signed transaction X         +-----------------------------------------------+
                             X         v                             |
                             X Parse Signed Transaction +--------------------> /construction/parse
                             X to Confirm Correctness                |
                             X                                       |
                                                                     |
                             X                                       |
                             X Get hash of signed transaction +--------------> /construction/hash
Broadcast Signed Transaction X to monitor status                     |
                             X                                       |
                             X Submit Transaction +--------------------------> /construction/submit (online)
                             X                                       |
                                                                     +
```
