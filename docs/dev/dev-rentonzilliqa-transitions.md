---
id: dev-rentonzilliqa-transitions
title: Transitions
keywords:
  - scilla
  - transitions
  - rentonzilliqa
description: The Transitions of the Scilla Contract for the RentOnZilliqa Application
---

---

We finally get to the transitions in the Smart Contract. We group the transitions in the following types. [The source code](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/main/src/scilla/RentOnZilliqa.scilla).

- [User Transitions](#user-transitions)
  - [`create_user`](#create_user)
- [Listing Transitions](#listing-transitions)
  - [`create_listing`](#create_listing)
  - [`update_listing`](#update_listing)
  - [`delete_listing`](#delete_listing)
  - [`book_listing`](#book_listing)
  - [`claim_rent`](#claim_rent)
- [Owner Transitions](#owner-transitions)
  - [`claim_commission`](#claim_commission)
  - [`update_commission`](#update_commission)
  - [`update_night_duration`](#update_night_duration)

## User Transitions

### `create_user`

This transition accepts the `name` and `role` of the new user.

If the user already exists, the [`user_exists`](dev-rentonzilliqa-library.md#account-codes) message is sent back.

If not, the [`user_name`](dev-rentonzilliqa-mutable-variables.md#user-details-fields) and [`user_role`](dev-rentonzilliqa-mutable-variables.md#user-details-fields) fields are set. The [`user_created`](dev-rentonzilliqa-library.md#account-codes) message is sent back.

| Arguments | Description                                       | Type     |
| --------- | ------------------------------------------------- | -------- |
| `name`    | The name of the user                              | `String` |
| `role`    | The role of the user<br/>(`0`: Renter, `1`: Host) | `Uint32` |

```ocaml
transition create_user (name: String, role: Uint32)
  user_exists_check <- exists user_name[_sender];
  match user_exists_check with
  | True =>
    send_message zero user_exists
  | False =>
    user_name[_sender] := name;
    user_role[_sender] := role;
    send_message zero user_created
  end
end
```

<br />

## Listing Transitions

This group of transitions is used in the transitions that a host account user may use to manage their listings.

### `create_listing`

This transition is used by a host user to create a listing.

The [`user_role`](dev-rentonzilliqa-mutable-variables.md#user-details-fields) is checked.

The [`listing_id_generator`](dev-rentonzilliqa-mutable-variables.md#owner-fields) is used to set a new id for the listing, after which it is incremented.

The [`set_listing_details`](dev-rentonzilliqa-procedures.md#set_listing_details) procedure is called to create the listing, and some of the listing fields are initialised, including [`listing_host`](dev-rentonzilliqa-mutable-variables.md#listing-details-fields), [`listing_rented_till`](dev-rentonzilliqa-mutable-variables.md#user-details-fields), and [`listing_accumulated_rent`](dev-rentonzilliqa-mutable-variables.md#user-details-fields).

The [`listing_created`](dev-rentonzilliqa-library.md#host-account-codes) message is sent on success.

On failure, the [`user_is_renter`](dev-rentonzilliqa-library.md#renter-account-codes) or [`user_does_not_exist`](dev-rentonzilliqa-library.md#account-codes) messages are sent back.

| Arguments     | Description                                                                                   | Type      |
| ------------- | --------------------------------------------------------------------------------------------- | --------- |
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
transition create_listing (
  name: String, description: String, price: Uint128,
  rooms: Uint32, bathrooms: Uint32, image: String, location: String,
  wifi: String, laundry: String, hvac: String, tv: String, kitchen: String
)
  user_exists_check <- exists user_name[_sender];
  match user_exists_check with
  | True =>
    role <- user_role[_sender];
    match role with
    | Some role =>
      user_role_check = builtin eq role user_role_host;
      match user_role_check with
      | True =>
        id <- listing_id_generator;
        current_block_number <- & BLOCKNUMBER;
        listing_host[id] := _sender;
        set_listing_details id name description price rooms bathrooms image location wifi laundry hvac tv kitchen;
        listing_rented_till[id] := current_block_number;
        listing_accumulated_rent[id] := zero;
        next_listing_id = builtin add id one;
        listing_id_generator := next_listing_id;
        send_message zero listing_created
      | False =>
        send_message zero user_is_renter
      end
    | None =>
      send_message zero user_does_not_exist
    end
  | False =>
    send_message zero user_does_not_exist
  end
end
```

<br />

### `update_listing`

This transition is used by the host user to update the [Listing Details](dev-rentonzilliqa-mutable-variables.md#listing-details-fields) for the given listing.

The `_sender` wallet address is checked if it is indeed the host of the listing.

The [`set_listing_details`](dev-rentonzilliqa-procedures.md#set_listing_details) procedure is used to update the details.

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
transition update_listing (
  id: Uint128, name: String, description: String, price: Uint128,
  rooms: Uint32, bathrooms: Uint32, image: String, location: String,
  wifi: String, laundry: String, hvac: String, tv: String, kitchen: String
)
  host <- listing_host[id];
  match host with
  | Some host =>
    user_is_host_check = builtin eq host _sender;
    match user_is_host_check with
    | True =>
      set_listing_details id name description price rooms bathrooms image location wifi laundry hvac tv kitchen;
      send_message zero listing_updated
    | False =>
      send_message zero user_is_not_host
    end
  | None =>
    send_message zero listing_does_not_exist
  end
end
```

<br />

### `delete_listing`

This transition is used by the host user to delete a particular listing.

The `_sender` wallet address is checked if it is indeed the host of the listing.

It checks if the accumulated rent for the listing is empty.

The [`delete_listing_by_id`](dev-rentonzilliqa-procedures.md#delete_listing_by_id) procedure is used to delete the listing.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
transition delete_listing (id: Uint128)
  host <- listing_host[id];
  match host with
  | Some host =>
    user_is_host_check = builtin eq host _sender;
    match user_is_host_check with
    | True =>
      accumulated_rent_value <- listing_accumulated_rent[id];
      match accumulated_rent_value with
      | Some accumulated_rent_value =>
        no_rent = builtin eq accumulated_rent_value zero;
        match no_rent with
        | True =>
          delete_listing_by_id id;
          send_message zero listing_deleted
        | False =>
          send_message zero rent_not_empty
        end
      | None =>
        send_message zero listing_details_missing
      end
    | False =>
      send_message zero user_is_not_host
    end
  | None =>
    send_message zero listing_does_not_exist
  end
end
```

<br />

### `book_listing`

This transition is used by a renter user to book a listing.

The `_sender` wallet address is checked to ensure it is not the host of the listing.

The [`check_listing_available`](dev-rentonzilliqa-procedures.md#check_listing_available), [`check_amount_and_book`](dev-rentonzilliqa-procedures.md#check_amount_and_book), and [`book_listing_by_id`](dev-rentonzilliqa-procedures.md#book_listing_by_id) procedures are used in sequence to book the listing.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
transition book_listing (id: Uint128)
  user_exists_check <- exists user_name[_sender];
  match user_exists_check with
  | True =>
    host <- listing_host[id];
    match host with
    | Some host =>
      user_is_host_check = builtin eq host _sender;
      match user_is_host_check with
      | True =>
        send_message zero user_is_host
      | False =>
        check_listing_available id
      end
    | None =>
      send_message zero listing_does_not_exist
    end
  | False =>
    send_message zero user_does_not_exist
  end
end
```

<br />

### `claim_rent`

This transition is used by a host user to claim the accumulated rent from a listing that they own.

The `_sender` wallet address is checked to ensure it is indeed the host of the listing.

The [`claim_rent_by_id`](dev-rentonzilliqa-procedures.md#claim_rent_by_id) procedure is used to claim the rent.

| Arguments | Description           | Type      |
| --------- | --------------------- | --------- |
| `id`      | The ID of the listing | `Uint128` |

```ocaml
transition claim_rent (id: Uint128)
  user_exists_check <- exists user_name[_sender];
  match user_exists_check with
  | True =>
    host <- listing_host[id];
    match host with
    | Some host =>
      user_is_host_check = builtin eq host _sender;
      match user_is_host_check with
      | True =>
        claim_rent_by_id id
      | False =>
        send_message zero user_is_not_host
      end
    | None =>
      send_message zero listing_does_not_exist
    end
  | False =>
    send_message zero user_does_not_exist
  end
end
```

<br />

## Owner Transitions

This group of transitions is used by the owner to manage the platform.

### `claim_commission`

This transition is used to claim the commission collected on the platform.

The `_sender` wallet address is checked to ensure it is the owner of the contract.

The `_balance` from the contract is sent to the owner via a message.

```ocaml
transition claim_commission ()
  is_owner = builtin eq owner _sender;
  match is_owner with
  | False =>
    send_message zero user_is_not_owner
  | True =>
    balance <- _balance;
    send_message balance commission_claimed
  end
end
```

<br />

### `update_commission`

This transition is used to update the commission collected from each rental.

The `_sender` wallet address is checked to ensure it is the owner of the contract.

The [`owners-commission`](dev-rentonzilliqa-mutable-variables.md#owner-fields) field is updated to `new_commission`.

| Arguments        | Description                    | Type      |
| ---------------- | ------------------------------ | --------- |
| `new_commission` | A new value for the commission | `Uint128` |

```ocaml
transition update_commission (new_commission: Uint128)
  is_owner = builtin eq owner _sender;
  match is_owner with
  | False =>
    send_message zero user_is_not_owner
  | True =>
    owners_commission := new_commission;
    send_message zero commission_updated
  end
end
```

<br />

### `update_night_duration`

This transition is used to update the night duration value that is added to the `BLOCKNUMBER` to create the notion of time.

The `_sender` wallet address is checked to ensure it is the owner of the contract.

The [`night_duration`](dev-rentonzilliqa-mutable-variables.md#owner-fields) field is updated to `new_night_duration`.

| Arguments            | Description                        | Type     |
| -------------------- | ---------------------------------- | -------- |
| `new_night_duration` | A new value for the night duration | `Uint32` |

```ocaml
transition update_night_duration (new_night_duration: Uint32)
  is_owner = builtin eq owner _sender;
  match is_owner with
  | False =>
    send_message zero user_is_not_owner
  | True =>
    night_duration := new_night_duration;
    send_message zero night_duration_updated
  end
end
```
