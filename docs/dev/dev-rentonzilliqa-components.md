---
id: dev-rentonzilliqa-components
title: Components
keywords:
  - react
  - rentonzilliqa
  - components
  - frontend
description: Creating the React Components for the RentOnZilliqa frontend application
---

---

In this section, we will build all the components that will be used on the frontend application.

## General Components

### Button

We start with a basic Button component in [`/src/components/componentButton.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentButton.tsx) with a bunch of options for modifying it based on the usage.

```tsx
import React from 'react';

type props = {
  text: string;
  onClick(e: any): void;
  white?: boolean;
  header?: boolean;
  modal?: boolean;
  padding?: boolean;
  alert?: boolean;
};

const Button: React.FC<props> = (props) => {
  const {
    text,
    white = false,
    modal = false,
    onClick,
    padding = false,
    alert = false,
  } = props;
  const colours = white
    ? 'text-gray-900 bg-white'
    : alert
    ? 'text-white bg-red-600'
    : 'text-white bg-gray-900';

  return (
    <button
      className={`font-medium py-3 text-sm lg:text-base rounded-button shadow-button ${colours} ${
        modal ? 'w-full lg:text-base' : 'px-3 lg:px-6'
      } ${padding ? 'mb-10' : ''}`}
      {...{ onClick }}
    >
      {text}
    </button>
  );
};

export default Button;
```

[/src/components/componentButton.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentButton.tsx)

<br/>

### Header

We then create a Header component in [`/src/components/componentHeader.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentHeader.tsx) to be used on all pages.

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './componentButton';

type props = {
  setShowSignUp(showSignUp: boolean): void;
};

const Header: React.FC<props> = (props) => {
  const { setShowSignUp } = props;

  return (
    <header className="bg-gray-900 sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-2 py-3 flex justify-between items-center">
        <Link
          className="text-white text-2xl font-medium cursor-pointer"
          to="/listings"
        >
          RentOnZilliqa
        </Link>
        <Button
          text={'Create Account'}
          onClick={() => setShowSignUp(true)}
          white
          header
        />
      </div>
    </header>
  );
};

export default Header;
```

[/src/components/componentHeader.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentHeader.tsx)

<br/>

### Modal

We create a Modal component at [`/src/components/componentModal.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentModal.tsx). Most transitions take place via a modal. This component takes care of the basic Modal functionality and styling.

The `title`; main button set to `buttonText`; dismiss button; and overlay are part of this component.

The `children` passed to this component are the content in the modal.

The `onClick` function will be called when the main button is clicked.

```tsx
import React, { useEffect } from 'react';
import Button from './componentButton';

type props = {
  title: string;
  children: JSX.Element | JSX.Element[];
  setVisible(visible: boolean): void;
  visible: boolean;
  buttonText: string;
  onClick(): void;
};

const Modal: React.FC<props> = (props) => {
  const { title, children, setVisible, visible, buttonText, onClick } = props;

  useEffect(() => {
    document.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onClick();
      }
    };
  }, []);

  return (
    <div
      className={
        'w-screen h-screen bg-black bg-opacity-25 fixed top-0 left-0 z-20 transition-all'
      }
      style={
        visible
          ? {
              opacity: 1,
              visibility: 'visible',
              transform: 'translateY(0)',
            }
          : {
              opacity: 0,
              visibility: 'hidden',
              transform: 'translateY(30px)',
            }
      }
      onClick={() => setVisible(false)}
    >
      <div className="w-full h-full flex justify-center items-center px-4 lg:px-2 py-2">
        <div
          className="w-full lg:w-1/3 bg-white shadow-xl rounded-2xl max-h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-8">
            <p className="text-xl font-bold text-gray-900">{title}</p>
            <button
              className="p-1 rounded hover:bg-gray-100 transition-colors -mr-1"
              onClick={() => setVisible(false)}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="w-full px-8 pt-0 overflow-y-scroll flex-grow">
            {children}
          </div>
          <div className="p-8">
            <Button
              modal
              text={buttonText}
              onClick={(e: any) => {
                onClick();
                setVisible(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

[/src/components/componentModal.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentModal.tsx)

<br/>

### ListingCard

We create a ListingCard component at [`/src/components/componentListingCard.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentListingCard.tsx). This component creates the listing card used on the listings page.

```tsx
import React from 'react';

type props = {
  id: string;
  name: string;
  price: string | number;
  rooms: string | number;
  bathrooms: string | number;
  image: string;
  renter: string | undefined;
  rented_till: string;
  accumulated_rent: string;
  rented: boolean;
  user_is_host: boolean;
  onClick(): void;
};

const ListingCard: React.FC<props> = (props) => {
  const { name, price, rooms, bathrooms, image, rented, onClick } = props;
  return (
    <div className="w-full rounded-2xl cursor-pointer" onClick={onClick}>
      <div
        className="w-full h-48 rounded-lg mb-4 bg-gray-100 flex justify-end items-start p-2"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
        }}
      >
        {rented && (
          <div>
            <div className="px-2 py-1 bg-gray-200 text-gray-600 rounded uppercase text-xs tracking-wide font-semibold">
              Unavailable
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center text-base font-light text-gray-600">
        <p>
          {rooms} Room{rooms > 1 ? 's' : ''}
        </p>
        <div className="w-1 h-1 bg-gray-500 rounded-full mx-2"></div>
        <p>
          {bathrooms} Bathroom{bathrooms > 1 ? 's' : ''}
        </p>
      </div>
      <h3 className="text-gray-900 text-xl">{name}</h3>
      <p className="text-gray-900 font-semibold">
        {price} ZIL
        <span className="text-gray-600 font-light"> / night</span>
      </p>
    </div>
  );
};

export default ListingCard;
```

[/src/components/componentListingCard.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentListingCard.tsx)

