---
id: dev-tools-gozilliqa
title: gozilliqa
keywords:
  - go
  - gozilliqa
  - sdk
  - installation
  - apis
  - examples
  - zilliqa
description: gozilliqa
---

---

## Introduction

[gozilliqa](https://github.com/Zilliqa/gozilliqa-sdk) is a Golang library for interacting with the Zilliqa network. It can create wallets, deploy contracts, and invoke transitions to interact with smart contracts on the Zilliqa network.

## Source Code

The github repository can be found at [https://github.com/Zilliqa/gozilliqa-sdk](https://github.com/Zilliqa/gozilliqa-sdk)

## Releases

All releases of gozilliqa can be found at [https://github.com/Zilliqa/gozilliqa-sdk/releases](https://github.com/Zilliqa/gozilliqa-sdk/releases)

## Getting gozilliqa

Run the following to clone the repository to your local machine

```
git clone https://github.com/Zilliqa/gozilliqa-sdk.git
```

> If you wish to use the release version, please switch your branch to the particular release version. You can find out more information about the releases at [https://github.com/Zilliqa/gozilliqa-sdk/releases](https://github.com/Zilliqa/gozilliqa-sdk/releases)

## Installation

This SDK is using `go mod` to manager it's dependent libraries, so if you do want to work on the source code of this repository, make sure you have the minimal `golang` version that supports `go mod` and enable it.

Install the dependent libraries:

```go
go get ./...
```

The SDK itself cannot be built into a binary as it does not contains any `main` function, you can directly add it to your own project as a library. Also, we recommend that you can run the `golang uint test` or go through
the section `quick start` first to get a basic understanding before you start to use this SDK.

## Methods and APIs

##### Account API

- fromFile
- toFile
- newHDAccount (with default derivation path "m/44'/313'/0'/0/${index}")
- newHDAccountWithDerivationPath

##### Wallet API

- createAccount
- addByPrivateKey addByKeyStore
- remove
- setDefault
- signTransaction (default account)
- signTransactionWith (specific account)

##### TransactionFactory Transaction

- sendTransaction
- trackTx
- confirm
- isPending isInitialised isConfirmed isRejected

##### ContractFactory Contract

- deploy
- call
- isInitialised isDeployed isRejected
- getState
- getAddressForContract

##### Crypto API

- getDerivedKey (PBKDF2 and Scrypt)
- generatePrivateKey
- Schnorr.sign
- Schnorr.verify
- getPublicKeyFromPrivateKey
- getAddressFromPublicKey
- getAddressFromPrivateKey
- encryptPrivateKey
- decryptPrivateKey

##### JSON-RPC API

Blockchain-related methods

- getNetworkId
- getBlockchainInfo
- getShardingStructure
- getDsBlock
- getLatestDsBlock
- getNumDSBlocks
- getDSBlockRate
- getDSBlockListing
- getTxBlock
- getLatestTxBlock
- getNumTxBlocks
- getTxBlockRate
- getTxBlockListing
- getNumTransactions
- getTransactionRate
- getCurrentMiniEpoch
- getCurrentDSEpoch
- getPrevDifficulty
- getPrevDSDifficulty

Transaction-related methods

- createTransaction
- getTransaction
- getRecentTransactions
- getTransactionsForTxBlock
- getNumTxnsTxEpoch
- getNumTxnsDSEpoch
- getMinimumGasPrice

Contract-related methods

- getSmartContractCode
- getSmartContractInit
- getSmartContractState
- getSmartContracts
- getContractAddressFromTransactionID

Account-related methods

- getBalance

##### Validation

- isAddress
- isPublicjKey
- isPrivateKey
- isSignature

##### Util

- byteArrayToHexString
- hexStringToByteArray
- generateMac
- isByteString
- encodeTransactionProto
- toChecksumAddress
- isValidChecksumAddress
- bech32 encode decode
- isBech32
- fromBech32Address toBech32Address

## Demo

Golang code for zilliqa-js methods found in [ZRC-2 Wallet Repository](https://github.com/arnavvohra/dev-portal-examples/tree/master/zrc-2-wallet)

##### Decrypt Private Key from a Keystore File

```go
func TestKeystore_DecryptPrivateKey(t *testing.T) {
	json := "{\"address\":\"b5c2cdd79c37209c3cb59e04b7c4062a8f5d5271\",\"id\":\"979daaf9-daf1-4002-8656-3cea134c9518\",\"version\":3,\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"26be10cdae0f397bdeead38e7fcc179957dd5e7ef95a1f0f53f37b7ad1355159\",\"kdf\":\"pbkdf2\",\"mac\":\"81d8e60bc08237e4ba154c0b27ad08562821d8c602ee8a492434128de48b66bc\",\"cipherparams\":{\"iv\":\"fc714ad6267c35a2df4cb3f8b8b3cc0d\"},\"kdfparams\":{\"n\":8192,\"c\":262144,\"r\":8,\"p\":1,\"dklen\":32,\"salt\":\"e22ef8a67a59299cee1532b6c6967bdfb0e75ca3c5dff852f9d8daa04683b0c1\"}}}"

	ks := NewDefaultKeystore()
	privateKey, err := ks.DecryptPrivateKey(json, "xiaohuo")
	if err != nil {
		t.Error(err.Error())
	} else {
		if strings.Compare(strings.ToLower(privateKey), "24180e6b0c3021aedb8f5a86f75276ee6fc7ff46e67e98e716728326102e91c9") != 0 {
			t.Error("decrypt private key failed")
		}
	}
}
```

#### Get User's $Zil Balance

```go
func TestGetBalance() {
    provider := NewProvider("https://dev-api.zilliqa.com/")
    response := provider.GetBalance("9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a")
    result, _ := json.Marshal(response)
    fmt.Println(string(result))
}
```

##### Send a Transfer Transaction

```go
func TestSendTransaction(t *testing.T) {
	if os.Getenv("CI") != "" {
		t.Skip("Skipping testing in CI environment")
	}
	wallet := NewWallet()
	wallet.AddByPrivateKey("e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930")
	provider := provider2.NewProvider("https://dev-api.zilliqa.com/")

	gasPrice, err := provider.GetMinimumGasPrice()
	assert.Nil(t, err, err)

	tx := &transaction.Transaction{
		Version:      strconv.FormatInt(int64(util.Pack(333, 1)), 10),
		SenderPubKey: "0246E7178DC8253201101E18FD6F6EB9972451D121FC57AA2A06DD5C111E58DC6A",
		ToAddr:       "4BAF5faDA8e5Db92C3d3242618c5B47133AE003C",
		Amount:       "10000000",
		GasPrice:     gasPrice,
		GasLimit:     "50",
		Code:         "",
		Data:         "",
		Priority:     false,
	}

	err2 := wallet.Sign(tx, *provider)
	assert.Nil(t, err2, err2)

	rsp, err3 := provider.CreateTransaction(tx.ToTransactionPayload())
	assert.Nil(t, err3, err3)
	assert.Nil(t, rsp.Error, rsp.Error)

	resMap := rsp.Result.(map[string]interface{})
	hash := resMap["TranID"].(string)
	fmt.Printf("hash is %s\n", hash)
	tx.Confirm(hash, 1000, 3, provider)
	assert.True(t, tx.Status == core.Confirmed)
}
```
