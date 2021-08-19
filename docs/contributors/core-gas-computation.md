---
id: core-global-gas-price
title: Global Gas Price
keywords:
  - gas
  - price
  - computation
description: Core protocol design - computing global gas price.
---

---

Each miner node's PoW solution comes with a proposed minimum transaction processing gas price that the node is willing to accept. During DS block consensus, the DS committee runs an algorithm to compute the globally acceptable minimum gas price that the entire network will operate on. The DS committee then informs the shards, lookups, and seeds (through `m_gasPrice` in the DS block) about the agreed upon global minimum gas price. The network will accept any transaction that has a gas price larger than or equal to the minimum gas price and reject transactions that don't.

The algorithm to compute the global minimum gas price takes into account:

1. the average `m_gasPrice` used over the last _n_ DS epochs
1. the average of the gas prices proposed by each individual miner for the next DS epoch (in case a price increase is necessary)
1. the trend in network congestion (i.e., the actual consumed gas in the Tx blocks) in the last DS epoch

Essentially, the algorithm decides on the gas price depending on the level of network congestion: if network congestion is high, then the miners
get to have a say on the gas price; otherwise, the minimum gas price should not depend too much on their proposed gas prices.

## Algorithm Inputs

| Global Parameter        | Description                                                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `microblock_gas_limit`  | Gas limit for each micro block                                                                                                                                    |
| `num_shards`            | Number of shards in the network, including the DS committee                                                                                                       |
| `txblock_gas_limit`     | Gas limit for the Tx block (`num_shards x microblock_gas_limit` for simplicity's sake, although the DS committee has a different gas limit value from the shards) |
| `default_min_gas_price` | The lowest value that the gas price can take                                                                                                                      |

| Data from Current DS Epoch   | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `num_nodes`                  | Number of nodes in the network (including the DS committee) |
| `proposed_min_price_node[i]` | Minimum gas price proposed by the _i_ th miner node         |

| Data from Last _n_ DS Epochs  | Description                                                      |
| ----------------------------- | ---------------------------------------------------------------- |
| `min_price_epoch[j]`          | Global minimum gas price value used in the _j_ th DS epoch       |
| `consumed_gas_tx_block[j][k]` | Total consumed gas in the _k_ th Tx block in the _j_ th DS epoch |

## Algorithm Steps

In the following, we describe an algorithm to compute `global_gas_price` for the next DS epoch.

1. We first compute `percentage_full_tx_blocks`, i.e., the number of Tx blocks mined in the last DS epoch for which the total gas consumed is at least 80% of `txblock_gas_limit`. This computation will require checking each `consumed_gas_tx_block[j][k]`.
1. Then, we make the decision on how to set `global_gas_price` according to the table below.

| Percentage of Full Blocks | Interpretation                                                                      | Impact on Gas Price                                           |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| < 10%                     | Blocks are mostly empty; demand is low and hence miners should accept a lower price | **Increase in the gas price** compared to the previous epoch  |
| Between 10% and 70%       | Blocks are mostly filled; demand and supply have met the sweet spot                 | **No change in the gas price** compared to the previous epoch |
| > 70%                     | Blocks are heavily filled and hence there is a sign of high demand                  | **Decrease in the gas price** compared to the previous epoch  |

### Decreasing the Gas Price

1. Discard all `proposed_min_price_node[i]` values
1. Compute the average gas price over the last _n_ DS epochs:
   ```
   average_gas_price_val = mean(min_price_epoch[j-1], ..., min_price_epoch[j-n])
   ```
1. Compute the decreased gas price value:
   ```
   decreased_gas_price_val = 99% of average_gas_price_val
   ```
1. Finally, compute the new `global_gas_price`:
   ```
   global_gas_price = min_price_epoch[j] =
      max(default_min_gas_price, decreased_gas_price_val)
   ```

### Increasing the Gas Price

1. Get the median `proposed_min_price_node[i]` value over all values from the _N_ miners:
   ```
   median_proposed_min_price = median(proposed_min_price_node[1], ..., proposed_min_price_node[N])
   ```
1. Compute the average gas price over the last _n_ DS epochs:
   ```
   average_gas_price_val = mean(min_price_epoch[j-1], ..., min_price_epoch[j-n])
   ```
1. Compute the lower and upper bounds for the increased gas price value:
   ```
   increased_gas_price_val_lower_bound = 100.5% of average_gas_price_val
   increased_gas_price_val_upper_bound = 101.5% of average_gas_price_val
   ```
1. Finally, compute the new `global_gas_price`:
   ```
   global_gas_price = min_price_epoch[j] =
      max{
      	max[
      	     min(median_proposed_min_price, increased_gas_price_val_upper_bound),
      	     increased_gas_price_val_lower_bound
      	   ],
      	default_min_gas_price
      }
   ```
