---
id: dev-env-mainnet
title: Mainnet
---

---

## Zilliqa Mainnet

|          | URL(s) |
|:---------|:-------|
| **API URL** | `https://api.zilliqa.com/` |
| **Block Explorer** | [**Link**](https://viewblock.io/zilliqa) |
| **WebSocket endpoint** | wss://api-ws.zilliqa.com |

## Build Dependencies

* Ubuntu 16.04:

    ```bash
    sudo apt-get update
    sudo apt-get install git libboost-system-dev libboost-filesystem-dev libboost-test-dev \
        libssl-dev libleveldb-dev libjsoncpp-dev libsnappy-dev cmake libmicrohttpd-dev \
        libjsonrpccpp-dev build-essential pkg-config libevent-dev libminiupnpc-dev \
        libcurl4-openssl-dev libboost-program-options-dev libboost-python-dev python3-dev \
        python3-setuptools python3-pip gawk
    ```

## Build from Source Code

Build Zilliqa from the source (development branch):

```shell
# download the lastest stable Zilliqa source code
$ git clone https://github.com/Zilliqa/Zilliqa.git
$ cd Zilliqa && git checkout master

# build Zilliqa binary
$ ./build.sh
```
For more information, checkout this [repository]("https://github.com/Zilliqa/Zilliqa).