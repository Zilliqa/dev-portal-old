---
id: rosetta-setting-up-seed-node
title: Setting up Zilliqa Rosetta with Seed node
keywords:
  - rosetta
  - middleware
  - exchanges
  - zilliqa
  - rosetta
  - setup
  - seed
  - node
description: Setting up Zilliqa Rosetta with Seed node
---

---

## Setup

:::info
Please note that whitelisting will be required for operating a Zilliqa seed node. Currently, whitelisting is granted on a case by case basis and usually for reason such as supporting exchange infrastracture.
:::

### Step 1: Download `Zilliqa-rosetta` latest release from https://github.com/Zilliqa/zilliqa-rosetta/releases.

### Step 2: Build `Zilliqa-rosetta` Docker image from Zilliqa and Scilla source code

```bash
sh ./build_docker.sh
```

If you need to build `Zilliqa-rosetta` with a specific Zilliqa and Scilla version, you can using the following

```bash
docker build \
--build-arg ROSETTA_COMMIT_OR_TAG=<ROSETTA_TAG> \
--build-arg SCILLA_COMMIT_OR_TAG=<SCILLA_TAG> \
--build-arg COMMIT_OR_TAG=<ZILLIQA_TAG> \
-t rosetta:1.0 .
```

Please note compiling Zilliqa and Scilla may take some time.

### Step 3: Create `config.yaml` for `Zilliqa-rosetta`. We have also provided a sample of [testnet](https://github.com/Zilliqa/zilliqa-rosetta/blob/master/testnet.config.local.yaml) and [mainnet](https://github.com/Zilliqa/zilliqa-rosetta/blob/master/mainnet.config.local.yaml) configuration.

### Step 4: Generation of keypair for whitelisting (only for public key whitelisting method)

If you are using public key whtielisting method and wish to generate a keypair, you can do the following

```bash
mkdir secrets

docker run --rm \
--env GENKEYPAIR="true" \
rosetta:1.0 > secrets/mykey.txt
```

Remember to inform the Zilliqa team of your public key for whitelisting purpose

### Step 5:Running `Zilliqa-rosetta`

```bash
docker run -d \
--env BLOCKCHAIN_NETWORK="<NETWORK_TO_USE>" \
--env IP_ADDRESS="<SEED_NODE_HOST_IP>" \
--env MULTIPLIER_SYNC="<Y_or_N>" \
--env SEED_PRIVATE_KEY="<SEED_PRIVATE_KEY>" \
--env TESTNET_NAME="<NAME_OF_THE_TESTNET>" \
--env BUCKET_NAME="<NAME_OF_THE_PERSISTENCE_BUCKET>" \
-v $(pwd)/secrets/mykey.txt:/run/zilliqa/mykey.txt \
-p 4201:4201 -p 4301:4301 -p 4501:4501 -p 33133:33133 -p 8080:8080 \
--name rosetta rosetta:1.0
```

| Variable                         | Description                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `NETWORK_TO_USE`                 | `testnet` or `mainnet`                                                                            |
| `SEED_NODE_HOST_IP`              | Public IP for Zilliqa seed node                                                                   |
| `SEED_PRIVATE_KEY`               | prviate key of the whitelisted keypair. Optional field                                            |
| `NAME_OF_THE_TESTNET`            | Refer to [`network meta`](https://github.com/Zilliqa/zilliqa-rosetta/blob/master/network_meta.md) |
| `NAME_OF_THE_PERSISTENCE_BUCKET` | Refer to [`network meta`](https://github.com/Zilliqa/zilliqa-rosetta/blob/master/network_meta.md) |

## Maintanance

### Restarting Zilliqa Rosetta

```bash
docker stop <container name>
docker start <container name>
```
