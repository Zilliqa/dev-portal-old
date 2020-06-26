---
id: core-transaction-checks
title: Transaction Checks
---
## Lookup Level

1. Check if the chain ID matches the chain ID of the network. This is done to prevent replay attacks.
1. Check if the transaction code size is within the limits of maximum code size.
1. Check if the transaction gas price is greater than the minimum gas price required.
1. Check the signature associated with the public key in the transaction.
1. Check if the sender has non-zero balance.
1. If it is a contract creation transaction, check if the transaction gas is greater than the minimum gas for a contract creation transaction.
1. If it is a contract call transaction, check if the transaction gas is greater than the minimum gas for a contract call transaction.
1. Check if the transaction nonce is not less than the sender nonce.

## Shard Level

1. Perform the same first 5 checks done at the lookup level.
1. If shard node, check if the transaction belongs to this shard.
1. Check if the sender has enough balance for the transaction.