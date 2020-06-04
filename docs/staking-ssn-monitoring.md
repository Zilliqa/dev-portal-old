---
id: staking-ssn-monitoring
title: Monitoring
---
# Seed node status page
We provide a webapp, Zilliqa Staking Viewer, to track all available seed node operators. You can access it at
https://stg-staking-viewer.zilliqa.com/

# How to resync node
The node might go out of sync if it fails to receive new blocks from the network. In this case, the node would ideally automatically sync without any manual intervention.

However, if the node is unable to resync on its own, it will need to be launched again in a fresh mode (i.e. clean start). Please refer to the section  [Preparing the node](staking-getting-started#preparing-the-node) at Getting started page

> **⚠️** Make sure to back up your keys.

## Upgrading the seed node

### Docker

Please refer to the section  [Preparing the node for docker build](staking-getting-started#launching-the-node-using-docker).

### Native build

Please refer to the section  [Preparing the node for native build](staking-getting-started#launching-the-node-using-docker).