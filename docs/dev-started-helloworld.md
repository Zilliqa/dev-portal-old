---
id: dev-started-helloworld
title: Hello World
---

In this section, we will deploy and interact with a `Hello World` smart contract onto the zilliqa testnet using [Neo-Savant web IDE](https://ide.zilliqa.com/#/) and [ZilPay wallet](https://zilpay.xyz/).

## Create testnet wallet using ZilPay

ZilPay is an [open source](https://github.com/zilpay/zil-pay) browser add-on that manages a user’s Zilliqa wallet and can be used on the Chrome, Firefox and Opera browsers.
It does not store any user private keys on the server, instead they are password protected and stored on browser storage.
It is a non-custodial wallet, meaning, only the user has full access and responsibility for their private key.

To create a ZilPay wallet:
1) Visit ZilPay's [website](https://zilpay.xyz/) and download the extension for your respective browser.
2) Open the extension, create a new wallet by verifying your 12 word recovery phrase and selecting a password for your wallet.
3) Click on the network change button (shown below) and select network as testnet.

> Please store your 12 words recovery phrase securely

![Change Network Button](../assets/application/getting-started/zilpay-change-network-btn.png)

Voila! You have now successfully setup a testnet ZilPay wallet.

## Request Zilliqa testnet $ZIL from faucet

Dploy a contract to zilliqa's testnet will consume gas. As such you will need testnet $ZIL in your ZilPay account to pay for the gas.

To request for testnet $ZIL from the facuet,
1. Visit [Nucleus wallet testnet facuet](https://dev-wallet.zilliqa.com/faucet)
2. Enter and submit your ZilPay address to the facuet, you will receive 300 testnet $ZIL shortly. This will take about 30s to 1 min, as the transactions will need to be confirm on the blockchain.

![Nucleus Wallet Faucet](../assets/application/getting-started/nucleus-faucet.png)


## Deploying contract on testnet

To deploy the `Hello World` contract on zilliqa testnet, we will use the Scilla online IDE, [Neo-Savant IDE](https://ide.zilliqa.com/).<br/>

1) Change the network to testnet and import your wallet by loading the keystore file and enter the corresponding passphrase.

![IDE Step1](../assets/application/getting-started/neo-savant-step1.png)

2) Select the `Hello World` contract under the files tab and click on "Check" button to check to use the [typechecker](https://scilla.readthedocs.io/en/latest/scilla-checker.html) to check for any syntax errors in your contract.

![IDE Step2](../assets/application/getting-started/neo-savant-step2.png)

3) Once typechecker result is passed, click on "Deploy" button to deploy the contract to testnet. Use your own wallet address (Base61 format) for the "owner" initialisation parameter.

> To convert from `Bech32` address format into base16 address format, you can use the address converter in the IDE. Click on `Tools > Address coonverter`.

![IDE Step3](../assets/application/getting-started/neo-savant-step3.png)

Yay! Your contract is now deployed on the testnet and can be accessed under the "Contracts" tab on the left side of the IDE.


## Understanding the Hello World contract

The Hello World contract written in the scilla smart contract programming language essentially consists of two transitions. The transitions of a scilla contract define the public interface for the contract and are a way to define how the state of the contract may change.<br/>
The two transitions in the Hello World are:
1) `setHello()` - `setHello` transition updates the value of the mutable variable - 'welcomeMsg' to the value of the transition parameter.
```ocaml
transition setHello (msg : String)
  is_owner = builtin eq owner _sender;
  match is_owner with
  | False =>
    e = {_eventname : "setHello()"; code : not_owner_code};
    event e
  | True =>
    welcome_msg := msg;
    e = {_eventname : "setHello()"; code : set_hello_code};
    event e
  end
end

```

2) `getHello()` - `getHello` transition fetches the value of the mutable variable - 'welcomeMsg' and emits it as an entry of an emitted event.
```ocaml
transition getHello ()
    r <- welcome_msg;
    e = {_eventname: "getHello()"; msg: r};
    event e
end

```

## Front-end contract interaction using zilliqa-js

Let's interact with the `Hello World` contract using a simple front-end.

