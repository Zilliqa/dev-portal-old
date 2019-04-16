# Token交换时间表和概述



#### 注意

> Zillings（“ZILs”）的临时Zillings（“临时ZILs”）不能提供、出售或转让给美国人（如1933年美国证券法第S条所定义）。请确保在交换临时ZIL时，确认ZIL的每个持有人不是美国人（如1933年美国证券法第S条所定义）。



## 概述

以下流程图说明了交换的Token交换过程。

![token swap](https://zilliqa.github.io/dev-portal/img/token_swap_210119_3.png)

从交易所的角度来看，进一步描述如下：

- 确定进行交换的日期（例如：2019年5月31日）
- 交换日期前1周，所有**ERC20 ZIL**交易必须冻结
- 2019年5月31日，将所有**ERC20 ZIL**发送至**ETHEREUM**的`ZilSwap`合同（地址待提供）
- 一旦超过30个区块，请告知Zilliqa您的交易哈希，并提供**一个**您想在**Zilliqa**区块链上接收本地ZIL的地址。
- 本地ZIL将存入您选择的地址。
- 使用**本地ZIL**恢复交易。

## 时间表

### Bootstrap阶段：2019年2月至3月

在此阶段，网络上不处理任何交易。 此时交易所不需要采取任何行动。

### Token交换阶段：2019年4月至6月

交易所应选择此范围内的日期，并至少提前**一个月**通知Zilliqa。 此后，交易所应在指定日期进行**一次**上述一次性交换。

交易所可以支持**ETHEREUM**上的**ERC20 ZIL**交易，直到Token交换日期**前一周**，此时**所有**交易必须冻结，直到交易所在**Zilliqa**网络上收到**本地ZIL**。

此后，交易所应使用[示例程序](https://github.com/Zilliqa/dev-portal/tree/master/examples/exchange)作为指导，仅支持在Zilliqa上的ZIL交易，这并不包括ERC20交易。

### 冻结与销毁: 2019年7月

2019年7月1日，所有送往ZilSwap的ERC20 ZIL将被销毁，所有剩余的ERC20 ZIL（即未开封的ZIL）的转移也会被冻结。 所有剩余的ERC20 ZIL将无法更换。

