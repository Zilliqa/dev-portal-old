---
id: staking-ssn-operations
title: Staked Seed Node operations
---

# Introduction to staked seed node smart contract

The following guide will use Zilliqa ZLI and SDK as an example for interacting with the smart contract. 

> For ZLI installation and initialisation of the wallet in ZLI, please refer to the README documentation at https://github.com/Zilliqa/zli

The staked seed node smart contract will be used in the following ways:
- Allows addition/removal of staked seed node
- Allows for deposit of stake reward to staked seed node operator
- Allows staked seed node operator to deposit stake deposit
- Allows staked seed node operator to withdraw stake deposit
- Allows staked seed node operator to withdraw stake reward

For staked seed node operators, a number of smart contract transition is available for them, namely:
- `stake_deposit()`
- `withdraw_stake_rewards()`
- `withdraw_stake_amount()`

# Smart contract information

We have two smart contract, namely `proxy` and `ssnlist`. Proxy contract stores the implementation address of `ssnlist` and forwards all call to the logic contract, `ssnlist`.

As such, any user who wishes to interact with the contract, should interact with `proxy` contract only.

<!--DOCUSAURUS_CODE_TABS-->
<!-- Testnet -->
<br>
| Type    | Address |
| ------- | ------- |
| Proxy   | [zil1g3dj8nk3l4t5cstqpqvg6v7s2qawxvqrr3xzag](https://viewblock.io/zilliqa/address/zil1g3dj8nk3l4t5cstqpqvg6v7s2qawxvqrr3xzag?network=testnet) |
| ssnlist | [zil12n0nhujzueferf0uff9308fnw4al87k28lqhjx](https://viewblock.io/zilliqa/address/zil12n0nhujzueferf0uff9308fnw4al87k28lqhjx?network=testnet) |

| Parameters                 | Value       |
| -------------------------- | ----------- |
| Min stake                  | 10k         |
| Max stake                  | 100k        |
| Overall contract max stake | 1M          |
| Reward cycle               | 6 DS blocks |


<!-- Mainnet (coming soon) -->
<br>
| Type    | Address |
| ------- | ------- |
| Proxy   | Not available yet |
| ssnlist | Not available yet |

| Parameters                 | Value        |
| -------------------------- | ------------ |
| Min stake                  | 10M          |
| Max stake                  | 70M          |
| Overall contract max stake | 700M         |
| Reward cycle               | 15 DS blocks |

These are tentative number and may subjected to change

<!--END_DOCUSAURUS_CODE_TABS-->

> **Notice:** Please use proxy contract address if you need to call the smart contract.

# SSN address and key pair management
Each staked seed node registered in the contract is associated with a Zilliqa mainnet address. This address is used to both deposit and withdraw funds as well as withdraw the rewards using the smart contract transitions listed above. Operators should take care to exercise whatever policies are in place in their organizations for managing the key pair associated with this address.

> **Note:** The key pair used for staking the seed node has no relation to the operational key pair used by the seed node for communicating with other nodes in the network (i.e., the key pair contained in the mykey.txt file generated when launching the seed node). It is highly recommended not to use a single key pair for both purposes.

# Stake deposit

## Why a stake deposit is required

Having each operator deposit an amount in the contract ensures that rewarding is done on the basis of the staked seed node providing its API service uninterrupted. This is achieved by staking (the proportion of “skin in the game”). By depositing $ZILs, a seed node operator shows its commitment towards providing the seed node service. Without this "skin in the game", a seed node operator could decide to stop the service at will and may impact the ecosystem and the end users.

## Stake deposit process

Currently, our rewarding cycle is paid out once **every 15 DS epochs**. In order to deter abuse of the reward cycle, **stake deposit will first be entered as a buffered deposit**. At the next multiple of 15 DS epoch, the buffered deposit will be transferred to the stake deposit. From then on, the stake deposit will be eligible for rewards.

**CLI way to deposit stake amount**
```bash
zli contract call -a <proxy contract_address> -t stake_deposit -r "[]" -m <funds_in_Qa> -f true
```

Example:
```bash
zli contract call -a 0123456789012345678901234567890123456789 -t stake_deposit -r "[]" -m 10000000000000 -f true
```

**SDK sample code**
| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | [stake_deposit.js](https://github.com/Zilliqa/staking-contract/blob/master/scripts/NodeJS/SSN-Operators/stake_deposit.js) |
| Java     | [stakeDeposit()](https://github.com/Zilliqa/staking-contract/blob/12b9e594578429db5699e5f2e116c1ed825fca23/scripts/Java/src/main/java/com/zilliqa/staking/SSNOperator.java#L67) |

## How to check the current stake deposit and stake buffered amount?

The current stake deposit and stake buffered amount can be retrieved by querying the staking contract state:
```
curl -d '{"id":"1", "jsonrpc": "2.0", "method": "GetSmartContractState", "params":["<staking_contract_address>"]}' -H "Content-Type: application/json" -X POST "https://api.zilliqa.com" 
```

In the response, under “ssnlist: {...}”, look for your staked seed node address. The first numeric value listed is the current stake deposit, and the second numeric value is the amount of accrued rewards.

Example of stake deposit for a particular ssn address:
```bash
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
           	"0" - stake buffered amount
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

**SDK sample code for getting stake buffered amount**
| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | [get_stake_buffered_amount.js](https://github.com/Zilliqa/staking-contract/blob/master/scripts/NodeJS/SSN-Operators/get_stake_buffered_amount.js) |
| Java     | [getStakeBufferedAmount()](https://github.com/Zilliqa/staking-contract/blob/12b9e594578429db5699e5f2e116c1ed825fca23/scripts/Java/src/main/java/com/zilliqa/staking/SSNOperator.java#L184) |


**SDK sample code for getting stake amount (non-buffered)**
| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | [get_stake_amount.js](https://github.com/Zilliqa/staking-contract/blob/master/scripts/NodeJS/SSN-Operators/get_stake_amount.js) |
| Java     | [getStakeAmount()](https://github.com/Zilliqa/staking-contract/blob/12b9e594578429db5699e5f2e116c1ed825fca23/scripts/Java/src/main/java/com/zilliqa/staking/SSNOperator.java#L180) |

## Withdrawal of stake deposit

### What happens when the stake deposit is withdrawn?

For partial withdrawal, you will need to ensure that your stake deposit is larger than the minimum stake amount (**10,000,000 ZIL**) in order for withdrawal to be successful.

For full withdrawal, with the rewards not yet fully withdrawn, your staked seed node will become inactive. It can be reactivated by doing another stake deposit into the contract.

For full withdrawal, with the rewards also fully withdrawn, your staked seed node will be removed from the list of staked seed nodes. The Zilliqa team will need to re-add your seed node into the contract should you wish to participate once again in staking.

### CLI way to withdraw stake deposit

**Zli command: withdraw_stake_amount**
```bash
zli contract call -a <proxy contract_address> -t withdraw_stake_amount -r "[{\"vname\":\"amount\",\"type\":\"Uint128\",\"value\":\"<amount>\"}]" -f true
```

Example:
```bash
zli contract call -a 0123456789012345678901234567890123456789 -t withdraw_stake_amount -r "[{\"vname\":\"amount\",\"type\":\"Uint128\",\"value\":\"500000000000\"}]" -f true
```

> **Note:** param “amount” here is expressed in Qa units (1 Zil = 1,000,000,000,000 Qa).

**SDK sample code**
| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | [withdraw_stake_amount.js](https://github.com/Zilliqa/staking-contract/blob/master/scripts/NodeJS/SSN-Operators/withdraw_stake_amount.js) |
| Java     | [withdrawStakeAmount()](https://github.com/Zilliqa/staking-contract/blob/12b9e594578429db5699e5f2e116c1ed825fca23/scripts/Java/src/main/java/com/zilliqa/staking/SSNOperator.java#L104) |

# Getting rewards

## How rewards are given

In order to be eligible for rewards, the staked seed node must satisfy all of the following criteria:
1. It must be recognized as an active staked seed node in the staking smart contract.
2. It must pass the checks for raw data storage requested by the Verifier.
3. It must pass the checks for servicing API requests by the Verifier.

Rewards are given once **every 15 DS epochs**. Over a period of a year, it is estimated that the staked seed node will receive approximately **10.42%** of the stake deposit as reward, if the staked seed node has an uptime of 100%. 

Rewards are not added to the stake deposit; they are stored separately from the stake deposit. When calculating the reward, the Verifier only takes the stake deposit into account. As such, there is **no “compounding” effect** for the rewards.

## Reward estimator utility
<!--
  <script src="/js/zilliqa-staking-calculator.js"></script>
  <div id="staking-calculator"></div>
-->
  
The reward estimator utility is accessible at https://zilliqa.github.io/staking-calculator-plugin/index.html



## Penalty for rewards

If the staked seed node did not achieve 100% uptime, the reward will be reduced proportionally based on the number of checks passed.

## CLI way to check current rewards

**Zli staking reward utility:**
```bash
zli staking rewards -s ssn_operator -c <proxy contract_address> -a api_endpoint
```

Example:
```bash
zli staking rewards -s 0x53e954391539f276c36a09167b795ab7e654fdb7 -c 343407558c9bb1f7ae737af80b90e1edf741a37a -a https://api.zilliqa.com
```

**SDK sample code**
| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | [get_stake_rewards.js](https://github.com/Zilliqa/staking-contract/blob/master/scripts/NodeJS/SSN-Operators/get_stake_rewards.js) |
| Java     | [getStakeRewards()](https://github.com/Zilliqa/staking-contract/blob/12b9e594578429db5699e5f2e116c1ed825fca23/scripts/Java/src/main/java/com/zilliqa/staking/SSNOperator.java#L188) |


# Withdrawing rewards 

## Withdraw reward process

The withdrawal of reward process is straightforward. The staked seed node operator will need to only invoke `withdraw_stake_rewards()` using the operator key, and the reward will be sent to the staked seed node operator address.

For reward withdrawal, with full stake amount already withdrawn, your staked seed node will be removed from the list of staked seed nodes.

## CLI way to withdraw current rewards

**zli command: withdraw_stake_rewards**
```bash
zli contract call -a <proxy contract_address> -t withdraw_stake_rewards -r "[]" -f true
```

Example:
```bash
zli contract call -a 0123456789012345678901234567890123456789 -t withdraw_stake_rewards -r "[]" -f true
```

**SDK sample code**
| Language | Link to sample code |
| -------- | ------------------- |
| NodeJS   | [withdraw_stake_rewards.js](https://github.com/Zilliqa/staking-contract/blob/master/scripts/NodeJS/SSN-Operators/withdraw_stake_rewards.js) |
| Java     | [withdrawStakeRewards()](https://github.com/Zilliqa/staking-contract/blob/master/scripts/Java/src/main/java/com/zilliqa/staking/SSNOperator.java#L104) |
