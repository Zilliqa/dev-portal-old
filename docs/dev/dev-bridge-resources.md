---
id: dev-bridge-resources
title: Bridge Resources
keywords:
  - bridge
  - wrapped
  - assets
  - wzil
  - wbtc
  - weth
description: Resources about the Bridge
---

---

The following section describes the functional interoperability benefits following recent protocol and language upgrades to support the ETH-ZIL bridge.  Bridges allow for assets to be moved from one blockchain to another. Allowing assets to be distributed across different blockchains increases the interoperability of the asset. This article discusses a range of technologies that are now available for developers and users to use.  

## How To Bridge Assets to/from ETH
In the initial phase of the bridge launch, a select pool of ERC-20 assets will be supported for users to bridge to Zilliqa Mainnet. Users may choose to move these selected assets across the ETH-ZIL bridge. Please consult the Switcheo documentation at https://docs.zilswap.io/how-to/zilbridge for related infomation. 

## Wrapped Tokens
Currently, a majority of blockchains can only read and write data to the native chain, this limits blockchain interoperability. With greater interoperability, users and developers can benefit from cross-chain ecosystem offerings. 

A wrapped token is a tokenized version of a cryptocurrency. Wrapped tokens are exchangable and are pegged to the value of the asset they derive from (1BTC = 1WBTC). Wrapped Tokens on Zilliqa implement the ZRC-2 Fungible Token standard. The backing asset is deposited in a smart contract called a "Wrapper" and users are returned a wrapped version of the backing asset. It's notable to mention that native wrappers are inherently "trustless" and do not need to rely on a third party for the contract to function. 

When bridging cross-chain, trusted custodians entities take a deposit of native tokens (ETH) and mint a non-native wrapped version of the asset (wETH) on the destination chain. 

wZIL is a wrapped tokenised version of native ZIL. Developers may choose to consume in their contracts "wZIL" if they so choose.
The wZil contract exposes ZRC-2 compliant transitions names. Users are able to call "Mint" with an amount of ZIL, LI or QA and have an equal amount of wZIL returned to them. Similarly when calling "Burn" the contract returns an amount of ZIL, LI or QA equal to the amount burnt to the user calling. The example below shows the Mint and Burn implementation of wrapping and unwrapping wZIL. The wZIL contract is a trustless 

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

|               | Contract Address                           |
| ------------- | ------------------------------------------ |
| Mainnet wZIL  | zil1gvr0jgwfsfmxsyx0xsnhtlte4gks6r3yk8x5fn |
| Testnet wZIL  | zil1nzn3k336xwal7egdzgalqnclxtgu3dggxed85m |

<br />

Users may be asked to provide wrapped tokens to use specific dapps or want to unwrap tokens they have previously wrapped. If users wish to wrap or unwrap tokens, they can interact directly with the wZIL contract. To wrap or unwrap tokens, firstly import the wZIL contract to the IDE

<b> Open the import contract window and import the wZIL contract </b>

![Docusaurus](/img/dev/wzil/import_contract_1.png)

<br /><br /> 

<b> Call Mint with the QA amount of ZIL required to be wrapped. </b>

![Docusaurus](/img/dev/wzil/mint_wzil_1.png)

<b> Successful mint of wZIL in exchange for ZIL. </b>

![Docusaurus](/img/dev/wzil/mint_wzil_2.png)

<br /> <br /> 

<b> Having a wZIL token, call burn with the amount as a parameter (not _amount)</b>

![Docusaurus](/img/dev/wzil/burn_wzil_1.png)

<b> Note the internal transaction returning ZIL from the wrapper in exchange for an equal burn of wZIL</b>

![Docusaurus](/img/dev/wzil/burn_wzil_2.png)
