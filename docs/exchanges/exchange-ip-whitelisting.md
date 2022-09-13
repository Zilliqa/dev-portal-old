---
id: exchange-ip-whitelisting
title: IP Whitelisting
keywords:
  - exchanges
  - docker setup
  - zilliqa
description: Run seed node in IP Whitelisting mode.
---

In IP whitelisting mode, blockchain data is pushed directly to exchanges in periodic intervals.
Exchange IP addresses must be whitelisted by Zilliqa Research to receive these data broadcasts.

## Preparing the Machine

Before you start, please ensure the steps below are done.

1. Choose and note down a port you wish to reserve for your seed node to receive incoming blockchain data.
1. Share the static IP address and port of the node with the Zilliqa support team for whitelisting.
   This step is critical, as failing to provide the correct IP and port will result in failure to receive blockchain data.

:::important
The port of choice must be opened to inbound connections. Otherwise, the seed node will be unreachable.
:::

### Docker Setup

We highly recommend using [Docker](https://docker.com) to set up a seed node,
as we provide a tested, production-ready image for your use. If you have not
yet set up docker, please follow the instructions on the [official documentation](https://docs.docker.com/install/).

Once you have set up Docker, you may proceed to download the configuration
tarball for the Mainnet:

```sh
# create a directory
$ mkdir my_seed && cd my_seed
# download the seed node configuration files
$ curl -O https://mainnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz

# Contents:
#
# launch.sh
# constants.xml
# launch_docker.sh
# dsnodes.xml
# config.xml
```

### Native Setup

:::note
This approach has been tested on **Ubuntu 18.04** and involves compiling
C++. We strongly recommend you consider using the Docker image provided above.
:::

If you cannot or do not wish to use Docker, you may also build the Zilliqa
binary from source and run it as such.

```sh
# clone Zilliqa source files
$ git clone https://github.com/Zilliqa/Zilliqa.git && cd Zilliqa && git checkout
tags/<tag_id>

# install system dependencies
$ sudo apt-get update && sudo apt-get install \
    git \
    libboost-system-dev \
    libboost-filesystem-dev \
    libboost-test-dev \
    libssl-dev \
    libleveldb-dev \
    libjsoncpp-dev \
    libsnappy-dev \
    cmake \
    libmicrohttpd-dev \
    libjsonrpccpp-dev \
    build-essential \
    pkg-config \
    libevent-dev \
    libminiupnpc-dev \
    libcurl4-openssl-dev \
    libboost-program-options-dev \
    libboost-python-dev \
    python3-dev         \
    python3-setuptools  \
    python3-pip         \
    gawk

# Run the following to install latest version of cmake.
# We suggest to install cmake 3.19 or any version >=3.16:
wget https://github.com/Kitware/CMake/releases/download/v3.19.3/cmake-3.19.3-Linux-x86_64.sh
mkdir -p "${HOME}"/.local
bash ./cmake-3.19.3-Linux-x86_64.sh --skip-license --prefix="${HOME}"/.local/
export PATH=$HOME/.local/bin:$PATH
cmake --version
rm cmake-3.19.3-Linux-x86_64.sh

$ export LC_ALL=C
$ pip3 install requests clint futures

# build the binary. this may take a while.
$ ./build.sh
```

The build should exit with no errors. Once it is complete, download the
configuration tarball:

```sh
# make a separate folder for keys and configuration
$ cd ../ && mkdir my_seed && cd my_seed
# download the seed node configuration files
$ curl -O https://mainnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz

# Contents:
#
# launch.sh
# constants.xml
# launch_docker.sh
# dsnodes.xml
# config.xml
```

## Configuring the Node

The node requires some configuration before it can successfully join the
network. Most configuration is contained in `constants.xml`, which should be
in the directory we extracted `seed-configuration.tar.gz` to. Minimally, the
following changes are required:

- Change the value of `ENABLE_WEBSOCKET` to `true` if your seed node will support
  websockets (refer to the [Zilliqa Websocket Server](../dev/dev-tools-websockets.md) documentation).

## Joining the Network

Once the preliminary steps have been completed, joining the network is relatively
straightforward.

```sh
# NOTE: run only ONE of the following.
# for Docker setup
$ ./launch_docker.sh
# for native setup
$ ./launch.sh
```

You will be asked a series of questions. When asked to enter your IP address
and listening port. This is crucial, as your node **will not work** with anything
else.

Sample instructions to be followed for launch are provided below.

- launch_docker.sh

```sh
$ ./launch_docker.sh
Assign a name to your container (default: zilliqa): <container_name>
Enter your IP address (*.*.*.*): <static ip address>
Enter your listening port (default: 33133): <33133 or other selected port>
Use IP whitelisting registration approach (default: Y): Y
```

- launch.sh

```sh
$ ./launch.sh
Enter the full path of your zilliqa source code directory: <zilliqa code directory path>
Enter the full path for persistence storage (default: current working directory): <default or custom path>
Enter your IP address (*.*.*.*): <static ip address>
Enter your listening port (default: 33133): <33133 or other selected port>
Use IP whitelisting registration approach (default: Y): Y
```

## Testing Your Seed Node's JSON-RPC Port

To check whether your node's JSON-RPC server is publicly available, you can use the following curl command.

```bash
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetBlockchainInfo",
    "params": [""]
}' -H "Content-Type: application/json" -X POST "<seed node address>"
```

If you received the latest blockchain information (similar to the one below) from the seed node, your JSON-RPC service is running well.

```bash
{"id":"1","jsonrpc":"2.0","result":{"CurrentDSEpoch":"4789","CurrentMiniEpoch":"478809","DSBlockRate":0.00013455546527607284,"NumDSBlocks":"4790","NumPeers":2400,"NumTransactions":"3091806","NumTxBlocks":"478809","NumTxnsDSEpoch":"185","NumTxnsTxEpoch":"0","ShardingStructure":{"NumPeers":[600,600,600]},"TransactionRate":0,"TxBlockRate":0.013450003515398927}}
```

## Testing Your Seed Node's WebSocket Port

You can use an online WebSocket test utility to test whether your WebSocket is publicly accessible.

1. Visit https://www.websocket.org/echo.html
1. Under location, put your WebSocket URL link (e.g., `wss://<yourdomain here or ip:port>`)
1. Click on connect
1. If **“CONNECTED”** is shown in the log, your WebSocket port is publicly accessible

## Next Steps

If you have successfully completed the above steps, you should have
a functioning seed node that exposes an RPC API on `localhost:4201`. You may
further check the logs at `zilliqa-00001-log.txt`.

The following articles in this series will demonstrate a simple set of
functions that can be used as a starting point for exchange developers to implement
their own custom business logic around the Zilliqa blockchain. You may find
the full source code of the example app in the [same repository](https://github.com/Zilliqa/dev-portal/tree/master/examples/exchange).
