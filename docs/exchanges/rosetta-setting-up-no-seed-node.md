---
id: rosetta-setting-up-no-seed-node
title: Setting up Zilliqa Rosetta connecting to public API endpoint
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - rosetta
  - setup
  - public
  - api
  - endpoint
  - standalone
description: Setting up Zilliqa Rosetta connecting to public API endpoint
---

---

Zilliqa rosetta standalone provide the option of connecting to public seed node service such `api.zilliqa.com` and `dev-api.zilliqa.com` instead of running seed node on your end.

## Setup

### Step 1: Download `Zilliqa-rosetta` latest release from https://github.com/Zilliqa/zilliqa-rosetta/releases.

### Step 2: Build `Zilliqa-rosetta standalone` Docker image

#### Running with the latest release of Zilliqa rosetta

```bash
cd rosetta_standalone
sh ./build_standalone.sh .sh
```

#### Running with a specific release of Zilliqa rosetta

```bash
docker build \
--build-arg ROSETTA_COMMIT_OR_TAG=<ROSETTA_TAG> \
-f rosetta_standalone/Dockerfile_standalone
-t rosetta_standalone:1.0 .
```

### Step 3: Configuring `Zilliqa-rosetta` (optional)

By default, Zilliqa-rosetta standalone will connect to public endpoint of Zilliqa testnet and mainnet.

If you need to connect to other Zilliqa endpoints, you can mdoify `Zilliqa-rosetta` configurations yaml. The format is as follows:

```yaml
* rosetta:
  * host: rosetta restful api host
  * port: resetta restful api port
  * version: rosetta sdk version
  * middleware_version: middleware version
* networks:
  * <network_name>:
    * api: api endpoint of mainnet
    * chain_id: chain id of mainnet
    * node_version: zilliqa node verion
  * <network_name>:
    * api: api endpoint of mainnet
    * chain_id: chain id of mainnet
    * node_version: zilliqa node verion
```

Default configuration files for Zilliqa testnet and mainnet combined has been included in Rosetta root directory.

| Network          | Config file         |
| ---------------- | ------------------- |
| Testnet, Mainnet | `config.local.yaml` |

### Step 4: Running `Zilliqa-rosetta`

#### Running Zilliqa rosetta standalone with default configuration

```bash
run_standalone.sh
```

#### Running Zilliqa rosetta standalone with custom configuration

```bash
docker run -d -p 8080:8080 -v <absolute directory of config.local.yaml>:/rosetta/config.local.yaml --name rosetta_standalone rosetta_standalone:1.0
```

## Maintainance

### Restarting Zilliqa Rosetta

```bash
docker stop <container name>
docker start <container name>
```
