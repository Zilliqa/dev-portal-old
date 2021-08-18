---
id: dev-tools-cli
title: CLI-Tools
keywords:
  - cli tools
  - go-zli
  - zilliqa
description: Zilliqa CLI Tools
---

---

## go-zli

[zli](https://github.com/Zilliqa/zli) is a command-line tool based on the Zilliqa [Golang SDK](https://github.com/Zilliqa/gozilliqa-sdk).

## Source Code

The Github repository can be found at [https://github.com/Zilliqa/zli](https://github.com/Zilliqa/zli)

## Getting zli

Run the following to clone the repository to your local machine

```bash
git clone https://github.com/Zilliqa/zli.git
```

### Installation

#### Build

Run the following command to generate the `zli` binary:

```go
go build -o zli main/main.go
```

#### Install

Option 1: Install the `zli` binary by specifying the output path during the build:

```go
go build -o $GOPATH/bin/zli main/main.go
```

Option 2: Run the installation script:

```bash
sh install.sh
```

### Commands

Run `zli -h` to see the help message along with the list of available commands:

```bash
A convenient command-line tool to generate accounts, run integration testings or run http server .etc
Usage:
  zli [flags]
  zli [command]
Available Commands:
  account     Generate or load multiple accounts
  contract    Deploy or call zilliqa smart contract
  help        Help about any command
  rpc         readonly json rpc of zilliqa
  transfer    Transfer zilliqa token to a specific account
  version     Print the version number of zli
  wallet      Init a new wallet or get exist wallet info
Flags:
  -h, --help   help for zli
Use "zli [command] --help" for more information about a command.
```

`zli` works by storing account information in a wallet configuration file in `~/.zilliqa`.

Run `zli [command] --help` to see the usage details for each available command. Here are some commonly used commands:

#### Wallet

- `zli wallet init`: Generate a new wallet (configuration file) for `zli` to use. A default account (using randomly generated private key) is created inside the wallet.
- `zli wallet echo`: Print out the contents of the wallet (i.e., the configuration file).
- `zli wallet from [flags]` : Generate a new wallet from a specific private key.

#### Contract

- `zli contract deploy [flags]`: Deploy a new contract.
- `zli contract call [flags]`: Call an existing contract.
- `zli contract state [flags]`: Get the state data for a specific smart contract.

#### Account

- `zli account generate [flags]`: Generate a random private key.

#### Transfer

- `zli transfer [flags]`: Transfer Zilliqa tokens to a specific account.

### RPC

- `zli rpc transaction [flags]`: Get the transaction details for a specific transaction ID.

### Examples

#### Executing Corner-Case Tests on a Tiny Contract

1. Prepare the wallet (configuration file `~/.zilliqa`) by running `zli wallet init` or `zli wallet from -p [private_key]`:

```json
{
  "api": "https://ipc-ud-api.dev.z7a.xyz",
  "chain_id": 2,
  "default_account": {
    "private_key": "227159779c78c9a920cba73086cf73fb3ee15cdd95380aa3b93757669e345300",
    "public_key": "0324cdd72db3de0e9f570d550631438d581056fb0d9c4daddbad2928eaf49f54ee",
    "address": "31f33d13ad6aa724cde1f3d12d75fb344a1df9de",
    "bech_32_address": "zil1x8en6yadd2njfn0p70gj6a0mx39pm7w7lz3kpm"
  },
  "accounts": [
    {
      "private_key": "227159779c78c9a920cba73086cf73fb3ee15cdd95380aa3b93757669e345300",
      "public_key": "0324cdd72db3de0e9f570d550631438d581056fb0d9c4daddbad2928eaf49f54ee",
      "address": "31f33d13ad6aa724cde1f3d12d75fb344a1df9de",
      "bech_32_address": "zil1x8en6yadd2njfn0p70gj6a0mx39pm7w7lz3kpm"
    }
  ]
}
```

2. Deploy a tiny contract by running `sh scripts/deploy-tiny-contract.sh`

3. Run `zli testsuit tiny -a [contract_address]` or `sh scripts/test-tiny-contract.sh` to execute the tests. If the receipt of any transaction returns `false`, execution stops and the remaining tests are aborted.

#### Invoking a Contract

1. Prepare the wallet similar to the previous example.

2. Run the following command to invoke a smart contract:

```bash
zli contract call -a <smart contract address> -t <transition name> -r <parameter>
```

For instance:

```bash
zli contract call -a 305d5b3acaa2f4a56b5e149400466c58194e695f -t SubmitTransaction -r "[{\"vname\":\"recipient\",\"type\":\"ByStr20\",\"value\":\"0x381f4008505e940ad7681ec3468a719060caf796\"},{\"vname\":\"amount\",\"type\":\"Uint128\",\"value\":\"10\"},{\"vname\":\"tag\",\"type\":\"String\",\"value\":\"a\"}]"
```

:::note
`zli` supports passing the private key as a parameter to the `zli contract deploy` or `zli contract call` command. Just use the `-k [private key]` option to switch to a different private key for sending transactions.
:::

#### Running zli Inside a Docker Container

An alternative to running `zli` as a native binary is to build (or download) the `go-zli` Docker image, and to run `zli` from inside the container. This option requires prior installation of Docker (refer to the [Docker installation page](https://docs.docker.com/install/)).

1. Build the `go-zli` Docker image:

```bash
sh build_docker_image.sh
```

2. Run `zli` inside a container environment:

```bash
docker run --rm -it -v ~/contract:/contract docker.pkg.github.com/zilliqa/zli/zli bash
```
