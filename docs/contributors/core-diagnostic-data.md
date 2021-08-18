---
id: core-diagnostic-data
title: Diagnostic Data
keywords:
  - core
  - diagnostic
description: Core protocol design - diagnostic data.
---

---

## Diagnostic Data

We store in LevelDB a limited amount of some operational data about the network that is intended for use when diagnosing any issues with the mainnet.

Globally, the amount of data stored is controlled by the constant `MAX_ENTRIES_FOR_DIAGNOSTIC_DATA`, which is usually set to either 25 or 50.

This is the current data stored for diagnostic purposes:

| LevelDB location            | Data stored                      | Storage timing      | Tool for data extraction |
| --------------------------- | -------------------------------- | ------------------- | ------------------------ |
| persistence/diagnosticNodes | DS and shard peers               | Every vacuous epoch | getnetworkhistory        |
| persistence/diagnosticCoinb | Coinbase values and distribution | Every DS block      | getrewardhistory         |

To use the diagnostic tools:

1. Make sure there is a `persistence` subfolder in your current directory
1. Make sure `persistence/diagnosticNodes` and `persistence/diagnosticCoinb` contain the data you want to extract
1. Run `getnetworkhistory <name of output CSV file>` or `getrewardhistory <name of output CSV file>`
1. Output CSV file will appear in the current directory. Use Excel or LibreOffice Calc to open it
