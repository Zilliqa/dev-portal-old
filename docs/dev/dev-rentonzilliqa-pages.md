---
id: dev-rentonzilliqa-pages
title: Pages
keywords:
  - react
  - rentonzilliqa
  - pages
  - frontend
description: Building the Pages for the RentOnZilliqa frontend application
---

---

In this section, we will build the pages for the frontend application.

## App Component

We start with the `App` component.

We create the routes for our pages using [`react-router-dom`](https://www.npmjs.com/package/react-router-dom).

We setup the `Toaster` from [`react-hot-toast`](https://react-hot-toast.com).

With the `useEffect` hook, we set up the following:

- We check if ZilPay is available on the browser and store it in context using `setZilPay`. If ZilPay is not available, an error is conveyed.
- We fetch the state of the contract and store it in context using `setContract`
- Subscriptions are set up which allow us to
  - Update the contract state and block number when there is a block update using [`zilPay.wallet.observableBlock`](https://zilpay.github.io/zilpay-docs/zilliqa-provider/#methods)
  - Update the ZilPay account when it is changed using [`zilPay.wallet.observableAccount`](https://zilpay.github.io/zilpay-docs/zilliqa-provider/#methods)

```tsx
import React, { useEffect, useState } from 'react';
import Header from './components/componentHeader';
import Listing from './components/componentListing';
import Listings from './components/componentListings';
import CreateAccountModal from './components/componentCreateAccountModal';
import ContextContainer from './functions/contextContainer';
import { Toaster } from 'react-hot-toast';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

const App: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [zilPayCheck, setZilPayCheck] = useState<number>(0);
  const {
    zilPay,
    setZilPay,
    error,
    setError,
    setContract,
    setContractState,
    setCurrentBlockNumber,
  } = ContextContainer.useContainer();

  const getContractState = async () => {
    const contract = await zilPay.contracts.at(
      process.env.REACT_APP_SMART_CONTRACT_ADDRESS
    );
    setContract(contract);
    const contractState = await contract.getState();
    setContractState(contractState);
  };

  useEffect(() => {
    if (error === false) return;
    // @ts-ignore
    const zilPay = window.zilPay;
    if (zilPay === undefined) {
      setError(true);
      return;
    }
    setZilPay(zilPay);
    setError(false);
  }, [error]);

  useEffect(() => {
    if (error && zilPayCheck < 100) {
      setZilPayCheck(zilPayCheck + 1);
      setError(undefined);
      return;
    }
    if (error !== false) return;

    let block: any = undefined;
    let account: any = undefined;

    if (!zilPay.wallet.isConnect) return;
    try {
      block = zilPay.wallet.observableBlock().subscribe((block: any) => {
        const blockNumber = parseInt(block.TxBlock.header.BlockNum);
        setCurrentBlockNumber(blockNumber);
        getContractState();
      });
      account = zilPay.wallet
        .observableAccount()
        .subscribe(() => getContractState());

      getContractState();
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      block?.unsubscribe?.();
      account?.unsubscribe?.();
    };
  }, [error]);

  return zilPay ? (
    <div className="rentonzilliqa">
      <Router>
        <Header {...{ setShowSignUp }} />
        <main>
          <Switch>
            <Route path="/" exact>
              <Redirect to={'/listings'} />
            </Route>
            <Route path="/listings">
              <Listings />
            </Route>
            <Route path="/listing/:id">
              <Listing />
            </Route>
            <Redirect to={'/listings'} />
          </Switch>
          <CreateAccountModal {...{ showSignUp, setShowSignUp }} />
        </main>
      </Router>
      <Toaster
        toastOptions={{
          success: { duration: 6000 },
          error: { duration: 8000 },
          loading: { duration: 130000 },
        }}
      />
    </div>
  ) : (
    <main className="h-screen flex justify-center items-center text-xl">
      Please install ZilPay
    </main>
  );
};

export default App;
```

[/src/App.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/App.tsx)

<br/>

## `index.tsx`

Next, we wrap the [`App`](#app) component with the [`ContextContainer`](dev-rentonzilliqa-scripting.md#contextcontainer) that we created earlier.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './tailwind.output.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ContextContainer from './functions/contextContainer';

ReactDOM.render(
  <React.StrictMode>
    <ContextContainer.Provider>
      <App />
    </ContextContainer.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
```

[/src/index.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/index.tsx)

## Listings Page

Now we get to the [Listings Page](dev-rentonzilliqa-frontend.mdx).

When there is a change in the `contractState` or `blockNumber`, using the `useEffect` hook, we update the `listings` displayed on the page. We create a `hostedListings` object that filters out the listings that are hosted by the current user.

The listings are presented using the [`ListingCard`](dev-rentonzilliqa-components.md#listingcard) component.

Using the `useState` hook, we create `boolean` state variables for showing and hiding the modals as required. The modals are conditionally mounted based on these variables. To trigger the modals, we set up `onClick` listeners as follows:

- On a "New Listing" [`Button`](dev-rentonzilliqa-components.md#button), which triggers the [`CreateListing`](dev-rentonzilliqa-modals.md#create-listing-modal) Modal
- On each Listing Card, which triggers the [`ManageListing`](dev-rentonzilliqa-modals.md#manage-listing-modal) Modal

```tsx
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ContextContainer from '../functions/contextContainer';
import formatListings from '../functions/formatListings';
import getCurrentEpochNumber from '../functions/getCurrentEpochNumber';
import getCurrentUser from '../functions/getCurretUser';
import Button from './componentButton';
import CreateListingModal from './componentCreateListingModal';
import ListingCard from './componentListingCard';
import ManageListingModal from './componentManageListingModal';

const Listings: React.FC = () => {
  const [showCreateListing, setShowCreateListing] = useState<boolean>(false);
  const [showManageListing, setShowManageListing] = useState<boolean>(false);
  const [modalListing, setModalListing] = useState<any | undefined>(undefined);
  const {
    contractState,
    zilPay,
    currentUser,
    setCurrentUser,
    currentBlockNumber,
    setCurrentBlockNumber,
  } = ContextContainer.useContainer();
  const [listings, setListings] = useState<any | undefined>(undefined);
  const history = useHistory();

  const hostedListings = listings?.filter((listing: any) => {
    return listing.user_is_host;
  });

  useEffect(() => {
    (async () => {
      if (!contractState) return;
      const currentEpochNumber = await getCurrentEpochNumber(zilPay);
      setCurrentBlockNumber(currentEpochNumber);
      const currentUser = getCurrentUser(contractState, zilPay);
      setCurrentUser(currentUser);
      setListings(
        formatListings(contractState, currentEpochNumber, currentUser.address)
      );
    })();
  }, [contractState, currentBlockNumber]);

  return (
    <div className="container mx-auto px-4 lg:px-2 pb-20">
      <div className="pt-20 pb-10 flex justify-between items-center">
        <h1 className="text-gray-900 text-2xl font-medium">Listings</h1>
      </div>
      {listings ? (
        <>
          {listings.length > 0 ? (
            <>
              <div className="grid md:grid-cols-5 gap-6">
                {listings.map((listing: any, index: number) => {
                  return (
                    <ListingCard
                      {...listing}
                      onClick={() => {
                        history.push(`/listing/${listing.id}`);
                      }}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-xl text-center">No listings</p>
          )}
          {currentUser?.role === 'host' && (
            <>
              <div className="pt-32 pb-10 flex justify-between items-center">
                <h1 className="text-gray-900 text-2xl font-medium">Hosted</h1>
                <Button
                  text={'New Listing'}
                  onClick={() => setShowCreateListing(true)}
                />
              </div>
              {hostedListings.length > 0 ? (
                <div className="grid md:grid-cols-5 gap-6">
                  {hostedListings.map((listing: any, index: number) => {
                    return (
                      <ListingCard
                        {...listing}
                        onClick={() => {
                          setModalListing(listing);
                          setShowManageListing(true);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-xl text-center">No listings</p>
              )}
            </>
          )}
        </>
      ) : zilPay.wallet.isConnect ? (
        <p className="text-xl text-center">Loading</p>
      ) : (
        <p className="text-xl text-center">Please connect ZilPay</p>
      )}
      <CreateListingModal {...{ showCreateListing, setShowCreateListing }} />
      {modalListing && (
        <ManageListingModal
          {...{
            modalListing,
            showManageListing,
            setShowManageListing,
          }}
        />
      )}
    </div>
  );
};

export default Listings;
```

[/src/components/componentListings.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentListings.tsx)

<br/>

## Individual Listing Page

This component presents a detailed view of the individual listing on the [Listing Page](dev-rentonzilliqa-frontend.mdx#listing-page).

The description, rooms, amenities, map, and description are presented in a detailed manner. The [`ListingIcons`](dev-rentonzilliqa-components.md#listing-icons) are used to provide a clear view of the Rooms and Amenities sections.

Users can book the listing within this component, which uses the [`bookListingTransition`](dev-rentonzilliqa-scripting.md#booklistingtransition) function.

The embed url for the Map is built using the [Google Maps Plus Code](https://maps.google.com/pluscodes/) and the [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en).

```tsx
import React, { useEffect, useState } from 'react';
import ContextContainer from '../functions/contextContainer';
import formatListings from '../functions/formatListings';
import getCurrentEpochNumber from '../functions/getCurrentEpochNumber';
import getCurrentUser from '../functions/getCurretUser';
import Button from './componentButton';
import { useHistory, useParams } from 'react-router-dom';
import bookListingTransition from '../functions/bookListingTransition';
import {
  BathroomIcon,
  BedroomIcon,
  HvacIcon,
  KitchenIcon,
  LaundryIcon,
  TvIcon,
  WifiIcon,
} from './componentListingIcons';

const Listing: React.FC = () => {
  const [listing, setListing] = useState<any | undefined>(undefined);
  const {
    contract,
    contractState,
    zilPay,
    setCurrentUser,
    currentBlockNumber,
    setCurrentBlockNumber,
  } = ContextContainer.useContainer();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const plusCode = listing?.location.replace(' ', '+').replace('+', '%2B');
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${plusCode}&zoom=18`;

  useEffect(() => {
    (async () => {
      if (!contractState) return;
      const currentEpochNumber = await getCurrentEpochNumber(zilPay);
      setCurrentBlockNumber(currentEpochNumber);
      const currentUser = getCurrentUser(contractState, zilPay);
      setCurrentUser(currentUser);
      const listing = formatListings(
        contractState,
        currentEpochNumber,
        currentUser.address
      ).filter((listing) => {
        return listing.id === id;
      })?.[0];
      if (!listing) history.push('/listings');
      setListing(listing);
    })();
  }, [contractState, currentBlockNumber]);

  const makeReservation = () => {
    bookListingTransition(contract, zilPay, listing.id, listing.price);
  };

  return (
    <>
      {listing ? (
        <div className="container mx-auto px-4 lg:px-2 pb-20">
          <div className="pt-20 pb-10">
            <h1 className="text-gray-900 text-3xl font-medium">
              {listing.name}
            </h1>
          </div>
          <div className="grid lg:grid-cols-3 gap-12 relative">
            <div className="order-2 lg:order-none lg:col-span-2">
              <img className="rounded-xl bg-gray-100" src={listing.image} />
              <div className="max-w-prose mt-20 mb-12">
                <h2 className="text-2xl font-medium text-gray-900 pb-4">
                  About
                </h2>
                <p className="text-gray-700">{listing.description}</p>
              </div>
              <div className="h-px bg-gray-300"></div>
              <div className="my-12">
                <h2 className="text-2xl font-medium text-gray-900 pb-4">
                  Rooms
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="border p-6 rounded-lg">
                    <BedroomIcon />
                    <p className="text-lg text-gray-900 pt-1">
                      {listing.rooms} Bedroom
                      {listing.rooms > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="border p-6 rounded-lg">
                    <BathroomIcon />
                    <p className="text-lg text-gray-900 pt-1">
                      {listing.bathrooms} Bathroom
                      {listing.bathrooms > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-300"></div>
              {Object.values(listing.amenities).filter?.((amenity: any) => {
                return amenity;
              }).length > 0 && (
                <div className="my-12">
                  <h2 className="text-2xl font-medium text-gray-900 pb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    {listing.amenities.wifi && (
                      <div className="flex items-center">
                        <WifiIcon />
                        <p className="pl-4">WiFi</p>
                      </div>
                    )}
                    {listing.amenities.kitchen && (
                      <div className="flex items-center">
                        <KitchenIcon />
                        <p className="pl-4">Kitchen</p>
                      </div>
                    )}
                    {listing.amenities.tv && (
                      <div className="flex items-center">
                        <TvIcon />
                        <p className="pl-4">Television</p>
                      </div>
                    )}
                    {listing.amenities.laundry && (
                      <div className="flex items-center">
                        <LaundryIcon />
                        <p className="pl-4">Laundry</p>
                      </div>
                    )}
                    {listing.amenities.hvac && (
                      <div className="flex items-center">
                        <HvacIcon />
                        <p className="pl-4">HVAC</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {plusCode && (
                <>
                  <div className="h-px bg-gray-300"></div>
                  <div className="my-12">
                    <h2 className="text-2xl font-medium text-gray-900 pb-4">
                      Location
                    </h2>
                    <iframe
                      className="w-full h-96 bg-gray-100"
                      src={mapEmbedUrl}
                    ></iframe>
                  </div>
                </>
              )}
            </div>

            <div className="order-1">
              <div className="sticky top-32 p-6 rounded-xl border-2 w-full">
                <div className="text-center">
                  <p className="mt-4 mb-8 text-xl text-gray-900 font-medium">
                    {listing.price} ZIL
                    <span className="text-gray-700 font-normal"> / night</span>
                  </p>
                  {listing.rented && (
                    <p className="mb-10 px-2 py-1 bg-gray-200 text-gray-600 rounded uppercase text-xs tracking-wide font-semibold  inline-block">
                      Unavailable
                    </p>
                  )}
                </div>
                <Button
                  modal
                  onClick={makeReservation}
                  text="Make Reservation"
                />
              </div>
            </div>
          </div>
        </div>
      ) : zilPay.wallet.isConnect ? (
        <p className="pt-20 text-xl text-center">Loading</p>
      ) : (
        <p className="pt-20 text-xl text-center">Please connect ZilPay</p>
      )}
    </>
  );
};

export default Listing;
```

[/src/components/componentListing.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentListing.tsx)
