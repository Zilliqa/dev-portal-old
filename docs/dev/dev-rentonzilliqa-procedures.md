---
id: dev-rentonzilliqa-procedures
title: Procedures
keywords:
  - scilla
  - procedures
  - rentonzilliqa
description: The Procedures of the Scilla Contract for the RentOnZilliqa Application
---

---

We proceed to declare the procedures that we will use in the RentOnZilliqa Smart Contract. We will declare the following types of procedures in this section. [The source code](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/main/src/scilla/RentOnZilliqa.scilla).

- [General Procedures](#general-procedures)
  - [`send_message`](#send_message)
- [Listing Management Procedures](#listing-management-procedures)
  - [`set_listing_details`](#set_listing_details)
  - [`claim_rent_by_id`](#claim_rent_by_id)
  - [`delete_listing_by_id`](#delete_listing_by_id)
- [Listing Booking Procedures](#listing-booking-procedures)
  - [`check_listing_available`](#check_listing_available)
  - [`check_amount_and_book`](#check_amount_and_book)
  - [`book_listing_by_id`](#book_listing_by_id)

## General Procedures

Since we will send messages on multiple occasions in the contract, we create the `send_message` procedure to send messages.

### `send_message`

This procedure creates a message with the passed arguments. It uses the `one_msg` library function to create a list of messages and then proceeds to send it. Note that the `_recipient` is always the implicit variable `_sender`.

| Arguments | Description                                                                             | Type      |
| --------- | --------------------------------------------------------------------------------------- | --------- |
| `amount`  | The amount to be sent with the message                                                  | `Uint128` |
| `code`    | The [message code](dev-rentonzilliqa-library.md#message-codes) to be sent with the message | `Int32`   |

```ocaml
procedure send_message (amount: Uint128, code: Int32)
  msg = {
    _tag: "";
    _recipient: _sender;
    _amount: amount;
    code: code
  };
  msgs = one_msg msg;
  send msgs
end
```

<br />

## Listing Management Procedures

This group of procedures is used in the transitions that a host account user may use to manage their listings.

### `set_listing_details`

This procedure creates or updates the [Listing Details](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) for the given ID. It is used by the `create_listing` and `update_listing` transitions.

| Arguments     | Description                                                                                   | Type      |
| ------------- | --------------------------------------------------------------------------------------------- | --------- |
| `id`          | The ID of the listing                                                                         | `Uint128` |
| `name`        | The name of the listing                                                                       | `String`  |
| `description` | The description of the listing                                                                | `String`  |
| `price`       | The price of the listing                                                                      | `Uint128` |
| `rooms`       | The number of rooms in the listing                                                            | `Uint32`  |
| `bathrooms`   | The number of bathrooms in the listing                                                        | `Uint32`  |
| `image`       | A URL to an image of the listing                                                              | `String`  |
| `location`    | A [Google Maps Plus Code](https://maps.google.com/pluscodes/) for the location of the listing | `String`  |
| `wifi`        | The availability of WiFi at the listing                                                       | `String`  |
| `laundry`     | The availability of a Landry at the listing                                                   | `String`  |
| `hvac`        | The availability of an HVAC at the listing                                                    | `String`  |
| `tv`          | The availability of a TV at the listing                                                       | `String`  |
| `kitchen`     | The availability of a Kitchen at the listing                                                  | `String`  |

```ocaml
procedure set_listing_details (
  id: Uint128, name: String, description: String, price: Uint128,
  rooms: Uint32, bathrooms: Uint32, image: String, location: String,
  wifi: String, laundry: String, hvac: String, tv: String, kitchen: String
)
  listing_name[id] := name;
  listing_description[id] := description;
  listing_price[id] := price;
  listing_rooms[id] := rooms;
  listing_bathrooms[id] := bathrooms;
  listing_image[id] := image;
  listing_location[id] := location;
  listing_wifi[id] := wifi;
  listing_laundry[id] := laundry;
  listing_hvac[id] := hvac;
  listing_tv[id] := tv;
  listing_kitchen[id] := kitchen
end
```

<br />

### `claim_rent_by_id`

This procedure is used in conjunction with the `claim_rent` transition. The accumulated rent is checked for the listing with the given ID, in the [`listing_accumulated_rent`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) field. If the rent is missing or empty, the corresponding messages are sent using the `send_message` procedure. If there is non-zero accumulated rent, it is sent to the `_sender` using the `send_message` procedure. The accumulated rent is passed as an argument to `send_message`, along with the `rent_claimed` message code. A "Rent Claimed" event is also emitted. The accumulated rent in the [`listing_accumulated_rent`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) field is set to zero for that ID, as it is claimed by the host account.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
procedure claim_rent_by_id (id: Uint128)
  accumulated_rent <- listing_accumulated_rent[id];
  match accumulated_rent with
  | Some accumulated_rent =>
    no_accumulated_rent = builtin eq accumulated_rent zero;
    match no_accumulated_rent with
    | True =>
      send_message zero rent_empty
    | False =>
      listing_accumulated_rent[id] := zero;
      e = { _eventname: "RentClaimed"; listing_id: id; renter: _sender; amount: accumulated_rent };
      event e;
      send_message accumulated_rent rent_claimed
    end
  | None =>
    send_message zero listing_details_missing
  end
end
```

<br />

### `delete_listing_by_id`

This procedure is used in conjunction with the `delete_listing` transition. It deletes the [Listing Details](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) entries for the listing with the given ID.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
procedure delete_listing_by_id (id: Uint128)
  delete listing_name[id];
  delete listing_description[id];
  delete listing_price[id];
  delete listing_rooms[id];
  delete listing_image[id];
  delete listing_host[id];
  delete listing_renter[id];
  delete listing_rented_till[id];
  delete listing_accumulated_rent[id];
  delete listing_bathrooms[id];
  delete listing_location[id];
  delete listing_wifi[id];
  delete listing_laundry[id];
  delete listing_hvac[id];
  delete listing_tv[id];
  delete listing_kitchen[id]
end
```

<br />

## Listing Booking Procedures

<br />

### `check_listing_available`

This procedure is used in conjunction with the `book_listing` transition. It checks if the listing is available by checking the [`listing_rented_till`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) field. If it is not available, the [`listing_unavailable`](dev-rentonzilliqa-library.md#renter-account-codes) message is sent back. When the listing is available, the [`check_amount_and_book`](#check_amount_and_book) procedure is called with the `id`.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
procedure check_listing_available (id: Uint128)
  current_block_number <- & BLOCKNUMBER;
  listing_rented_till_value <- listing_rented_till[id];
  match listing_rented_till_value with
  | Some listing_rented_till_value =>
    is_rented_lt = builtin blt current_block_number listing_rented_till_value;
    is_rented_eq = builtin eq current_block_number listing_rented_till_value;
    listing_is_rented_check = orb is_rented_lt is_rented_eq;
    match listing_is_rented_check with
    | True =>
      send_message zero listing_unavailable
    | False =>
      check_amount_and_book id
    end
  | None =>
    send_message zero listing_details_missing
  end
end
```

<br />

### `check_amount_and_book`

This procedure is used in conjunction with the `book_listing` transition. It is called after the listing's availibility is checked by the [`check_listing_available`](#check_listing_available) procedure. It checks if the sent amount is equal to the [`listing_price`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields). If not, the [`wrong_amount_sent`](dev-rentonzilliqa-library.md#renter-account-codes) is sent back. If the correct amount is sent, the [`book_listing_by_id`](#book_listing_by_id) procedure is called with the `id`.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
procedure check_amount_and_book (id: Uint128)
  listing_price_value <- listing_price[id];
  match listing_price_value with
  | Some listing_price_value =>
    correct_amount_check = builtin eq _amount listing_price_value;
    match correct_amount_check with
    | True =>
      book_listing_by_id id
    | False =>
      send_message zero wrong_amount_sent
    end
  | None =>
    send_message zero listing_details_missing
  end
end
```

<br />

### `book_listing_by_id`

This procedure is used in conjunction with the `book_listing` transition. In this procedure, the `accept` command is called. The [`night_duration`](dev-rentonzilliqa-mutable-variables.md#owner-fields) is added to the current `BLOCKNUMBER` and assigned to the [`listing_rented_till`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) field. The `_sender` wallet address is assigned to the [`listing_renter`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) field. The rent amount is added to the [`listing_accumulated_rent`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) field, after subtracting the commission set in the [`owners_commission`](dev-rentonzilliqa-mutable-variables.md#owner-fields) field. A "ListingBooked" event is emitted and a [`listing_booked`](dev-rentonzilliqa-library.md#renter-account-codes) message is sent.

As the commission amount is stored in the contract balance, it can be claimed by the contract owner via the `_balance` implicit variable.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
procedure book_listing_by_id (id: Uint128)
  accumulated_rent <- listing_accumulated_rent[id];
  match accumulated_rent with
  | Some accumulated_rent =>
    accept;
    current_block_number <- & BLOCKNUMBER;
    night_duration_value <- night_duration;
    rented_till = builtin badd current_block_number night_duration_value;
    listing_rented_till[id] := rented_till;
    listing_renter[id] := _sender;
    commission <- owners_commission;
    rent = builtin sub _amount commission;
    new_accumulated_rent = builtin add accumulated_rent rent;
    listing_accumulated_rent[id] := new_accumulated_rent;
    e = { _eventname: "ListingBooked"; listing_id: id; renter: _sender; amount: _amount };
    event e;
    send_message zero listing_booked
  | None =>
    send_message zero listing_details_missing
  end
end
```
