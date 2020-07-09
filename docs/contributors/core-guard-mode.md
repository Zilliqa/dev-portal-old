---
id: core-guard-mode
title: Guard Mode
---

---
Guard mode is a special operating mode in Zilliqa that can be used to maintain stability of the Mainnet until the protocol has been made perfectly robust. Guard mode ensures the following:

- A maximum of `n` nodes (e.g., 2/3) in the DS committee are nodes operated by Zilliqa Research
- A maximum of `n` nodes (e.g., 1/3) across all shards are nodes operated by Zilliqa Research
- DS leader selection (in either normal or view change situations) will only include nodes operated by Zilliqa Research

:::note
Guard mode is designed to be toggleable and does not interfere with the standard protocol whether or not it is enabled.
:::

## Terminology

- DS guard - DS node operated by Zilliqa Research
- Shard guard - Shard node operated by Zilliqa Research

## Configuration

1. To enable guard mode, set `GUARD_MODE` to `true` in `constants.xml`
1. Add `n` DS guard public keys to the `ds_guard.DSPUBKEY` section in `constants.xml`
1. Add `n` shard guard public keys to the `shard_guard.SHARDPUBKEY` section in `constants.xml`
1. Adjust `SHARD_GUARD_TOL` in `constants.xml` to control the minimum percentage of shard guards in each shard

## Normal Operation

A DS guard is designed to be statically placed inside the DS committee. Given `n` DS guards, the first `n` slots in the DS committee will be allocated for those DS guards. While in guard mode, these positions do not change or shift during each DS consensus or view change.

<table>
  <tr>
    <th colspan="2">DS Committee</th>
  </tr>
  <tr>
    <td>1 ... n = DS guards (operated by Zilliqa Research)</td>
    <td>n+1 ... m = non-guard nodes</td>
  </tr>
</table>

The DS leader is selected from these DS guards by doing `mod n` rather than `mod m`.

A non-guard node joins the DS committee via [PoW](core-pow.md) as usual. If selected, it is inserted in the committee starting at index `n+1`. Following the [DS MIMO](core-ds-mimo.md) convention, the last few DS nodes (non-guards) are ejected from the DS committee to preserve the committee size.

:::note
The DS reputation feature (starting Zilliqa version 5.0.0) also impacts DS committee member placement. Please refer to both [DS MIMO](core-ds-mimo.md) and [DS Reputation](core-ds-reputation.md) sections for more information on how the DS committee membership is managed.
:::

## View Change Operation

When a view change occurs, it is likely that the DS leader (a DS guard) is faulty or the network failed to agree with what the DS leader proposed. In such a case, the view change candidate leader will be selected from among the `n` DS guards by doing `mod n` rather than `mod m`.

Upon view change completion, there is no shifting of the DS guard nodes, i.e., the DS guards stay in place (even the faulty ones). The shard nodes who receive the generated VC block will also not adjust these nodes in their own view of the DS committee.

After the view change, the DS committee updates their `m_consensusLeaderID` to the new leader and the protocol resumes.

## Shard Guard Design

Shard guards are placed within shards in a manner such that there is a sufficient number of these Zilliqa-operated nodes in every shard. Shard guards are special as:

- They only do PoW with difficulty 1
- They cannot join the DS committee (hence, they only perform PoW to enter a shard)
- Their PoW submissions are given priority by the DS committee over normal shard nodes' submissions

After the PoW window is over, the DS committee will begin to compose the sharding structure. The DS leader, as per the protocol, will trim the list of nodes such that each shard will be expected to have exactly `COMM_SIZE` number of nodes. In guard mode, shard guards are given priority during the trimming, which means non-guard nodes are trimmed away first. With the trimmed list, the DS leader will then randomly assign each node (shard guard and non-shard guard) to its respective shard.

## Shard Rebalancing

When determining the shard composition - particularly in the event that the number of shards in the new DS epoch is lower than in the previous one - we must ensure that the newly composed shards will not be entirely made up of guards.

To do this, we trim the overall number of shard guards to 2/3 of the expected population (e.g., 1200 out of 1800), and then complete the count with non-shard guards. In the case where there are insufficient non-guard nodes, shard guard nodes will fill up the remaining slots.

Keywords to look for in the logs:

```console
DS leader:
trimmedGuardCount: [some value] trimmedNonGuardCount: [some value] Total number of accepted soln: [some value]

Example:
trimmedGuardCount: 80 trimmedNonGuardCount: 40 Total number of accepted soln: 120
```

## Shard Leader Selection

A best effort approach for selecting a shard guard as the shard leader was introduced in [PR 1513](https://github.com/Zilliqa/Zilliqa/pull/1513).

Whether or not guard mode is enabled, the basic formula for calculating the new shard leader is:

```console
Leader index = last block hash % shard size
```

In guard mode, the calculation is invoked repeatedly as follows:

```console
Leader index = last block hash % shard size

while leader is not a shard guard (iterate up to SHARD_LEADER_SELECT_TOL times)
  Hash = sha2(last block hash)
  Leader index = Hash % shard size
```

## Runtime Validation

Guard mode is designed to work when the following assumption holds:

- number of new DS nodes injected into the shards >= number of allowed non-guard shard nodes

Using a simple local run as an example:

- Number of nodes: 20
- DS nodes: 10
- Shard size: 5
- DS MIMO: 2

<table>
  <tr>
    <th colspan="2">DS Committee</th>
  </tr>
  <tr>
    <td>DS guards (8)</td>
    <td>Non-guards (2)</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2">Shard 1</th>
  </tr>
  <tr>
    <td>Shard guards (4)</td>
    <td>Non-guards (1)</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2">Shard 2</th>
  </tr>
  <tr>
    <td>Shard guards (4)</td>
    <td>Non-guards (1)</td>
  </tr>
</table>

In this example, if the network is reduced from 2 shards to 1, the DS MIMO process will inject more nodes (the 2 oldest non-guard DS nodes) into the shard than the shard limit (5).

<table>
  <tr>
    <th colspan="2">DS Committee</th>
  </tr>
  <tr>
    <td>DS guards (8)</td>
    <td>Non-guards (2)</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2">Shard 1</th>
  </tr>
  <tr>
    <td>Shard guards (4)</td>
    <td><b>Non-guards (2)</b></td>
  </tr>
</table>

There is no easy solution around it. Hence, `ValidateRunTimeEnvironment()` checks for such a condition and terminates the node with a log message if it happens.

## Changing Network Information of DS Guards

It is not uncommon for nodes in the network to go down and then attempt to rejoin under a different IP address. Under normal operation without guard mode, faulty DS nodes can be gracefully kicked out of the DS committee using regular shifting and view change if necessary. However, in guard mode, DS guards do not shift and stay in the DS committee indefinitely. As such, we can possibly lose a node forever if the DS guard has gone down and changed its IP address.

To address this situation, we have devised a simple protocol for the DS guard to rejoin and update the network about its new information.

The steps are:

1. DS guard goes down and restarts with (possibly) a different IP address
1. DS guard completes rejoin sequence and enters `FinishRejoinAsDS()`
1. DS guard broadcasts its updated information (pubkey, network info, and timestamp) to the lookups, and gossips the same to the DS committee
1. DS committee and lookup update their view of the DS committee
1. Lookup stores the updated information
1. At the next vacuous epoch, all shard nodes query the lookup for any updated DS guard network information
1. Lookup will not respond if there is no new information
1. Otherwise, lookup sends the information to the requesting shard nodes
1. The requesting shard nodes verify the message and update their view of the DS committee

![image01](../../assets/core/features/guard-mode/image01.png)