<br/>

## Form Components

### Input

We create an Input component at [`/src/components/componentInput.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentInput.tsx). This works with state variables which will be created with the `useState` hook in its Parent Component. We accept the `name` for the input field. The input `type` and `unit` are also accepted as optional props.

```tsx
import React from 'react';

type props = {
  name: string;
  unit?: string;
  value?: string;
  setValue(value: string): void;
  type?: string;
};

const Input: React.FC<props> = (props) => {
  const { name, unit = '', value = '', setValue, type = 'text' } = props;

  return (
    <div className="">
      <div className="flex justify-between items-center py-2 text-xs tracking-wide uppercase">
        <h4 className="font-semibold text-gray-500">{name}</h4>
        <p className="font-medium text-gray-400">{unit}</p>
      </div>
      <input
        className="w-full mb-6 border-2 border-gray-300 focus:border-gray-900 rounded-button outline-none text-gray-900 lg:text-lg px-4 py-3"
        placeholder={name}
        type={'text'}
        inputMode={type === 'number' ? 'decimal' : 'text'}
        min={type === 'number' ? 1 : undefined}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></input>
    </div>
  );
};

export default Input;
```

[/src/components/componentInput.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentInput.tsx)

<br/>

### CheckBox

We create a CheckBox component at [`/src/components/componentCheckBox.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentCheckBox.tsx). This component is used within the modals. The CreateAccount modal uses it for user role selection. It is also used for selecting amenities in the CreateListing and ManageListing Modals.

```tsx
import React from 'react';
import Tick from './componentTick';

type props = {
  checked: boolean;
  setChecked(checked: boolean): void;
  children: any;
  name: String;
};

const CheckBox: React.FC<props> = (props) => {
  const { checked, setChecked, children, name } = props;
  return (
    <>
      <div
        className="flex justify-between items-center cursor-pointer mt-3"
        onClick={() => setChecked(!checked)}
      >
        <div className="flex items-center">
          {children}
          <p className="text-lg text-gray-800 pl-4">{name}</p>
        </div>
        <div
          className={`p-1 bg-gray-200 rounded-lg w-8 h-8 hover:scale-95 transform transition-all ${
            checked ? '' : 'hover:bg-gray-300'
          }`}
        >
          <div
            className={`w-full h-full rounded transition-colors text-transparent ${
              checked ? 'bg-gray-900 text-white' : ''
            }`}
          >
            {checked && <Tick />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckBox;
```

[/src/components/componentCheckBox.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentCheckBox.tsx)

<br/>

### AmenitiesInput

We create an AmenitiesInput component at [`/src/components/componentAmenitiesInput.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentAmenitiesInput.tsx). It groups multiple checkboxes for collecting the amenities' availability in the CreateListing and ManageListing modals. We create this component to clean up the code.

```tsx
import React, { useEffect, useState } from 'react';
import {
  HvacIcon,
  KitchenIcon,
  LaundryIcon,
  TvIcon,
  WifiIcon,
} from './componentListingIcons';
import CheckBox from './componentCheckBox';

type props = {
  wifi: boolean;
  setWifi(wifi: boolean): void;
  kitchen: boolean;
  setKitchen(kitchen: boolean): void;
  tv: boolean;
  setTv(tv: boolean): void;
  laundry: boolean;
  setLaundry(laundry: boolean): void;
  hvac: boolean;
  setHvac(hvac: boolean): void;
};

const AmenitiesInput: React.FC<props> = (props) => {
  const {
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
  } = props;
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    setSelectAll(!(wifi || kitchen || tv || laundry || hvac));
  }, [wifi, kitchen, tv, laundry, hvac]);

  const setAll = (value: boolean) => {
    setWifi(value);
    setKitchen(value);
    setTv(value);
    setLaundry(value);
    setHvac(value);
  };

  return (
    <>
      <div className="flex justify-between text-xs font-semibold text-gray-500 tracking-wide uppercase py-4">
        <h4>Amenities</h4>
        <p
          className="font-medium text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
          onClick={() => setAll(selectAll)}
        >
          {selectAll ? 'Select All' : 'Select None'}
        </p>
      </div>
      <CheckBox name="WiFi" checked={wifi} setChecked={setWifi}>
        <WifiIcon />
      </CheckBox>
      <CheckBox name="Kitchen" checked={kitchen} setChecked={setKitchen}>
        <KitchenIcon />
      </CheckBox>
      <CheckBox name="Television" checked={tv} setChecked={setTv}>
        <TvIcon />
      </CheckBox>
      <CheckBox name="Laundry" checked={laundry} setChecked={setLaundry}>
        <LaundryIcon />
      </CheckBox>
      <CheckBox name="HVAC" checked={hvac} setChecked={setHvac}>
        <HvacIcon />
      </CheckBox>
    </>
  );
};

export default AmenitiesInput;
```

[/src/components/componentAmenitiesInput.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentAmenitiesInput.tsx)

<br/>

## SVG Components

### Tick

This Tick component at [`/src/components/componentTick.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentTick.tsx) is used to make the SVG easily available for the [CheckBox](#checkbox) component.

```tsx
import React from 'react';

const Tick: React.FC = () => {
  return (
    <div className="w-full h-full grid place-items-center">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
};

export default Tick;
```

[/src/components/componentTick.tsx](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentTick.tsx)

<br/>

### Listing Icons

This [`/src/components/componentListingIcons.tsx`](https://github.com/Quinence/zilliqa-fullstack-app/blob/main/src/components/componentListingIcons.tsx) file contains several SVG components for use on the listing page as well as the listing management modals.

It includes icons for:

- `Wifi`
- `Kitchen`
- `TV`
- `Laundry`
- `HVAC`
- `Bedroom`
- `Bathroom`
