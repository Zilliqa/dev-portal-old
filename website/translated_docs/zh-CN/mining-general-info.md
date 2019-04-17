---
id: mining-general-info
title: 一般信息
---

## 挖掘设置架构

挖掘设置架构不同于您熟悉的常规设置，其中节点和矿工都是一个单一实例（即挖以太坊或比特币）。下面是Zilliqa挖矿架构的形式。这两方之间的所有通信都是通过JSON-RPC协议实现的。

![1-to-many](https://i.imgur.com/qReRpRx.jpg)

- CPU节点实例将运行 **Zilliqa客户端**并执行pBFT共识流程以获得奖励。
- GPU集群中的GPU装备将在单独的GPU集群上运行 **Zilminer**，以进行PoW挖矿并直接向CPU节点提供PoW解决方案。

## Epoch架构

![Zilliqa Epoch Architecture](https://i.imgur.com/Da4t6FW.png)

在每个DS Epoch开始时，所有候选人都将运行工作证明（Ethash算法）过程`60`秒窗口，以便竞争加入Zilliqa网络。

- 满足`DS_POW_DIFFICULTY`参数的节点将能够作为DS节点加入。
- 满足`POW_DIFFICULTY`参数的节点将作为分片节点加入。

每个DS Epoch（约2-3小时）内总共有`100`个TX时期（每个1-2分钟）。第100个TX时期被称为 **Vacuous epoch**。

Vacuous epoch会独立处理：

- 所有节点的coinbase奖励机制
- 升级机制（因为pBFT中没有分支）
- 持久状态存储（写入节点的DB而不是仅存储在内存中）。

在这个时期，网络不会处理任何交易。

## “工作证明”算法

Zilliqa的“工作证明”算法采用了[**Ethash**](https://github.com/ethereum/wiki/wiki/Ethash). 所以Zilliqa采用了 **DAG（有向无环图）**作为工作量证明算法，该算法以每个 **DS epoch**的增量率生成。自举DAG大小约为`1.02GB`。

## 网络难度

主网的自助最低难度等级为10。此难度级别是动态的，并根据每个DS epoch的提交目标值`1810`以每`+/- 100`调整`+/- 1`的幅度执行。

> 注意：难度级别是log2（难度）。

假设网络中有`1810`个席位但是有`1910`个PoW提交，则下一个DS epoch的难度等级将增加1。

假设网络中有`1810`个席位但是有`1710`个PoW提交，则下一个DS epoch的难度等级将减少1。

## 奖励机制

在Zilliqa网络中，奖励被分类为：

- 基础奖励 **[总数的25％]**，用于网络中的所有验证节点（DS / shard）
- 灵活奖励 **[总数的70％]**，基于节点在执行pBFT共识期间提交的有效和已接受签名（前2/3）的数量

基本奖励和灵活奖励对于所有DS和分片节点具有相同的权重。所有奖励都在整个DS epoch得到统一，并且仅在vacuous epoch分发。

请注意，奖励的最后5％将提供给查询和种子节点。

例如，如果Zilliqa网络中总共有`2,400`个节点，并且每个DS Epoch的`COINBASE_REWARD`设置为`263698.630137`ZILs，则奖励分配将是：

- 基本奖励：

```
263698.630137 * 0.25 / 2400
每个DS Epoch每个节点ZILs = 27.4686073059375
```

- 灵活奖励:(以先到先得的方式）

```
263698.630137 * 0.70 /(2,400 * 2/3 [成功签名者] * 99 [TX区块]）
每个有效和接受的签名ZILs = 1.165334855403409 
```

## 

> 注意：为了保证这个新生网络的稳定性，Zilliqa的Guard节点被部署在主网中。这些Guard节点始终保持在主网内但不进行PoW，所以它们不会得到奖励。但是，分发之前的奖励分配会包括Guard节点。因此，对于设法满足PoW要求的非Guard节点将不会有“额外”奖励。

通过复制[**奖励计算器**](https://docs.google.com/spreadsheets/d/1iA3DvXMiAql6bf1mGHHxfGLICm0wZ2Gav5HzRkP81j4/edit?usp=sharing)并编辑黄色突出显示的单元格，可查询每日采矿盈利能力。