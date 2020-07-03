---
id: exchange-getting-started
title: Getting Started
---

---
# NOTICE TO EXCHANGES
> Interim Zillings (“Interim ZILs”) for Zillings (“ZILs”) are not available for offer, sale or transfer to U.S persons (as defined in Regulation S of the U.S. Securities Act of 1933). Please ensure that, at the time of exchange of Interim ZILs for ZILs, each holder of ZILs confirms that it is not a U.S person (as defined in Regulation S of the U.S. Securities Act of 1933).
---

While it's possible to use the public endpoint provided by Zilliqa to interact
with the blockchain, we recommend that all exchanges who wish to support
trading on the main net set up seed nodes. This document walks you through the
basic steps needed to get up and running.

## IP whitelisting

As seed nodes do not draw data directly from lookup or shard nodes, it is
necessary for exchanges to be whitelisted by Zilliqa in order to receive data
broadcasts about the blockchain and its state. This requires a static, public
IP address with minimally two open ports (inbound and outbound) at which it
can be reached.

## Minimum Hardware Requirements
- x64 Linux operating system (e.g Ubuntu 16.04.05)
- Recent dual core processor @ 2.2 GHZ. Examples:
   - Intel Core i5 or i7 (Skylake)
   - Intel Xeon (Skylake)
- 8GB DRR3 RAM or higher
- Public IP address
- 500GB Solid State Drive
- 100MB/s upload and download bandwidth

## Preparing the machine

Before you start, please choose and note down a port you wish to reserve for
your seed node to communicate on. This step is critical, as failing to provide
the correct part will result in failure.

### Docker setup

We highly recommend using [Docker](https://docker.com) to set up a seed node,
as we provide a tested, production-ready image for your use. If you have not
yet setup docker, please follow the instructions on the [official documentation](https://docs.docker.com/install/).

Once you have set up Docker, you may proceed to download the configuration
tarball for the mainnet:

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
# download_and_verify.sh
# fetchHistorical.py
# fetchHistorical.sh
# config.xml
```

Once you have successfully uncompressed the tarball, you should generate a new
keypair, like so:

```sh
$ ./launch_docker.sh --genkeypair
```

### Native setup

> Note: this approach has only been tested on **Ubuntu 16.04** and involves compiling
C++. We strongly recommend you consider using the Docker image provided above.

If you cannot or do not wish to use Docker, you may also build the Zilliqa
binary from source and run it as such.

```sh
# clone Zilliqa source files
$ git clone https://github.com/Zilliqa/Zilliqa.git && cd Zilliqa && git checkout
<<commit_sha>> && cd Zilliqa

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

$ sudo apt install python-pip
$ export LC_ALL=C
$ pip install request requests clint futures
$ pip3 install requests clint futures

# build the binary. this may take awhile.
$ ./build.sh
```

The build should exit with no errors. Once it is complete, download the
configuration tarball, and generate a keypair:

```sh
# make a separate folder for keys and configuration
$ cd ../ && mkdir my_seed && cd my_seed
# download the seed node configuration files
$ curl -O https://mainnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz

# generate a keypair
$ ../Zilliqa/build/bin/genkeypair > mykey.txt
```

## Configuring the Node

The node requires some configuration before it can successfully join the
network. Most configuration is contained in `constants.xml`, which should be
in the directory we extracted `configuration.tar.gz` to. Minimally, the
following changes are required:

- Change the value of `SEED_PORT` to `33133` (default), or a port of your choice (if
  any). Be sure to note this down for a subsequent step, if you do not select
  `33133`.
- Change the value of `ENABLE_WEBSOCKET` to `true` if your seed node will support
  websockets (refer to the [Zilliqa Websocket Server](https://github.com/Zilliqa/dev-portal/tree/master/docs/api-websocket.md) documentation).

## Joining the Network

> Note: before proceeding with this step, make sure you have completed the
> necessary KYC (for individual).

Once the preliminary steps have been completed, join the network is relatively
straightforward.

```sh
# NOTE: run only ONE of the following.
# for Docker setup
$ ./launch_docker.sh
# for native setup
$ ./launch.sh
```

You will be asked a series of questions. When asked to enter your IP address
and listening port, please enter the values you provided us when you submitted
the KYC form. This is crucial, as your node **will not work** with anything
else.

## Next Steps

If you have successfully completed the above steps, you should have
a functioning seed node that exposes an RPC API on `localhost:4201`. You may
further check the logs at `zilliqa-00001-log.txt`.

The following articles in this series will demonstrate a simple set of
functions that can be used as a starting point for exhcange developers to implement
their own custom business logic around the Zilliqa blockchain. You may find
the full source code of the example app in the [same repository](https://github.com/Zilliqa/dev-portal/tree/master/examples/exchange).