---
id: exchange-key-whitelisting
title: Key Whitelisting 
keywords:
- exchanges
- docker setup
- zilliqa
description: Run seed node in IP Whitelisting mode. 
---

## Preparing the Machine

Sample instructions to be followed for launch are provided below for both modes.
- Generate and Share the public key of the node with the Zilliqa support team to whitelist the node in the Zilliqa lookups and seedpubs nodes.
- Choose and note down a port you wish to reserve for your seed node to
communicate on. This step is critical, as failing to provide the correct port
will result in failure. If you wish not to open the listener port because of security reasons then we have P2PSeed key-based whitelisting feature. A Node operating in P2PSeed key-based whitelisting can operate in client-server mode.
- The static ip address and port of choice have to be shared with the Zilliqa team in the KYC form.
### Docker Setup

We highly recommend using [Docker](https://docker.com) to set up a seed node,
as we provide a tested, production-ready image for your use. If you have not
yet set up docker, please follow the instructions on the [official documentation](https://docs.docker.com/install/).

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
# config.xml
```

Once you have successfully uncompressed the tarball, you should generate a new
keypair, like so:

```sh
$ ./launch_docker.sh --genkeypair
```

Also one additional key pair needs to generated to support key whitelisting:
```sh
$ sudo docker run --rm zilliqa/zilliqa:<<version>> -c genkeypair
# for eg: sudo docker run --rm zilliqa/zilliqa:v7.2.0 -c genkeypair
03690A37D75D4E0795CCDA3AC1F773DE12F66A312D003A930B7CBFD4DF53E7C8A6 B45E729E98342D015B359A92E029FC73C1DA607EA5A8C16F69AB84142FEC0553
```
The first value from the ouput is public key and second value is private key.Public key has to be shared in advance while submitting KYC form.Private key is required to start seed node.

If you wish you launch seed node in P2PSeed mode,then please refer to below
steps for downloading the configuration tarball, and generate a keypair:

```sh
# make a separate folder for keys and configuration
$ cd ../ && mkdir my_seed && cd my_seed
# download the seed node configuration files
$ curl -O https://mainnet-join.zilliqa.com/p2pseed-configuration.tar.gz
$ tar -zxvf p2pseed-configuration.tar.gz

# generate a keypair
$ ../Zilliqa/build/bin/genkeypair > mykey.txt

# generate additional key pair for key whitelisting.
$ ../Zilliqa/build/bin/genkeypair
# for eg: ../Zilliqa/build/bin/genkeypair
03690A37D75D4E0795CCDA3AC1F773DE12F66A312D003A930B7CBFD4DF53E7C8A6 B45E729E98342D015B359A92E029FC73C1DA607EA5A8C16F69AB84142FEC0553
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
tags/<<tag_id>> && cd Zilliqa

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
configuration tarball, and generate a keypair:

```sh
# make a separate folder for keys and configuration
$ cd ../ && mkdir my_seed && cd my_seed
# download the seed node configuration files
$ curl -O https://mainnet-join.zilliqa.com/seed-configuration.tar.gz
$ tar -zxvf seed-configuration.tar.gz

# generate a keypair
$ ../Zilliqa/build/bin/genkeypair > mykey.txt

# generate additional key pair for key whitelisting.
$ ../Zilliqa/build/bin/genkeypair
# for eg: ../Zilliqa/build/bin/genkeypair
03690A37D75D4E0795CCDA3AC1F773DE12F66A312D003A930B7CBFD4DF53E7C8A6 B45E729E98342D015B359A92E029FC73C1DA607EA5A8C16F69AB84142FEC0553
```

## Configuring the Node

The node requires some configuration before it can successfully join the
network. Most configuration is contained in `constants.xml`, which should be
in the directory we extracted `seed-configuration.tar.gz` to. Minimally, the
following changes are required:

- Change the value of `ENABLE_WEBSOCKET` to `true` if your seed node will support
  websockets (refer to the [Zilliqa Websocket Server](https://github.com/Zilliqa/dev-portal/tree/master/docs/api-websocket.md) documentation).

## Joining the Network

:::note
Before proceeding with this step, make sure you have completed the necessary KYC (for individual).
:::

Once the preliminary steps have been completed, joining the network is relatively
straightforward.

```sh
# NOTE: run only ONE of the following.
# for Docker setup
$ ./launch_docker.sh`
# for native setup
$ ./launch.sh
```

You will be asked a series of questions. When asked to enter your IP address
and listening port, please enter the values you provided us when you submitted
the KYC form. This is crucial, as your node **will not work** with anything
else.

Sample instructions to be followed for launch are provided below.

- launch_docker.sh

```sh
$ ./launch_docker.sh
Assign a name to your container (default: zilliqa):<<container_name>>
Enter your IP address ('NAT' or *.*.*.*): <<static ip address of machine>>
Enter your listening port (default: 33133): <<33133 or already selected port>>
Use IP whitelisting registration approach (default: Y): N
Enter the private key (32-byte hex string) to be used by this node and whitelisted by upper seeds: << Private key generated for key whitelisting>>
```

- launch.sh

```sh
$ ./launch.sh
Enter the full path of your zilliqa source code directory:<<zilliqa code directory path>>
Enter the full path for persistence storage (default: current working directory): << default or custom path>>
Enter your IP address ('NAT' or *.*.*.*): <<static ip address>>
Enter your listening port (default: 33133): <<33133 or already selected port>>
Use IP whitelisting registration approach (default: Y): N
Enter the private key (32-byte hex string) to be used by this node and whitelisted by upper seeds: << Private key generated for key whitelisting>>
```

## Joining the Network in P2PSeed mode

:::note
Before proceeding with this step, make sure you have completed the necessary KYC (for individual).
:::

```sh
# NOTE: run only ONE of the following.
# for Docker setup
$ ./launch_docker.sh
# for native setup
$ ./launch.sh
```

You will be asked a series of questions. When asked to enter your IP address ,
please enter the values you provided us when you submitted
else.

the KYC form. This is crucial, as your node **will not work** with anything
Sample instructions to be followed for launch are provided below.

- launch_docker.sh

```sh
$ ./launch_docker.sh
Assign a name to your container (default: zilliqa):<<container_name>>
Enter your IP address ('NAT' or *.*.*.*): <<static ip address>>
Enter the private key (32-byte hex string) to be used by this node and whitelisted by upper seeds: << Private key generated for key whitelisting>>

```

- launch.sh

```sh
$ ./launch.sh
Enter the full path of your zilliqa source code directory:<<zilliqa code directory path>>
Enter the full path for persistence storage (default: current working directory): << default or custom path>>
Enter your IP address ('NAT' or *.*.*.*): <<static ip address>>
Enter the private key (32-byte hex string) to be used by this node and whitelisted by upper seeds: << Private key generated for key whitelisting>>
```
## Next Steps

If you have successfully completed the above steps, you should have
a functioning seed node that exposes an RPC API on `localhost:4201`. You may
further check the logs at `zilliqa-00001-log.txt`.

The following articles in this series will demonstrate a simple set of
functions that can be used as a starting point for exhcange developers to implement
their own custom business logic around the Zilliqa blockchain. You may find
the full source code of the example app in the [same repository](https://github.com/Zilliqa/dev-portal/tree/master/examples/exchange).