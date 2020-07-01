---
id: dev-keys-zilpay
title: ZilPay
---

ZilPay is an [open source](https://github.com/zilpay/zil-pay) browser add-on that manages a user’s Zilliqa wallet and can be used on the Chrome, Firefox and Opera browsers.
It does not store any user private keys on the server, instead they are password protected and stored on browser storage.
It is a non-custodial wallet, meaning, the user has full access and responsibility for their private key. 

## Detecting ZilPay

ZilPay injects a global API into websites visited by its users at 
    ```window.zilPay```. This API allows websites to request user login, load data from the blockchain and prompt the user to sign messages and transactions.

So, to check if the user has ZilPay installed, the following would work : <br/> ```(typeof window.zilPay !== 'undefined') { /* do something */ }```


## Connecting Your Dapp With ZilPay
You need to ask once for user's permission to connect your dapp to their ZilPay wallet. Following code achieves the same :
```
window.zilPay.wallet.connect()
```
This is a promise-returning method that resolves with a Boolean value, true if user accepts your connect request and false in case of rejection. 

## Accessing User Accounts
Once you’ve connected to a user's ZilPay wallet, you can check the current account through ```window.zilPay.wallet.defaultAccount```.

If you'd like to be notified when the user changes the account or network, you can subscribe to relevant events :
```
window.zilPay.wallet.observableAccount().subscribe(function (account) {
    // ... When the user changes account
});
window.zilPay.wallet.observableNetwork().subscribe(function (net) {
    // ... When the user changes network
});
```

## API Reference

ZilPay API reference can be found [here](https://zilpay.xyz/Documentation/zilliqa-provider/). <br/>
[Blockchain related APIs](https://zilpay.xyz/Documentation/zilliqa-api-blockchain/)<br/>
[Crypto related APIs](https://zilpay.xyz/Documentation/zilliqa-api-crypto/)<br/>
[Utils related APIs](https://zilpay.xyz/Documentation/zilliqa-api-utils/)<br/>
[Contract related APIs](https://zilpay.xyz/Documentation/zilliqa-contracts/)