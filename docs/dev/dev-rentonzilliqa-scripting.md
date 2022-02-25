---
id: dev-rentonzilliqa-scripting
title: Scripting
keywords:
  - scripting
  - rentonzilliqa
  - scilla
description: Connecting the RentOnZillqa frontend application with the Scilla contract
---

---

In this section, we prepare the TypeScript for connecting the frontend with the Scilla contract. As discussed, we use [ZilPay](https://zilpay.io) to access the Zilliqa JS utilities, which in turn allows us to interface with the deployed contract.

## Environment Variables

We store the address of the smart contract in an environment variable in an [`.env`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/.env) file. We also store a [Google Maps API Key](https://developers.google.com/maps/documentation/embed/get-api-key) for embedding a Map on the Individual Listing page.

```
REACT_APP_SMART_CONTRACT_ADDRESS=zil1tug5k2la6xrjqc78ysfacskgt2m72uzdwmd86z
REACT_APP_MAPS_API_KEY=XXXXXXXXXXXXXXXX
```

<br/>

## Helper Functions

We create a bunch of helper functions to facilitate the contract connection. We will define them in the [`/src/functions/`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/) directory.

### `ContextContainer`

We use [`unstated-next`](https://github.com/jamiebuilds/unstated-next) to create a Context Provider for the application. We use this to make some objects available across all the components of the application. We will see how this is used in the coming sections.

```ts
import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useContext = () => {
  const [zilPay, setZilPay] = useState<any | undefined>(undefined);
  const [listings, setListings] = useState<any | undefined>(undefined);
  const [error, setError] = useState<boolean | undefined>(undefined);
  const [contract, setContract] = useState<any | undefined>(undefined);
  const [contractState, setContractState] = useState<any | undefined>(
    undefined
  );
  const [currentUser, setCurrentUser] = useState<any | undefined>(undefined);
  const [currentBlockNumber, setCurrentBlockNumber] = useState<
    number | undefined
  >(undefined);

  return {
    zilPay,
    setZilPay,
    listings,
    setListings,
    error,
    setError,
    contract,
    setContract,
    contractState,
    setContractState,
    currentUser,
    setCurrentUser,
    currentBlockNumber,
    setCurrentBlockNumber,
  };
};
const ContextContainer = createContainer(useContext);
export default ContextContainer;
```

[/src/functions/contextContainer.ts](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/contextContainer.ts)

<br/>

### `getCallParameters`

This function returns an object with the parameters required for calling transitions.
An optional `amountValue` argument can be used when sending messages with a non-zero amount.
The values are converted to the appropriate units using [`zilPay.utils`](https://zilpay.github.io/zilpay-docs/zilliqa-api-utils/#window-zilpay-utils).

```ts
const getCallParameters = (zilPay: any, amountValue: string = '0') => {
  const { units, bytes } = zilPay.utils;

  const CHAIN_ID = 333;
  const MSG_VERSION = 1;
  const GAS_PRICE = 60000000000;
  const GAS_LIMIT = 50000;

  const version = bytes.pack(CHAIN_ID, MSG_VERSION);
  const amount = units.toQa(amountValue, units.Units.Zil);
  const gasPrice = units.fromQa(GAS_PRICE, units.Units.Qa);
  const gasLimit = units.fromQa(GAS_LIMIT, units.Units.Qa);

  return { version, amount, gasPrice, gasLimit };
};

export default getCallParameters;
```

[/src/functions/getCallParameters.ts](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/getCallParameters.ts)

<br/>

### `getCurrentUser`

This function fetches the wallet address of the active ZilPay user. It gets the `name` and `role` of the user from the contract state.

```ts
const getCurrentUser = (contractState: any, zilPay: any) => {
  const currentUser = zilPay.wallet.defaultAccount.base16;
  const address = currentUser.toLowerCase();
  const name = contractState.user_name[address];
  const role = contractState.user_role?.[address] === '1' ? 'host' : 'renter';
  return { address, name, role };
};

export default getCurrentUser;
```

[/src/functions/getCurrentUser.ts](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/main/src/functions/getCurretUser.ts)

<br/>

### `getCurrentEpochNumber`

This function fetches the current mini epoch suing ZilPay.

```ts
const getCurrentEpochNumber = async (zilPay: any) => {
  const data = await zilPay.blockchain.getCurrentMiniEpoch();
  return await data.result;
};

export default getCurrentEpochNumber;
```

[/src/functions/getCurrentEpochNumber.ts](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/getCurrentEpochNumber.ts)

<br/>

### `formatListings`

This function takes the multiple Map objects in the contract state and returns a handy user object.
It checks if the current ZilPay user's wallet address matches that of the host of the listing.
It also checks the rented status of the listing. Prices and rent are converted from `Qa`. Amenities are converted to `boolean`.

```ts
const formatListings = (
  contractState: any,
  currentEpochNumber: number,
  currentUser: string
) => {
  const {
    listing_name,
    listing_description,
    listing_host,
    listing_price,
    listing_rooms,
    listing_bathrooms,
    listing_image,
    listing_location,
    listing_renter,
    listing_rented_till,
    listing_accumulated_rent,
    listing_wifi,
    listing_kitchen,
    listing_tv,
    listing_laundry,
    listing_hvac,
  } = contractState;

  const formattedListings = Object.keys(listing_name).map(
    (key: any, index: any) => {
      return {
        id: key,
        name: listing_name[key],
        description: listing_description[key],
        price: (parseInt(listing_price[key]) / 10 ** 12).toString(),
        rooms: listing_rooms[key],
        bathrooms: listing_bathrooms[key],
        image: listing_image[key],
        location: listing_location[key],
        renter: listing_renter[key],
        rented_till: listing_rented_till[key],
        accumulated_rent: (
          parseInt(listing_accumulated_rent[key]) /
          10 ** 12
        ).toString(),
        rented: parseInt(listing_rented_till[key]) >= currentEpochNumber,
        user_is_host: listing_host[0] === currentUser.toLowerCase(),
        amenities: {
          wifi: listing_wifi[key] === 'yes',
          kitchen: listing_kitchen[key] === 'yes',
          tv: listing_tv[key] === 'yes',
          laundry: listing_laundry[key] === 'yes',
          hvac: listing_hvac[key] === 'yes',
        },
      };
    }
  );

  return formattedListings;
};

export default formatListings;
```

[/src/functions/formatListings.ts](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/formatListings.ts)

<br/>

### `transitionMessageAlert`

This function creates a toast using [`react-hot-toast`](https://react-hot-toast.com),
It uses [`zilPay.wallet`](https://zilpay.github.io/zilpay-docs/getting-started/#basic-considerations) to subscribe to transactions.
It updates toast with the status of the transaction and shows a message as per the [Messages Codes](dev-rentonzilliqa-library.md#message-codes) we defined earlier.

Note that in this function, we use another helper function, `decodeMessage`, to get a human-readable message from the message code. This function is quite basic and hence not included here. You can take a look at [`/src/functions/decodeMessage.ts`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/decodeMessage.ts). It also includes a `decodeZilPayError` function that we will use in the coming sections.

```ts
import toast from 'react-hot-toast';
import decodeMessage from './decodeMessage';

const transitionMessageAlert = (
  zilPay: any,
  transactionId: string,
  transitionName: string
) => {
  const transition = new Promise<string>((success, error) => {
    const subscription = zilPay.wallet
      .observableTransaction(transactionId)
      .subscribe(async (hash: any) => {
        subscription.unsubscribe();
        try {
          const Tx = await zilPay.blockchain.getTransaction(hash[0]);
          const code = Tx.receipt.transitions[0].msg.params[0].value;
          const message = decodeMessage(code);
          if (message.type === 'success') success(message.alert);
          error(message.alert);
        } catch (err) {
          error('Transaction error');
        }
      });
  });
  toast.promise(transition, {
    loading: `${transitionName}`,
    success: (message: string) => message,
    error: (message: string) => message,
  });
};

export default transitionMessageAlert;
```

[/src/functions/transitionMessageAlert.ts](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/transitionMessageAlert.ts)

<br/>

## Transition Functions

We finally come to the Transition Functions that simply call the contract transitions using [`zilPay.contract`](https://zilpay.github.io/zilpay-docs/zilliqa-contracts/#window-zilpay-contracts). The [`transitionMessageAlert`](#transitionmessagealert) is also setup after the transitions are triggered.

The following functions are created at [`/src/functions/`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/) for calling their respective transitions.

| Function                                                                                                                          | Transition                                                       |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`createUserTransition`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/createUserTransition.ts)       | [`create_user`](dev-rentonzilliqa-transitions.md#create_user)       |
| [`createListingTransition`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/createListingTransition.ts) | [`create_listing`](dev-rentonzilliqa-transitions.md#create_listing) |
| [`updateListingTransition`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/updateListingTransition.ts) | [`update_listing`](dev-rentonzilliqa-transitions.md#update_listing) |
| [`deleteListingTransition`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/deleteListingTransition.ts) | [`delete_listing`](dev-rentonzilliqa-transitions.md#delete_listing) |
| [`bookListingTransition`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/bookListingTransition.ts)     | [`book_listing`](dev-rentonzilliqa-transitions.md#book_listing)     |
| [`claimRentTransition`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/claimRentTransition.ts)         | [`claim_rent`](dev-rentonzilliqa-transitions.md#claim_rent)         |

Let us see the [`createUserTransition`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/createUserTransition.ts) function as an example. We use the [`decodeZilPayError`](#transitionmessagealert) we defined earlier.

```ts
import getCallParameters from './getCallParameters';
import toast from 'react-hot-toast';
import transitionMessageAlert from './transitionMessageAlert';
import { decodeZilPayError } from './decodeMessage';

const createUserTransition = async (
  contract: any,
  zilPay: any,
  name: string | undefined,
  role: string
) => {
  try {
    const callTransition = await contract.call(
      'create_user',
      [
        {
          vname: 'name',
          type: 'String',
          value: name,
        },
        {
          vname: 'role',
          type: 'Uint32',
          value: role,
        },
      ],
      getCallParameters(zilPay)
    );
    transitionMessageAlert(zilPay, callTransition.ID, 'Creating user');
  } catch (error) {
    toast.error(decodeZilPayError(error));
  }
};

export default createUserTransition;
```

[/src/functions/createUserTransition.ts](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/functions/createUserTransition.ts)
