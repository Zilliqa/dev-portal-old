---
id: dev-keys-zilpay
title: ZilPay
keywords:
  - key management
  - zilpay
  - detect
  - connect
  - browser extension
  - wallet
  - access acounts
  - api
  - zilliqa
description: Zilpay Zilliqa Browser Extension Wallet
---

---

ZilPay is an [open source](https://github.com/zilpay/zil-pay) browser add-on that manages a user’s Zilliqa wallet and can be used on Chrome, Firefox and Opera browsers.
It does not store any user's private keys on a remote server. Instead they are password protected and stored on browser storage.
It is a non-custodial wallet, meaning, the user has full access and responsibility for their private key.

## Detecting ZilPay

ZilPay injects a global API into websites visited by its users at
`window.zilPay`. This API allows websites to request user login, load data from the blockchain and prompt the user to sign messages and transactions.

To check if the user has ZilPay installed, here is a sample code

```typescript
(typeof window.zilPay !== 'undefined') { /* do something */ }
```

## Connecting Your dApp With ZilPay

You need to ask once for the user's permission to connect your dApp to their ZilPay wallet. The following is a sample code for requesting the permission

```typescript
window.zilPay.wallet.connect();
```

This is a promise-returning method that resolves with a `Boolean` value. `true` value indicates that the user accepts your connect request and `false` value indicates rejection.

## Accessing User Accounts

Once you have connected to a user's ZilPay wallet, you can check the current account information through `window.zilPay.wallet.defaultAccount`.

If you will like to be notified when the user changes the account or network, you can subscribe to relevant events

```typescript
window.zilPay.wallet.observableAccount().subscribe(function (account) {
  // ... When the user changes account
});
window.zilPay.wallet.observableNetwork().subscribe(function (net) {
  // ... When the user changes network
});
```

## API Reference

ZilPay provides a set of documentation for your references

- [Zilpay - Getting Started](https://zilpay.github.io/zilpay-docs/getting-started/#getting-started)
