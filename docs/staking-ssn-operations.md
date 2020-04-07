---
id: staking-ssn-operations
title: Staked Seed Node (SSN) operation
---

# Introduction to staked seed node smart contract

The following guide will use Zilliqa ZLI and SDK as an example for interacting with the smart contract. 

> For ZLI installation and initialisation of the wallet in ZLI, please refer to the README documentation at https://github.com/Zilliqa/zli

The staked seed node smart contract will be used in the following ways:
- Allow addition/removal of staked seed node
- Allow for deposit of stake reward to staked seed node operator
- Allow staked seed node operator to deposit stake deposit
- Allow staked seed node operator to withdraw stake deposit
- Allow staked seed node operator to withdraw stake reward

For staked seed node operators, a number of smart contract transition is available for them, namely:
- `stake_deposit()`
- `withdraw_stake_rewards()`
- `withdraw_stake_amount()`

# SSN address and key pair management
Each staked seed node registered in the contract is associated with a Zilliqa mainnet address. This address is used to both deposit and withdraw funds as well as withdraw the rewards using the smart contract transitions listed above. Operators should take care to exercise whatever policies are in place in their organizations for managing the key pair associated with this address.

> **Note:** The key pair used for staking the seed node has no relation to the operational key pair used by the seed node for communicating with other nodes in the network (i.e., the key pair contained in the mykey.txt file generated when launching the seed node). It is highly recommended not to use a single key pair for both purposes.

# Stake deposit

## Why a stake deposit is required

Having each operator deposit an amount in the contract ensures that rewarding is done on the basis of the staked seed node providing its API service uninterrupted. This is achieved by staking (the proportion of “skin in the game”). By depositing $ZILs, a seed node operator shows its commitment towards providing the seed node service. Without this "skin in the game", a seed node operator could decide to stop the service at will and may impact the ecosystem and the end users.

## Stake deposit process

Currently, our rewarding cycle is paid out once **every 15 DS epochs**. In order to deter abuse of the reward cycle, stake deposit will first be entered as a buffered deposit. At the next multiple of 15 DS epoch, the buffered deposit will be transferred to the stake deposit. From then on, the stake deposit will be eligible for rewards.

CLI way to deposit stake amount
```
zli contract call -a <contract_address> -t stake_deposit -r "[]" -m <funds_in_Qa> -f true
```

Example:
```
zli contract call -a 0123456789012345678901234567890123456789 -t stake_deposit -r "[]" -m 10000000000000 -f true
```

## How to check the current stake deposit?

The current stake deposit can be retrieved by querying the staking contract state:
```
curl -d '{"id":"1", "jsonrpc": "2.0", "method": "GetSmartContractState", "params":["<staking_contract_address>"]}' -H "Content-Type: application/json" -X POST "https://api.zilliqa.com" 
```

In the response, under “ssnlist: {...}”, look for your staked seed node address. The first numeric value listed is the current stake deposit, and the second numeric value is the amount of accrued rewards.

Example of stake deposit for a particular ssn address:
```
{
 ...
 ...
  	"ssnlist" : {
     	"0xced263257fa2d12ed0d1fad74ac036162cec7989" : {
        	"arguments" : [
           	{
              	"argtypes" : [],
              	"arguments" : [],
              	"constructor" : "True"
           	},
           	"1000000001", ← stake deposit
           	"0", ← reward amount
           	"devapiziiliqacom",
           	"ziiliqacom",
           	"0"
        	],
        	"argtypes" : [],
        	"constructor" : "Ssn"
     	}
  	},
    ...
    ...
   }
}
```

## Withdrawal of stake deposit

### What happens when the stake deposit is withdrawn?

For partial withdrawal, you will need to ensure that your stake deposit is larger than the minimum stake amount (**10,000,000 ZIL**) in order for withdrawal to be successful.

For full withdrawal, with the rewards not yet fully withdrawn, your staked seed node will become inactive. It can be reactivated by doing another stake deposit into the contract.

For full withdrawal, with the rewards also fully withdrawn, your staked seed node will be removed from the list of staked seed nodes. The Zilliqa team will need to re-add your seed node into the contract should you wish to participate once again in staking.

### CLI way to withdraw stake deposit

Zli command: withdraw_stake_amount
```
zli contract call -a <contract_address> -t withdraw_stake_amount -r "[{\"vname\":\"amount\",\"type\":\"Uint128\",\"value\":\"<amount>\"}]" -f true
```

Example:
```
zli contract call -a 0123456789012345678901234567890123456789 -t withdraw_stake_amount -r "[{\"vname\":\"amount\",\"type\":\"Uint128\",\"value\":\"500000000000\"}]" -f true
```

> **Note:** param “amount” here is expressed in Qa units (1 Zil = 1,000,000,000,000 Qa).

# Getting rewards

## How rewards are given

In order to be eligible for rewards, the staked seed node must satisfy all of the following criteria:
1. It must be recognized as an active staked seed node in the staking smart contract.
2. It must pass the checks for raw data storage requested by the Verifier.
3. It must pass the checks for servicing API requests by the Verifier.

Rewards are given once **every 15 DS epochs**. Over a period of a year, it is estimated that the staked seed node will receive approximately **10.42%** of the stake deposit as reward, if the staked seed node has an uptime of 100%. 

Rewards are not added to the stake deposit; they are stored separately from the stake deposit. When calculating the reward, the Verifier only takes the stake deposit into account. As such, there is **no “compounding” effect** for the rewards.

## Reward estimator utility
The reward estimator utility is accessible at https://zilliqa.github.io/staking-calculator-plugin/index.html

## Penalty for rewards

If the staked seed node did not achieve 100% uptime, the reward will be reduced proportionally based on the number of checks passed.

## CLI way to check current rewards

Zli staking reward utility:
```
zli staking rewards -s ssn_operator -c contract_address -a api_endpoint
```

Example:
```
zli staking rewards -s 0x53e954391539f276c36a09167b795ab7e654fdb7 -c 343407558c9bb1f7ae737af80b90e1edf741a37a -a https://api.zilliqa.com
```

# Withdrawing rewards 

## Withdraw reward process

The withdrawal of reward process is straightforward. The staked seed node operator will need to only invoke `withdraw_stake_rewards()` using the operator key, and the reward will be sent to the staked seed node operator address.

For reward withdrawal, with full stake amount already withdrawn, your staked seed node will be removed from the list of staked seed nodes.

## CLI way to withdraw current rewards

Zli command: withdraw_stake_rewards
```
zli contract call -a <contract_address> -t withdraw_stake_rewards -r "[]" -f true
```

Example:
```
zli contract call -a 0123456789012345678901234567890123456789 -t withdraw_stake_rewards -r "[]" -f true
```