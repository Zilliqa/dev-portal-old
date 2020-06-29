---
id: dev-started-helloworld
title: Hello World
---

In this section, we'll deploy a "Hello World" contract to the zilliqa blockchain and interact with it using a simple front-end.

## Create testnet wallet using zilPay

Zilpay is an [open source](https://github.com/zilpay/zil-pay) browser add-on that manages a user’s Zilliqa wallet and can be used on the Chrome, Firefox and Opera browsers.
It does not store any user private keys on the server, instead they are password protected and stored on browser storage.
It is a non-custodial wallet, meaning, the user has full access and responsibility for their private key. 

Steps to create a testnet zilpay wallet:
1) Visit Zilpay's [website](https://zilpay.xyz/) and download the extension for your respective browser.
2) Open the extension, create a new wallet by verifying your 12 word recovery phrase and selecting a password for your wallet.
3) Click on the network change button (shown below) and select network as testnet. 

![Change Network Button](../assets/application/getting-started/zilpay-change-network-btn.png)

Voila! You have successfully setup a testnet zilpay wallet.


## Request testnet zil from faucet

In order to deploy a contract to zilliqa's testnet, we need testnet zil in our zilpay account.<br/>
Copy your zilpay address and enter the same on nucleus wallet's [faucet website](https://dev-wallet.zilliqa.com/faucet), you'll receive 300 testnet zil as a result.
![Nucleus Wallet Faucet](../assets/application/getting-started/nucleus-faucet.png)


## Deploy contract on testnet

To deploy our contract on zilliqa testnet, we will use the [online scilla IDE](https://ide.zilliqa.com/).<br/>
Steps to deploy "Hello World" contract using the IDE:
1) Change the network to testnet and import your wallet by loading the keystore file and it's corresponding passphrase.

![IDE Step1](../assets/application/getting-started/neo-savant-step1.png)

2) Select the Hello World contract under the files tab and click on "Check" button to check for any errors in your contract.

![IDE Step2](../assets/application/getting-started/neo-savant-step2.png)

3) When you succesfully pass the Scilla checker, click on "Deploy" button to deploy the contract to testnet. Use your own wallet address (ByStr20 format) for the "owner" initialisation parameter.

![IDE Step3](../assets/application/getting-started/neo-savant-step3.png)

Yay! Your contract is now deployed on the testnet and can be accessed under the "Contracts" tab on the left side of the ide.


## Understanding the Hello World contract

The Hello World contract written in the scilla smart contract programming language essentially consists of two transitions. The transitions of a scilla contract define the public interface for the contract and are a way to define how the state of the contract may change.<br/>
The two transitions in the Hello World are:
1) setHello() - setHello transition updates the value of the mutable variable - 'welcomeMsg' to the value of the transition parameter.
2) getHello() - getHello transition fetches the value of the mutable variable - 'welcomeMsg' and emits it as an entry of an emitted event.

## Front-end contract interaction using zilliqa-js

Let's move on to the part where we interact with the Hello World contract using a simple front-end.<br/>
Clone the following repository and follow the installation steps: [Hello World Front-End](https://github.com/arnavvohra/dev-portal-examples/tree/master/hello-world).<br/>
The above repository builds on the create-react-app starter kit and is very easy to follow. If you don't have experience working with React, this guide would still be useful for you as the zilliqa-js part of the code is pure javascript and you can use that as it is in the framework of your choice. 

## Change contract state using Zilpay

After following the installation steps, you need to run the code locally by using the command
``` npm start ```<br/>
On succesfully running the site locally on your system, enter the address of your Hello World contract deployed on the testnet and connect your zilpay wallet with the front-end by clicking on the 'Connect' button.

Calling the transitions from the front-end using zilpay:
1) setHello() - On clicking the 'Set Hello' button and after approving the transaction on Zilpay, the setHello() transition is called and the value of the welcomeMsg mutable variable is updated. Following is the code snippet that achieves this functionality:

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
2) getHello() - On clicking the 'Get Hello' button and after approving the transaction on Zilpay, the getHello() transition is called and the value of the welcomeMsg mutable variable is emitted as part of an event.<br/> 
We use the Zilliqa WebSocket Server (ZWS) with the query for event log that initiates a subscription for all the event logs generated for our Hello World contract. This allows us to update the Welcome Msg on screen as soon as the getHello() transaction gets confirmed and an event is emitted.


Following is the code snippet that achieves this functionality:

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
[Viewblock explorer](https://viewblock.io/zilliqa?network=testnet) allows you to look at the status of your transaction, current status of the zilliqa network, contract source code etc. For example, this is the viewblock [transaction link](https://viewblock.io/zilliqa/tx/c4030c73d6dae558ff0c9d98237101e342888115f13219a00bb14a8ee46fa3be?network=testnet) for a getHello() transition transaction.
Viewblock supports both Zilliqa testnet and mainnet.
