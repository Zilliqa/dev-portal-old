---
id: dev-rentonzilliqa-modals
title: Modals
keywords:
  - react
  - rentonzilliqa
  - modals
  - frontend
description: Creating the Modals for the RentOnZilliqa frontend application
---

---

In this section, we will create the Modals for the frontend application. We use the [`Modal`](dev-rentonzilliqa-components.md#modal) component that we created earlier.

## Create Account Modal

We start with [Create Account Modal](dev-rentonzilliqa-frontend.mdx#account-creation-and-zilpay) that will be used to connect to the ZilPay wallet as well as access the smart contract.

It uses [`Input`](dev-rentonzilliqa-components.md#input) and [`Button`](dev-rentonzilliqa-components.md#button) components.
It uses [`CheckBox`](dev-rentonzilliqa-components.md#checkbox) for selecting the user role. A button is presented for connecting ZilPay when required.

The [`createAccountTransition`](#createaccounttransition) function is used.

```tsx
import React, { useEffect, useState } from 'react';
import ContextContainer from '../functions/contextContainer';
import createUserTransition from '../functions/createUserTransition';
import Button from './componentButton';
import Input from './componentInput';
import Modal from './componentModal';
import Tick from './componentTick';

type props = {
  showSignUp: boolean;
  setShowSignUp(visible: boolean): void;
};

const CreateAccountModal: React.FC<props> = (props) => {
  const { showSignUp, setShowSignUp } = props;
  const [name, setName] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string | undefined>('host');
  const { zilPay, contract } = ContextContainer.useContainer();

  const createUser = async () => {
    const role = userRole === 'host' ? '1' : '0';
    createUserTransition(contract, zilPay, name, role);
  };

  const connectZilPay = async () => {
    await zilPay.wallet.connect();
    window.location.reload();
  };

  useEffect(() => {
    setName(undefined);
    setUserRole('host');
  }, [setShowSignUp]);

  return (
    <Modal
      title="Create Account"
      visible={showSignUp}
      setVisible={setShowSignUp}
      buttonText={'Create Account'}
      onClick={createUser}
    >
      <>
        {!zilPay.wallet.isConnect && (
          <>
            <h4 className="text-xs font-semibold text-gray-500 tracking-wide uppercase py-4">
              ZilPay
            </h4>
            <Button
              text={'Connect ZilPay'}
              padding
              onClick={connectZilPay}
              modal
            />
          </>
        )}
        <Input name="Your name" value={name} setValue={setName} />
        <h4 className="text-xs font-semibold text-gray-500 tracking-wide uppercase py-4">
          Please select one
        </h4>
        <div className="flex gap-12 mb-8">
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={() => setUserRole('host')}
          >
            <p className="text-lg text-gray-800 pr-4">Host</p>
            <div
              className={`p-1 bg-gray-200 rounded-lg w-8 h-8 hover:scale-95 transform transition-all ${
                userRole === 'host' ? '' : 'hover:bg-gray-300'
              }`}
            >
              <div
                className={`w-full h-full rounded transition-colors text-transparent ${
                  userRole === 'host' ? 'bg-gray-900 text-gray-200' : ''
                }`}
              >
                {userRole === 'host' && <Tick />}
              </div>
            </div>
          </div>
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={() => setUserRole('renter')}
          >
            <p className="text-lg text-gray-800 pr-4">Rent</p>
            <div
              className={`p-1 bg-gray-200 rounded-lg w-8 h-8 hover:scale-95 transform transition-all ${
                userRole !== 'host' ? '' : 'hover:bg-gray-300'
              }`}
            >
              <div
                className={`w-full h-full rounded transition-colors text-transparent ${
                  userRole !== 'host' ? 'bg-gray-900 text-gray-200' : ''
                }`}
              >
                {userRole !== 'host' && <Tick />}
              </div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default CreateAccountModal;
```

[`/src/components/componentCreateAccountModal.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentCreateAccountModal.tsx)

<br/>

## Create Listing Modal

We now get to the [Create Listing Modal](dev-rentonzilliqa-frontend.mdx) that will be used by host users to post new listings.

It uses [`Input`](dev-rentonzilliqa-components.md#input) and [`Button`](dev-rentonzilliqa-components.md#button) components.
It uses [`AmenitiesInput`](dev-rentonzilliqa-components.md#amenitiesinput) for selecting the available amenities. A button is presented for connecting ZilPay when required.

The [`createListingTransition`](#createlistingtransition) function is used.

```tsx
import React, { useEffect, useState } from 'react';
import ContextContainer from '../functions/contextContainer';
import createListingTransition from '../functions/createListingTransition';
import AmenitiesInput from './componentAmenitiesInput';
import Input from './componentInput';
import Modal from './componentModal';

type props = {
  showCreateListing: boolean;
  setShowCreateListing(visible: boolean): void;
};

const CreateListingModal: React.FC<props> = (props) => {
  const { showCreateListing, setShowCreateListing } = props;

  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);
  const [rooms, setRooms] = useState<string | undefined>(undefined);
  const [bathrooms, setBathrooms] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);

  const [wifi, setWifi] = useState<boolean>(false);
  const [kitchen, setKitchen] = useState<boolean>(false);
  const [tv, setTv] = useState<boolean>(false);
  const [laundry, setLaundry] = useState<boolean>(false);
  const [hvac, setHvac] = useState<boolean>(false);

  const { contract, zilPay } = ContextContainer.useContainer();

  const createListing = () => {
    if (
      !name ||
      !description ||
      !price ||
      !rooms ||
      !bathrooms ||
      !location ||
      !image
    )
      return;
    createListingTransition(
      contract,
      zilPay,
      name,
      description,
      price,
      rooms,
      bathrooms,
      image,
      location,
      wifi,
      kitchen,
      tv,
      laundry,
      hvac
    );
  };

  useEffect(() => {
    setName(undefined);
    setDescription(undefined);
    setPrice(undefined);
    setRooms(undefined);
    setBathrooms(undefined);
    setLocation(undefined);
    setImage(undefined);
    setWifi(false);
    setKitchen(false);
    setTv(false);
    setLaundry(false);
    setHvac(false);
  }, [showCreateListing]);

  return (
    <Modal
      title="Create Listing"
      visible={showCreateListing}
      setVisible={setShowCreateListing}
      buttonText={'Create'}
      onClick={createListing}
    >
      <Input name="Name" value={name} setValue={setName} />
      <Input name="Description" value={description} setValue={setDescription} />
      <Input name="Rooms" value={rooms} type="number" setValue={setRooms} />
      <Input
        name="Bathrooms"
        value={bathrooms}
        type="number"
        setValue={setBathrooms}
      />
      <Input
        name="Price (ZIL)"
        unit="per night"
        value={price}
        type="number"
        setValue={setPrice}
      />
      <Input name="Image URL" value={image} type="text" setValue={setImage} />
      <Input
        name="Google Maps Plus Code"
        value={location}
        type="text"
        setValue={setLocation}
      />
      <AmenitiesInput
        {...{
          wifi,
          setWifi,
          kitchen,
          setKitchen,
          tv,
          setTv,
          laundry,
          setLaundry,
          hvac,
          setHvac,
        }}
      />
    </Modal>
  );
};

export default CreateListingModal;
```

[`/src/components/componentCreateListingModal.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentCreateListingModal.tsx)

<br/>

## Manage Listing Modal

We now get to the [Create Listing Modal](dev-rentonzilliqa-frontend.mdx#creating-and-managing-listings) that will be used by host users to post new listings.

It uses [`Input`](dev-rentonzilliqa-components.md#modal) and [`Button`](dev-rentonzilliqa-components.md#button) components.
It uses [`AmenitiesInput`](dev-rentonzilliqa-components.md#amenitiesinput) for selecting the available amenities. A button is presented for connecting ZilPay when required.

The [`deleteListingTransition`](#createlistingtransition), [`updateListingTransition`](#updatelistingtransition), and [`claimRentTransition`](#claimrenttransition) functions are called as required.

```tsx
import React, { useEffect, useState } from 'react';
import claimRentTransition from '../functions/claimRentTransition';
import ContextContainer from '../functions/contextContainer';
import deleteListingTransition from '../functions/deleteListingTransition';
import updateListingTransition from '../functions/updateListingTransition';
import AmenitiesInput from './componentAmenitiesInput';
import Button from './componentButton';
import Input from './componentInput';
import Modal from './componentModal';

type props = {
  modalListing: any;
  showManageListing: boolean;
  setShowManageListing(visible: boolean): void;
};

const ManageListingModal: React.FC<props> = (props) => {
  const { showManageListing, setShowManageListing, modalListing } = props;
  const { id, accumulated_rent } = modalListing;

  const [name, setName] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);
  const [rooms, setRooms] = useState<string | undefined>(undefined);
  const [bathrooms, setBathrooms] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);

  const [wifi, setWifi] = useState<boolean>(false);
  const [kitchen, setKitchen] = useState<boolean>(false);
  const [tv, setTv] = useState<boolean>(false);
  const [laundry, setLaundry] = useState<boolean>(false);
  const [hvac, setHvac] = useState<boolean>(false);

  const { contract, zilPay } = ContextContainer.useContainer();

  const updateListing = () => {
    if (
      !name ||
      !description ||
      !price ||
      !rooms ||
      !bathrooms ||
      !location ||
      !image
    )
      return;
    updateListingTransition(
      contract,
      zilPay,
      id,
      name,
      description,
      price,
      rooms,
      bathrooms,
      image,
      location,
      wifi,
      kitchen,
      tv,
      laundry,
      hvac
    );
  };

  const claimRent = () => {
    claimRentTransition(contract, zilPay, id);
    setShowManageListing(false);
  };

  const deleteListing = () => {
    deleteListingTransition(contract, zilPay, id);
    setShowManageListing(false);
  };

  useEffect(() => {
    setName(modalListing.name);
    setDescription(modalListing.description);
    setPrice(modalListing.price);
    setRooms(modalListing.rooms);
    setBathrooms(modalListing.bathrooms);
    setLocation(modalListing.location);
    setImage(modalListing.image);
    setWifi(modalListing.amenities.wifi);
    setKitchen(modalListing.amenities.kitchen);
    setTv(modalListing.amenities.tv);
    setLaundry(modalListing.amenities.laundry);
    setHvac(modalListing.amenities.hvac);
  }, [showManageListing]);

  return (
    <Modal
      title="Manage Listing"
      visible={showManageListing}
      setVisible={setShowManageListing}
      buttonText={'Update Listing'}
      onClick={updateListing}
    >
      <>
        <h4 className="text-sm font-semibold text-gray-500 tracking-wide uppercase py-4">
          Accumulated Rent
        </h4>
        <div className="flex justify-between items-center pb-8">
          <p className="text-2xl ">{accumulated_rent}</p>
          <Button text={'Claim Rent'} onClick={claimRent} />
        </div>
      </>
      <>
        <h4 className="text-sm font-semibold text-gray-500 tracking-wide uppercase py-4">
          Delete Listing
        </h4>
        <Button
          text={'Delete Listing'}
          onClick={deleteListing}
          alert
          padding
          modal
        />
      </>
      <Input name="Name" value={name} setValue={setName} />
      <Input name="Description" value={description} setValue={setDescription} />
      <Input name="Rooms" value={rooms} type="number" setValue={setRooms} />
      <Input
        name="Bathrooms"
        value={bathrooms}
        type="number"
        setValue={setBathrooms}
      />
      <Input
        name="Price (ZIL)"
        unit="per night"
        value={price}
        type="number"
        setValue={setPrice}
      />
      <Input name="Image URL" value={image} type="text" setValue={setImage} />
      <Input
        name="Google Maps Plus Code"
        value={location}
        type="text"
        setValue={setLocation}
      />
      <AmenitiesInput
        {...{
          wifi,
          setWifi,
          kitchen,
          setKitchen,
          tv,
          setTv,
          laundry,
          setLaundry,
          hvac,
          setHvac,
        }}
      />
    </Modal>
  );
};

export default ManageListingModal;
```

[`/src/components/componentManageListingModal.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentManageListingModal.tsx)
