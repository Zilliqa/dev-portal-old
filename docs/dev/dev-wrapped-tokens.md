---
id: dev-wrapped-tokens
title: Wrapped Tokens
keywords:
  - wrapped
  - assets
  - wzil
  - wbtc
  - weth
description: wZIL
---

---

## Wrapped Tokens
Currently, a majority of blockchains can only read and write data to the native chain, this limits blockchain interoperability. With greater interoperability, users and developers can benefit from cross-chain ecosystem offerings. 

A wrapped token is a tokenized version of a cryptocurrency. Wrapped tokens are exchangable and are pegged to the value of the asset they derive from (1BTC = 1 zWBTC). Wrapped Tokens on Zilliqa implement the ZRC-2 Fungible Token standard. The backing asset is deposited in a smart contract called a "Wrapper" and users are returned a wrapped version of the backing asset. It's notable to mention that native wrappers are inherently "trustless" and do not need to rely on a third party for the contract to function. 

When bridging cross-chain, trusted custodians entities take a deposit of native tokens (ETH) and mint a non-native wrapped version of the asset (zWETH) on the destination chain. 

The standard naming convention of non native wrapped assets on Zilliqa is "zW". Developers may choose to consume wZIL instead of ZIL in their smart contracts as it already provides standard ZRC-2 transitions.

## wZIL

wZIL is a wrapped tokenised version of native ZIL. Developers may choose to consume in their contracts "wZIL" if they so choose.
The wZil contract exposes ZRC-2 compliant transitions names. Users are able to call "Mint" with an amount of ZIL, LI or QA and have an equal amount of wZIL returned to them. Similarly when calling "Burn" the contract returns an amount of ZIL, LI or QA equal to the amount burnt to the user calling. The example below shows the Mint and Burn implementation of wrapping and unwrapping wZIL.

<br />

```ocaml
transition Mint()
  accept; (* Contract accepts all deposits made to it *)
  AuthorizedMint _sender _amount;    (* Mints _amount of wZIL to _sender *)
  ...
end

transition Burn(amount: Uint128)
  AuthorizedBurnIfSufficientBalance _sender amount;    (* Burns amount *)
  msg_to_sender = {_tag : "AddFunds"; _recipient : _sender; _amount : amount};    (* Returns _amount of ZIL to _sender *)
  ...
end
```

<br />

## How to wrap/unwrap wZIL

|               | Contract Address                                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Mainnet wZIL  | [`zil1gvr0jgwfsfmxsyx0xsnhtlte4gks6r3yk8x5fn`](https://viewblock.io/zilliqa/address/zil1gvr0jgwfsfmxsyx0xsnhtlte4gks6r3yk8x5fn)                 |
| Testnet wZIL  | [`zil1nzn3k336xwal7egdzgalqnclxtgu3dggxed85m`](https://viewblock.io/zilliqa/address/zil1nzn3k336xwal7egdzgalqnclxtgu3dggxed85m?network=testnet) |

<br />

 [`Pillar Protocol`](https://app.pillarprotocol.com/vaultFactory/WZIL) has an interface which can be used to wrap ZIL or unwrap wZIL. 
Users can interact directly with the wZIL contract from the web interface.

<br />

<b>  </b>

![Docusaurus](/img/dev/wzil/pillar_wzil.png)

<br /> 

<hr />

Users may choose to manually wrap or unwrap ZIL manually from the wrapper contract. To wrap or unwrap tokens, firstly import the wZIL contract to the IDE.

<b> Open the import contract window and import the wZIL contract </b>

![Docusaurus](/img/dev/wzil/import_contract_1.png)

<br />

<b> Call Mint with the QA amount of ZIL required to be wrapped. </b>

![Docusaurus](/img/dev/wzil/mint_wzil_1.png)

<b> Successful mint of wZIL in exchange for ZIL. </b>

![Docusaurus](/img/dev/wzil/mint_wzil_2.png)

<br />

<b> Having a wZIL token, call burn with the amount as a parameter.</b>

![Docusaurus](/img/dev/wzil/burn_wzil_1.png)

<b> Note the internal transaction returning ZIL from the wrapper in exchange for an equal burn of wZIL.</b>

![Docusaurus](/img/dev/wzil/burn_wzil_2.png)
