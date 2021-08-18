---
id: basics-zil-contract
title: Smart Contract Layer
keywords:
  - scilla
  - smart contract
  - pbft
  - zilliqa
  - scilla interpreter
description: Zilliqa Smart Contracts
---

---

Zilliqa comes with its own smart contract language called Scilla. Scilla short
for Smart Contract Intermediate Level Language is designed as a principled
language with smart contract safety in mind.

Scilla imposes a structure on smart contracts that makes applications less
vulnerable to attacks by eliminating certain known vulnerabilities directly at
the language-level. Furthermore, the principled structure of Scilla makes
applications inherently more secure and amenable to formal verification.

Some of the design choices in Scilla include:

1. **Separation Between Computation and Communication:** Contracts in Scilla
   are structured as communicating automata: every in-contract computation
   (e.g., changing its balance or computing a value of a function) is implemented
   as a standalone, atomic transition, i.e., without involving any other parties.
   Whenever such involvement is required (e.g., for transferring control to
   another party), a transition would end, with an explicit communication, by
   means of sending and receiving messages.

2. **Separation Between Effectful and Pure Computations:** Any in-contract
   computation happening within a transition has to terminate, and have a
   predictable effect on the state of the contract and the execution. In order to
   achieve this, Scilla draws inspiration from functional programming with effects
   in distinguishing between pure expressions (e.g., expressions with primitive
   data types and maps), impure local state manipulations (i.e., reading/writing
   into contract fields), and blockchain reflection (e.g., reading current block
   number).

## Scilla Interpreter

Scilla currently comes with an [interpreter](https://github.com/zilliqa/scilla)
written in OCaml. The interpreter provides a calling interface that enables
users to invoke transitions with specified inputs and obtain outputs. Execution
of a transition with supplied inputs will result in a set of outputs, and a
change in the smart contract mutable state.

More details on the interpreter are available in [Scilla
Docs](https://scilla.readthedocs.io/en/latest/interface.html).
