---
id: dev-rentonzilliqa-library
title: Library
keywords:
  - scilla
  - library
  - rentonzilliqa
description: The Library of the Scilla Contract for the RentOnZilliqa Application
---

---

We start with the library for RentOnZilliqa. We declare the `one_msg` helper function. The [source code can be found here](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/93273d0af6776e28f998ba4a63df3053545a1eeb/src/scilla/RentOnZilliqa.scilla#L6).

## Message Codes

Then we get to creating a handful of message codes we will use to communicate with the frontend. The codes are of type `Int32`.

The codes are grouped into three categories:

- [Account codes](#account-codes)
- [Host account codes](#host-account-codes)
- [Renter account codes](#renter-account-codes)

### Account Codes

These codes are general codes that apply to all users that communicate with the contract [(the source code)](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/93273d0af6776e28f998ba4a63df3053545a1eeb/src/scilla/RentOnZilliqa.scilla#L12).

| Name                     | Code | Description                                         | Type    |
| ------------------------ | :--: | --------------------------------------------------- | ------- |
| `user_created`           | `01` | Successfully created user                           | `Int32` |
| `user_exists`            | `02` | User already exists                                 | `Int32` |
| `user_does_not_exist`    | `03` | User does not exist                                 | `Int32` |
| `user_is_not_owner`      | `04` | Cannot update/claim commission as user is not owner | `Int32` |
| `commission_claimed`     | `05` | Commission claimed by owner                         | `Int32` |
| `commission_updated`     | `06` | Commission updated by owner                         | `Int32` |
| `night_duration_updated` | `07` | Night Duration updated by owner                     | `Int32` |

### Host Account Codes

These codes are codes specifically used to communicate after actions relating to host accounts [(the source code)](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/93273d0af6776e28f998ba4a63df3053545a1eeb/src/scilla/RentOnZilliqa.scilla#L21).

| Name               | Code | Description                                      | Type    |
| ------------------ | :--: | ------------------------------------------------ | ------- |
| `listing_created`  | `11` | Successfully created listing                     | `Int32` |
| `listing_updated`  | `12` | Successfully updated listing                     | `Int32` |
| `listing_deleted`  | `13` | Successfully deleted listing                     | `Int32` |
| `rent_claimed`     | `14` | Successfully claimed rent from listing           | `Int32` |
| `rent_empty`       | `15` | No accumulated rent for listing being claimed    | `Int32` |
| `rent_not_empty`   | `16` | Cannot delete listing as it has accumulated rent | `Int32` |
| `user_is_host`     | `17` | Cannot book listing because user is host         | `Int32` |
| `user_is_not_host` | `18` | Cannot manage listing because sender is not host | `Int32` |

### Renter Account Codes

These codes are codes specifically used to communicate after actions relating to renter accounts [(the source code)](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/93273d0af6776e28f998ba4a63df3053545a1eeb/src/scilla/RentOnZilliqa.scilla#L31).

| Name                      | Code | Description                                       | Type    |
| ------------------------- | :--: | ------------------------------------------------- | ------- |
| `listing_booked`          | `21` | Successfully booked listing                       | `Int32` |
| `listing_unavailable`     | `22` | Cannot book listing because it is rented          | `Int32` |
| `user_is_renter`          | `23` | Cannot create listing as user is a renter account | `Int32` |
| `wrong_amount_sent`       | `24` | Cannot book listing as amount is wrong            | `Int32` |
| `listing_does_not_exist`  | `25` | Cannot book listing because it does not exist     | `Int32` |
| `listing_details_missing` | `26` | Listing details are missing                       | `Int32` |

## Additional Constants

We define a few more additional constants for use within the contract. We create constants for storing the account roles. As well as some constants for ease of use. [(the source code)](https://github.com/Quinence/zilliqa-fullstack-app-rentOnZilliqa/blob/93273d0af6776e28f998ba4a63df3053545a1eeb/src/scilla/RentOnZilliqa.scilla#L39).

| Name               |  Code   | Type      |
| ------------------ | :-----: | --------- |
| `user_role_renter` |   `0`   | `Uint32`  |
| `user_role_host`   |   `1`   | `Uint32`  |
| `one`              |   `1`   | `Uint128` |
| `zero`             |   `0`   | `Uint128` |
| `true`             | `True`  | `Bool`    |
| `false`            | `False` | `Bool`    |
