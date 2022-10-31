---
id: protocol-gas
title: Gas
keywords:
  - Gas
description: EVM Gas
---

---

## EVM Gas

We take the London fork configuration of gas units. We introduced separate gas price for Eth transactions, with gas being cheaper 420 times for EVM transactions.

This is based on the fact that a simple transaction that takes 50 gas though Zil API (simple transfer) takes 21000 gas on EVM and we want to keep gas units for EVM compatible.
