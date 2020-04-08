---
id: staking-getting-started
title: Getting started	
---

# IP whitelisting and API servicing

It is necessary for the staked seed node to be whitelisted by Zilliqa in phase 0 in order to receive data broadcasts about the blockchain and its state. This requires a static public IP address with minimal the following inbound and outbound port open.


| Type     | Default | Purpose                                        |
|----------|-------- | ---------------------------------------------- |
| Inbound  | 33133   | Protocol level port for receiving network data |
| Outbound | 4201    | API service                                    |
| Outbound | 4401    | Websocket                                      |
| Outbound | 4501    | Staking API service                            |

# Preparing the node

Launching a seed node for staking is similar to launching a normal seed node, with some additional configuration steps.

In this guide, we will demostrate on how to setup the seed node via
1. [Docker](#launching-the-node-using-docker)
2. [Native build](#launching-the-node-using-native-build)

You can go for either one of the option above.

## Launching the node using Docker
We highly recommend using [Docker](https://docker.com/) to set up a seed node, as we provide a tested, production-ready image for your use. If you have not yet set up docker, please follow the instructions on the [official documentation](https://docs.docker.com/install/).

Once you have set up Docker, you may proceed to download and uncompress the configuration tarball for the mainnet:

<!--DOCUSAURUS_CODE_TABS-->
<!--Testnet-->
```bash
# create a directory
$ mkdir my_seed && cd my_seed

# download and extract the seed node configuration files
$ wget https://testnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz
```

<!--Mainnet (not yet available)-->
```bash
# create a directory
$ mkdir my_seed && cd my_seed

# download and extract the seed node configuration files
$ wget https://mainnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz
```
<!--END_DOCUSAURUS_CODE_TABS-->


The seed node requires some configuring before it can successfully join the network and be used for staking. Most configuration is contained in constants.xml, which should be in the directory we extracted seed-configuration.tar.gz to. Minimally, the following changes are required:
- Change the value of `ENABLE_STAKING_RPC` to `true`
- **optional:** Change the value of `SEED_PORT` to `33133` (default), or a port of your choice. If you do not select `33133`, be sure to note this down for the subsequent whitelisting step.

> **Note:** If you have used a port other than 33133, please notify us immediately so that we can adjust our whitelisted port for you.

Finally, launch the seed node:
```
$ ./launch_docker.sh
```
> **Note:** A seed node needs a key pair to communicate with other nodes in the network. launch_docker.sh will automatically generate and use a key pair stored in the file mykey.txt in the same folder.

>  **⚠️** We highly recommend to use another keypair for depositing stake, withdrawing stake and withdrawing reward.


## Launching the node using native build

> **Note:** This approach has only been tested on `Ubuntu 16.04.6 LTS` and involves compiling and building the `C++` code base from scratch. We strongly recommend you consider launching the node using the Docker steps detailed in the previous section.

If you cannot or do not wish to use Docker, you may also build the Zilliqa binary from source and run it as such.

First, clone the Zilliqa repository:
```bash
# clone Zilliqa source files
$ git clone https://github.com/Zilliqa/Zilliqa.git && cd Zilliqa && git checkout <<release tag>> && cd Zilliqa
```

Install system dependencies:
```bash
$ sudo apt-get update
$ sudo apt-get install git libboost-system-dev libboost-filesystem-dev libboost-test-dev libssl-dev libleveldb-dev libjsoncpp-dev libsnappy-dev cmake libmicrohttpd-dev libjsonrpccpp-dev build-essential pkg-config libevent-dev libminiupnpc-dev libcurl4-openssl-dev libboost-program-options-dev libboost-python-dev python3-dev python3-setuptools python3-pip gawk
```
Build the staked seed node:
```bash
# Build the binary. This may take a while.
$ ./build.sh
```

The build should exit with no errors. Once it is complete, download and uncompress the configuration tarball:

<!--DOCUSAURUS_CODE_TABS-->
<!--Testnet -->
```bash
# create a directory
$ mkdir my_seed && cd my_seed

# download and extract the seed node configuration files
$ wget https://testnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz
```

<!--Mainnet (not yet available)-->
```bash
# create a directory
$ mkdir my_seed && cd my_seed

# download and extract the seed node configuration files
$ wget https://mainnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz
```
<!--END_DOCUSAURUS_CODE_TABS-->


The staked seed node requires some configuring before it can successfully join the network and be used for staking. Most configuration is contained in `constants.xml`, which should be in the directory we extracted `configuration.tar.gz` to. Minimally, the following changes are required:
- Change the value of `ENABLE_STAKING_RPC` to `true`
- **Optional:** Change the value of `SEED_PORT` to `33133` (default), or a port of your choice. If you do not select `33133`, be sure to note this down for the subsequent whitelisting step.

>  **Note:** If you have use a port other than port 33133, please notify us immediately so that we can adjust our whitelisted port for you

Finally, launch the seed node:
```bash
$ ./launch.sh
```

> **Note:** A seed node needs a key pair to communicate with other nodes in the network. launch.sh will automatically generate and use a key pair stored in the file mykey.txt in the same folde

>  **⚠️** We highly recommend to use another keypair for depositing stake, withdrawing stake and withdrawing reward.

## Optional: Configuring domain name

Once your seed node is fully set up, it is time to configure your domain name to point to the address of your seed node. 

If your seed node is not behind a load balancer, you can set an `A record` in your domain registrar to point your domain/subdomain to your seed node’s IP address.

If your seed node is behind a load balancer, you can set a `CNAME record` in your domain registrar to point your domain/subdomain to the hostname of your load balancer.

## Testing your staked seed node JSON-RPC port

To check whether your JSON-RPC is publicly available, you can use the following curl command.
```bash
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetBlockchainInfo",
    "params": [""]
}' -H "Content-Type: application/json" -X POST "<staked seed node address>"
```

If you received the latest blockchain information (similar to the one below) from the staked seed node, your JSON-RPC service is running well.
```bash
{"id":"1","jsonrpc":"2.0","result":{"CurrentDSEpoch":"4789","CurrentMiniEpoch":"478809","DSBlockRate":0.00013455546527607284,"NumDSBlocks":"4790","NumPeers":2400,"NumTransactions":"3091806","NumTxBlocks":"478809","NumTxnsDSEpoch":"185","NumTxnsTxEpoch":"0","ShardingStructure":{"NumPeers":[600,600,600]},"TransactionRate":0,"TxBlockRate":0.013450003515398927}}
```

## Testing your staked seed node WebSocket port
You can use an online websocket test utility to test whether your websocket is publicly accessible.

1. Visit https://www.websocket.org/echo.html
2. Under location, put your websocket url link (e.g., `wss://<yourdomain here or ip:port>`)
3. Click on connect
4. If **“CONNECTED”** is shown in the log, your websocket port is publicly accessible
