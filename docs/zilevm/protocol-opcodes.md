---
id: protocol-opcodes
title: Opcodes
keywords:
  - opcodes
description: ZILEVM Opcodes
---

---

## Opcodes

| OP code    | Description                                             |
|------------|---------------------------------------------------------|
| COINBASE   | Returns 0 (this opcode returns the address that gets the current block reward, since reward is split among multiple participating parties in Zilliqa, we cannot get the definite response, hence we return zero. |
| CHAINID    | Returns 0x8000 + Zilliqa ChainID. We cannot just reuse Zilliqa ChainID directly, as “1” means mainnet, and in the EVM APIs that means Ethereum Mainnet. So we move all our CHAINID space into the area of 0x8000. |
| BASEFEE    |  Returns the current ZIL gas price of 0.02 ZIL |
| DIFFICULTY |  Return current difficulty |

COINBASE - returns 0 (this opcode returns the address that gets the current block reward, since reward is split among multiple participating parties in Zilliqa, we cannot get the definite response, hence we return zero.

CHAINID - return 0x8000 + Zilliqa ChainID. We cannot just reuse Zilliqa ChainID directly, as “1” means mainnet, and in the EVM APIs that means Ethereum Mainnet. So we move all our CHAINID space into the area of 0x8000.

BASEFEE - is equal to the gas price and is 0.02 ZIL

DIFFICULTY - return current Difficulty, not DS Difficulty (see this guide)
