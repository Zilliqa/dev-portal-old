---
id: mining-monitoring
title: 监控进程
---

您现在是Zilliqa主网的矿工，可以使用以下方法监视CPU节点上的进程：

```shell
tail -f zilliqa-00001-log.txt
```

## 检查密钥对

要检查*mykey.txt*文件中本地生成的公钥和私钥对，可以在CPU节点的命令提示符中输入以下内容：

```shell
less mykey.txt
```

第一个十六进制字符串是 **公钥**，第二个十六进制字符串是 **私钥**。

> **注意：**此密钥对是在磁盘上本地生成的。请记住将私钥保存在安全的地方！

## 查询ZIL余额

要查询挖矿余额，请在https://viewblock.io/zilliqa的搜索栏中输入myaddr.txt文件中的地址：

```shell
less myaddr.txt
```

## 停止挖矿进程

要停止挖矿客户端，请停止正在运行的docker容器，在CPU节点上运行**Zilliqa客户端**：

```shell
sudo docker stop zilliqa
```

您还需要在GPU平台上终止**Zilminer**进程。