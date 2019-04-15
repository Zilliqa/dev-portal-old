---
id: mining-monitoring
title: Monitoring progress
---

You are now a miner in the Zilliqa mainnet. You can monitor your progress on your CPU node by using:

```shell
tail -f zilliqa-00001-log.txt
```

## Checking your generated keypairs

To check your locally generated public and private key pairs in your _mykey.txt_ file, you can enter the following in your command prompt on your CPU node:

```shell
less mykey.txt
```

The first hex string is your **public key**, and the second hex string is your **private key**.

> **NOTE:** This key pair is generated locally on your disk. Do remember to keep your private key somewhere safe!

## Checking your ZIL balance

To check your balance for mining, input the address located in your _myaddr.txt_ file in the search bar of https://viewblock.io/zilliqa:

```shell
less myaddr.txt
```

## Stopping the mining process

To stop the mining client, stop the docker container running the **Zilliqa client** on the CPU node:

```shell
sudo docker stop zilliqa
```

You will also need to kill your **Zilminer** process on your GPU rigs.