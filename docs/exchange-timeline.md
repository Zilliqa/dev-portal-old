---
id: exchange-timeline
title: Token Swap Timeline & Overview
---
---
# NOTICE TO EXCHANGES
> Interim Zillings (“Interim ZILs”) for Zillings (“ZILs”) are not available for offer, sale or transfer to U.S persons (as defined in Regulation S of the U.S. Securities Act of 1933). Please ensure that, at the time of exchange of Interim ZILs for ZILs, each holder of ZILs confirms that it is not a U.S person (as defined in Regulation S of the U.S. Securities Act of 1933).
---

## Overview

The following flowchart illustrates the token swap procedure for exchanges.

![token swap](/dev-portal/img/token_swap_210119_2.png)

The high level overview, from the exchange's perspective, is as follows:

- Decide on a date on which to perform the swap (e.g., 31 May 2019)
- 1 week before the swap date, all **ERC20 ZIL** trading must be frozen
- On 31 May 2019, send all **ERC20 ZIL** to `ZilSwap` contract on **ETHEREUM**
  (address to be provided)
- Once > 30 blocks have passed, inform Zilliqa with your transaction hash, and
  provide **one** address you would like to receive native ZIL at on the
  **Zilliqa** blockchain.
- Native ZIL will be deposited to your chosen address.
- Resume trading with **native ZIL**.

## Timeline

### Bootstrap Phase: Feb - Mar 2019

During this phase, no transactions are being processed on the network. No
action is required from exchanges at this time.

### Token Swap Phase: Apr - Jun 2019

Exchanges should select a date within this range and inform Zilliqa of it at least
**one month** in advance. Thereafter, the exchange should perform the one-time
swap described above **once** on the appointed date.

Exchanges can support **ERC20 ZIL** trading on **ETHEREUM** until **one week**
before the date of the token swap, at which time **all** trading must be
frozen until the exchange has received **native ZIL** on the **Zilliqa**
network.

Thereafter, exchanges should, using the [example application](https://github.com/Zilliqa/dev-portal/tree/master/examples/exchange) as a guide,
support trading of ZIL only on Zilliqa to the exclusion of ERC20 trading.

### Freeze and Burn: July 2019

On 1 July 2019, all ERC20 ZIL sent to `ZilSwap` will be burned, and further
transfers of all remaining ERC20 ZIL (i.e., unswapped ZIL) will be frozen.
This outstanding ERC20 ZIL will not be swappable.