Clone the following repository and follow the installation steps: [Hello World Front-End](https://github.com/arnavvohra/dev-portal-examples/tree/master/hello-world).

```bash
git clone XXXXX
```

The above repository builds on the create-react-app starter kit. If you don't have experience working with React, this guide would still be useful for you as the zilliqa-js part of the code is pure javascript and you can use that as it is in the framework of your choice.

## Change contract state using ZilPay

After following the installation steps, you need to run the code locally by using the command
``` npm start ```

On succesfully running the web application locally on your system, enter the address of your Hello World contract deployed on the testnet and connect your ZilPay wallet with the front-end by clicking on the **Connect** button.

To call the transitions from the front-end using ZilPay:

1) `setHello()` - Upon clicking the **Set Hello** button and approving the transaction via ZilPay, the `setHello()` transition will be called and the value of the `welcomeMsg` mutable variable in the contract code will be updated with the new message.

The following code snippet achieves this functionality:

```javascript
async setHello(){
    if(window.zilPay.wallet.isEnable){
      this.updateWelcomeMsg();
    }
    else{
      const isConnect = await window.zilPay.wallet.connect();
      if (isConnect) {
        this.updateWelcomeMsg();
      } else {
      throw new Error('user rejected');
      }
    } 
  }

  async updateWelcomeMsg(){
    const zilliqa = window.zilPay;
    let setHelloValue = this.state.setHelloValue;
    let contractAddress = localStorage.getItem("contract_address");
    const CHAIN_ID = 333;
    const MSG_VERSION = 1;
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);   
    const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions
    contractAddress = contractAddress.substring(2);
    const ftAddr = toBech32Address(contractAddress);
    try {
        const contract = zilliqa.contracts.at(ftAddr);
        const callTx = await contract.call(
            'setHello',
            [
                {
                    vname: 'msg',
                    type: 'String',
                    value: setHelloValue
                }
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            }
        );
  
    } catch (err) {
        console.log(err);
    }
  }
```
2) `getHello()` - Upon clicking the 'Get Hello' button and approving the transaction via ZilPay, the `getHello()` transition will called and the value of the `welcomeMsg` mutable variable is emitted as part of an event.

We will use the Zilliqa WebSocket Server (ZWS) that initiates a subscription for all new event logs generated for our Hello World contract. This allows us to update the Welcome Msg on the web application as soon as the `getHello()` transaction gets confirmed and an event is emitted.

The following code snippet achieves this functionality:

```javascript
  async getHello(){
    if(window.zilPay.wallet.isEnable){
      this.getWelcomeMsg();
    }
    else{
      const isConnect = await window.zilPay.wallet.connect();
      if (isConnect) {
        this.getWelcomeMsg();
      } else {
      throw new Error('user rejected');
      }
    } 
  }

  async getWelcomeMsg(){
    
    const zilliqa = window.zilPay;
    let contractAddress = localStorage.getItem("contract_address");
    const CHAIN_ID = 333;
    const MSG_VERSION = 1;
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);   
    const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions
    contractAddress = contractAddress.substring(2);
    const ftAddr = toBech32Address(contractAddress);
    try {
        const contract = zilliqa.contracts.at(ftAddr);
        const callTx = await contract.call(
            'getHello',
            [
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            }
        );
        console.log(JSON.stringify(callTx.TranID));
        this.eventLogSubscription();

  
    } catch (err) {
        console.log(err);
    }

  }


  async eventLogSubscription() {
    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
      'wss://dev-ws.zilliqa.com',
      {
        // smart contract address you want to listen on  
        addresses: [
          this.state.contractAddress
        ],
      },
    );
    
    subscriber.emitter.on(StatusType.SUBSCRIBE_EVENT_LOG, (event) => {
      // if subscribe success, it will echo the subscription info
      console.log('get SubscribeEventLog echo : ', event);
    });
    
    subscriber.emitter.on(MessageType.EVENT_LOG, (event) => {
      // updating the welcome msg when a new event log is received related to getHello() transition
      if(event.hasOwnProperty("value")){
        if(event.value[0].event_logs[0]._eventname =="getHello()"){
          let welcomeMsg = event.value[0].event_logs[0].params[0].value;
          this.setState({welcomeMsg: welcomeMsg});
          console.log("welcomeMsg", welcomeMsg);
        }
      }
    });  
    await subscriber.start();
  }
```

## View receipt on Viewblock explorer
[Viewblock explorer](https://viewblock.io/zilliqa?network=testnet) is a block explorer that support both Zilliqa mainnet and testnet. It allows you to look at the status of your transaction, current status of the zilliqa network, contract source code etc.

For example, this is the viewblock [transaction link](https://viewblock.io/zilliqa/tx/c4030c73d6dae558ff0c9d98237101e342888115f13219a00bb14a8ee46fa3be?network=testnet) for a getHello() transition transaction.
