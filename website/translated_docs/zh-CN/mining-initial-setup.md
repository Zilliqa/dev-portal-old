---
id: mining-initial-setup
title: 初始安装
---

## Zilliqa客户端的网络配置

> **注意：**如果您使用的是家用路由器，则很可能是在NAT环境中。

如果您在NAT环境中，您可以：

- 使用 **选项1a**进行单端口转发。这应该是你的 **默认选项**。
- 如果您的路由器支持UPnP，则使用 **选项1b**启用UPnP模式。

如果您有公共IP地址，则可以完全跳过此网络设置。

### 选项1a

端口转发到端口“33333”，用于外部端口（端口范围）和内部端口（本地端口）。在端口转发时，您还必须在路由器菜单中选择 **BOTH** TCP和UDP协议选项。 <br><br> [**这里**](https://www.linksys.com/us/support-article?articleNum=136711)可以找到此过程的一个示例。在端口转发后，您可以使用此[**开放端口检查工具**](https://www.yougetsignal.com/tools/open-ports/)检查您是否已成功转发端口。

### 选项1b

在家用路由器上启用UPnP模式。请谷歌如何访问您的家庭路由器设置以启用UPnP，[**这里**](https://routerguide.net/how-to-enable-upnp-for-rt-ac66u/)可以找到一个示例。您可以通过安装以下工具来检查是否已启用UPnP：
   ```shell
   sudo apt-get install miniupnpc
   ```
  然后在命令行中键入以下内容：
   ```shell
   upnpc -s
   ```
您应该收到一条消息，显示：

   - "List of UPNP devices found on the network : ..."
   - **或** "No IGD UPnP Device found on the network !".

第一个消息表示UPnP模式已成功启用，而后者表示启用UPnP模式失败。如果您收到后一条消息，请继续使用**选项1a**。

## ZilMiner的GPU驱动安装

### OpenCL驱动安装 (AMD/Nvidia GPUs)

如果您希望使用支持OpenCL的GPU进行PoW，请运行以下代码来安装OpenCL开发人员包:

   ```shell
   sudo apt install ocl-icd-opencl-dev
   ```

您可能需要重新启动PC才能使安装生效。重新启动后，使用以下命令检查驱动程序是否已正确安装：

   ```shell
   clinfo
   ```
如果您遇到缺少OpenCL驱动程序等问题，请查阅此论坛指南[**点击这里**](https://forum.zilliqa.com/t/guide-to-setting-up-6-amd-gpus-on-ubuntu-16-04/180)。 （感谢@Speccles96）

### CUDA驱动安装 (仅供Nvidia GPUs使用)

如果您希望使用支持CUDA的GPU进行PoW，请从[NVIDIA官网](https://developer.nvidia.com/cuda-downloads)下载与安装CUDA软件包。您可能需要重新启动PC才能使安装生效。
