---
id: dev-txn-broadcasting
title: Broadcasting
---
After signing the transaction, we may broadcast the transaction to a seed node (e.g. https://dev-api.zilliqa.com) by creating a transaction object. The correct RPC API to use is `CreateTransaction`. 
Refer to https://apidocs.zilliqa.com/#createtransaction for more information.

The seed node performs some basic validation of the JSON payload it receives, and will attempt to verify the signature. Please note that it does not verify the correctness of the `nonce`. It is at all times the developer's responsiblity to correctly increment the nonce used in the transaction.

If `nonce` is incorrect, the transaction can silently fail. This means that the seed/lookup node will blindly forward the transaction to the correct shard, which may then reject the transaction with no error receipt.

__Note:__ The above applies only if we use JSON RPC API to create the transaction object. If SDKs are used to create the transaction object, then `nonce` management is not an issue as SDKs would automatically handle the nonce management.

## Non-Contract Transaction Object
Example of creating a __non-contract__ transaction object:

<!--DOCUSAURUS_CODE_TABS-->

<!--JavaScript-->

```javascript
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { getAddressFromPrivateKey } = require('@zilliqa-js/crypto');
const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");

const PRIVATE_KEY = '9afc1a1dab96127e902daaaec1a56c30346f007523c787c3bb62371c0e5a1be7';

async function main() {
    try {
        zilliqa.wallet.addByPrivateKey(PRIVATE_KEY);

        let tx = zilliqa.transactions.new({
            version: 65537,
            toAddr: "0x1234567890123456789012345678901234567890",
            amount: units.toQa("1000", units.Units.Li),
            gasLimit: Long.fromNumber(1),
        });
        tx = await zilliqa.blockchain.createTransaction(tx);
        console.log(tx.id);
    
    } catch (err) {
        console.log(err);
    }

}

main();

```

<!--Go-->

```go
package main

import (
	"fmt"
	"github.com/Zilliqa/gozilliqa-sdk/account"
	provider2 "github.com/Zilliqa/gozilliqa-sdk/provider"
	"github.com/Zilliqa/gozilliqa-sdk/transaction"
	"github.com/Zilliqa/gozilliqa-sdk/util"
	"strconv"
)

func main() {
	
	wallet := account.NewWallet()
	wallet.AddByPrivateKey("e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930")
	provider := provider2.NewProvider("https://dev-api.zilliqa.com/")

	gasPrice, _ := provider.GetMinimumGasPrice()

	tx := &transaction.Transaction{
		Version:      strconv.FormatInt(int64(util.Pack(333, 1)), 10),
		SenderPubKey: "0246E7178DC8253201101E18FD6F6EB9972451D121FC57AA2A06DD5C111E58DC6A",
		ToAddr:       "4BAF5faDA8e5Db92C3d3242618c5B47133AE003C",
		Amount:       "10000000",
		GasPrice:     gasPrice,
		GasLimit:     "1",
		Code:         "",
		Data:         "",
		Priority:     false,
	}

	_ = wallet.Sign(tx, *provider)

	rsp, _ := provider.CreateTransaction(tx.ToTransactionPayload())

	resMap := rsp.Result.(map[string]interface{})
	hash := resMap["TranID"].(string)
	fmt.Printf("hash is %s\n", hash)
	tx.Confirm(hash, 1000, 3, provider)
}
```

<!--Java-->

```java
package com.firestack.example;

import com.firestack.laksaj.account.Wallet;
import com.firestack.laksaj.contract.Contract;
import com.firestack.laksaj.contract.ContractFactory;
import com.firestack.laksaj.contract.DeployParams;
import com.firestack.laksaj.contract.Value;
import com.firestack.laksaj.jsonrpc.HttpProvider;
import com.firestack.laksaj.transaction.Transaction;
import com.firestack.laksaj.transaction.TransactionFactory;
import javafx.util.Pair;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;

import static com.firestack.laksaj.account.Wallet.pack;

public class TransactionOperation {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException {
        Wallet wallet = new Wallet();
        String ptivateKey = "e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930";
        // Populate the wallet with an account
        String address = wallet.addByPrivateKey(ptivateKey);
        System.out.println("address is: " + address);

        HttpProvider provider = new HttpProvider("https://api.zilliqa.com");
        //get balance
        HttpProvider.BalanceResult balanceResult = provider.getBalance(address);
        System.out.println("balance is: " + balanceResult.getBalance());

        //construct non-contract transaction
        Transaction transaction = Transaction.builder()
                .version(String.valueOf(pack(333, 1)))
                .toAddr("zil16jrfrs8vfdtc74yzhyy83je4s4c5sqrcasjlc4")
                .senderPubKey("0246e7178dc8253201101e18fd6f6eb9972451d121fc57aa2a06dd5c111e58dc6a")
                .amount("10000000")
                .gasPrice("1000000000")
                .gasLimit("1")
                .code("")
                .data("")
                .provider(new HttpProvider("https://api.zilliqa.com/"))
                .build();

        //sign transaction
        transaction = wallet.sign(transaction);
        System.out.println("signature is: " + transaction.getSignature());

        //broadcast transaction
        HttpProvider.CreateTxResult result = TransactionFactory.sendTransaction(transaction);
    }
}
```


<!--DOCUSAURUS_CODE_TABS-->

## Contract Transaction Object
The following is an example of creating a __contract__ transaction object. The difference between __contract__ and __non-contract__ transaction objects is the additional contract transitions such as `setHello` and its relevant params such as the `vname`, `type` and `value` as describe in the deployed contract.
The other significant difference is the `gasLimit` field. For __contract__ transaction objects, the recommended `gasLimit` is between `10000` to `30000`.

Example of creating a __contract__ transaction object:

<!--DOCUSAURUS_CODE_TABS-->

<!--JavaScript-->


```javascript
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { toBech32Address, getAddressFromPrivateKey } = require('@zilliqa-js/crypto');

const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");
const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);

const PRIVATE_KEY = '9afc1a1dab96127e902daaaec1a56c30346f007523c787c3bb62371c0e5a1be7';
const CONTRACT_ADDR = toBech32Address('0x1234567890123456789012345678901234567890'); // convert to bech32 format

async function main() {
    try {
        zilliqa.wallet.addByPrivateKey(PRIVATE_KEY);
        const deployedContract = zilliqa.contracts.at(CONTRACT_ADDR);
        const callTx = await deployedContract.call(
            'setHello',
            [
                {
                    vname: 'msg',
                    type: 'String',
                    value: "hello world!"
                }
            ],
            {
                version: VERSION,
                amount: new BN(0),
                gasPrice: units.toQa("1000", units.Units.Li)
                gasLimit: Long.fromNumber(10000)
            }
        );

        console.log("transaction: %o", callTx.id);
        console.log(JSON.stringify(callTx.receipt, null, 4));
    
    } catch (err) {
        console.log(err);
    }

}

main();
```

<!--Go-->


```go
package main

import (
	"github.com/Zilliqa/gozilliqa-sdk/account"
	contract2 "github.com/Zilliqa/gozilliqa-sdk/contract"
	"github.com/Zilliqa/gozilliqa-sdk/core"
	"github.com/Zilliqa/gozilliqa-sdk/keytools"
	provider2 "github.com/Zilliqa/gozilliqa-sdk/provider"
	"github.com/Zilliqa/gozilliqa-sdk/util"
	"strconv"
)

func main() {
	host := "https://dev-api.zilliqa.com/"
	privateKey := "e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930"
	chainID := 333
	msgVersion := 1

	publickKey := keytools.GetPublicKeyFromPrivateKey(util.DecodeHex(privateKey), true)
	address := keytools.GetAddressFromPublic(publickKey)
	pubkey := util.EncodeHex(publickKey)
	provider := provider2.NewProvider(host)

	wallet := account.NewWallet()
	wallet.AddByPrivateKey(privateKey)

	contract := contract2.Contract{
		Address:  "bd7198209529dC42320db4bC8508880BcD22a9f2",
		Signer:   wallet,
		Provider: provider,
	}

	args := []core.ContractValue{
		{
			"msg",
			"String",
			"hello world",
		},
	}

	balAndNonce, _ := provider.GetBalance(address)
	n := balAndNonce.Nonce + 1
	gasPrice, _ := provider.GetMinimumGasPrice()

	params := contract2.CallParams{
		Nonce:        strconv.FormatInt(n, 10),
		Version:      strconv.FormatInt(int64(util.Pack(chainID, msgVersion)), 10),
		GasPrice:     gasPrice,
		GasLimit:     "10000",
		SenderPubKey: pubkey,
		Amount:       "0",
	}

	tx, _ := contract.Call("setHello", args, params, true)
	tx.Confirm(tx.ID, 1000, 3, provider)

}
```

<!--Java-->


```java
package com.firestack.example;

import com.firestack.laksaj.account.Wallet;
import com.firestack.laksaj.contract.Contract;
import com.firestack.laksaj.contract.ContractFactory;
import com.firestack.laksaj.contract.DeployParams;
import com.firestack.laksaj.contract.Value;
import com.firestack.laksaj.jsonrpc.HttpProvider;
import com.firestack.laksaj.transaction.Transaction;
import com.firestack.laksaj.transaction.TransactionFactory;
import javafx.util.Pair;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;

import static com.firestack.laksaj.account.Wallet.pack;

public class TransactionOperation {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException {
        List<Value> init = Arrays.asList();
        Wallet wallet = new Wallet();
        String ptivateKey = "e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930";
        ContractFactory factory = ContractFactory.builder().provider(new HttpProvider("https://dev-api.zilliqa.com/")).signer(wallet).build();
        Contract contract = factory.atContract("zil1h4cesgy498wyyvsdkj7g2zygp0xj920jw2hyx0", "", (Value[]) init.toArray(), "");
        Integer nonce = Integer.valueOf(factory.getProvider().getBalance("9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a").getResult().getNonce());
        CallParams params = CallParams.builder().nonce(String.valueOf(nonce + 1)).version(String.valueOf(pack(333, 1))).gasPrice("1000000000").gasLimit("10000").senderPubKey("0246e7178dc8253201101e18fd6f6eb9972451d121fc57aa2a06dd5c111e58dc6a").amount("0").build();
        List<Value> values = Arrays.asList(Value.builder().vname("msg").type("String").value("hello world").build());
        contract.call("setHello", (Value[]) values.toArray(), params, 3000, 3);
    }
}
```

<!--END_DOCUSAURUS_CODE_TABS-->