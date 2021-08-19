---
id: dev-rentonzilliqa-mutable-variables
title: Mutable Variables
keywords:
  - scilla
  - mutable
  - variables
  - rentonzilliqa
description: The Fields of the Scilla Contract for the RentOnZilliqa Application
---

---

In this section, we look at the mutable fields declared in the contract. [The source code](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/main/src/scilla/RentOnZilliqa.scilla).

## Declaring the Mutable Fields

The fields can be grouped into the following types based on their purpose.

### Owner Fields

These fields can be modified by the owner of the contract. They dictate the behavior of the platform.

| Field                  | Description                                                                | Type      | Initial value |
| ---------------------- | -------------------------------------------------------------------------- | --------- | ------------- |
| `owners_comission`     | The commission collected by the platform owner on every rental             | `Uint128` | `10`          |
| `night_duration`       | The change in `BLOCKNUMBER` that is understood to be a night               | `Uint32`  | `10`          |
| `listing_id_generator` | A variable that is incremented to generate sequential IDs for new listings | `Uint128` | `zero`        |

### User Details Fields

These `Map` fields are dictionaries that are used to store details about the user accounts created on the platform. The `key` for each of them is the Wallet Address of the user.

| Field       | Description                                       | Type                 | Initial value        |
| ----------- | ------------------------------------------------- | -------------------- | -------------------- |
| `user_name` | The name of the user                              | `Map ByStr20 String` | `Emp ByStr20 String` |
| `user_role` | The role of the user<br/>(`0`: Renter, `1`: Host) | `Map ByStr20 Uint32` | `Emp ByStr20 Uint32` |

### Listing Details Fields

These `Map` fields are dictionaries that are used to store details about each listing. The `key` for each of them is the ID as explained with the `listing_id_generator` in the [Owner Fields](#owner-fields). The `value` is the listing information corresponding to the field.

| Field                      | Value description                                                                             | Type                  | Initial value         |
| -------------------------- | --------------------------------------------------------------------------------------------- | --------------------- | --------------------- |
| `listing_host`             | The wallet address of the host account that created the listing                               | `Map Uint128 ByStr20` | `Emp Uint128 ByStr20` |
| `listing_renter`           | The wallet address of the current renter of the listing                                       | `Map Uint128 ByStr20` | `Emp Uint128 ByStr20` |
| `listing_rented_till`      | The `BLOCKNUMBER` until which the listing is rented                                           | `Map Uint128 BNum`    | `Emp Uint128 BNum`    |
| `listing_name`             | The name of the listing                                                                       | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_description`      | The description of the listing                                                                | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_price`            | The price of the listing                                                                      | `Map Uint128 Uint128` | `Emp Uint128 Uint128` |
| `listing_rooms`            | The number of rooms in the listing                                                            | `Map Uint128 Uint32`  | `Emp Uint128 Uint32`  |
| `listing_bathrooms`        | The number of bathrooms in the listing                                                        | `Map Uint128 Uint32`  | `Emp Uint128 Uint32`  |
| `listing_image`            | A URL to an image of the listing                                                              | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_location`         | A [Google Maps Plus Code](https://maps.google.com/pluscodes/) for the location of the listing | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_wifi`             | The availability of WiFi at the listing                                                       | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_laundry`          | The availability of a Landry at the listing                                                   | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_hvac`             | The availability of an HVAC at the listing                                                    | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_tv`               | The availability of a TV at the listing                                                       | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_kitchen`          | The availability of a Kitchen at the listing                                                  | `Map Uint128 String`  | `Emp Uint128 String`  |
| `listing_accumulated_rent` | The rent accumulated for the listing                                                          | `Map Uint128 Uint128` | `Emp Uint128 Uint128` |
