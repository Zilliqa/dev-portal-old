---
id: mining-initial
title: Initial Setup
---
## Network setup for Zilliqa client

> **NOTE:** If you are using a home router, you are most probably in a NAT environment.

If you are in NAT environment, you can either:

- Do single port forwarding using **Option 1a**. This should be your **DEFAULT OPTION**.
- Enable UPnP mode using **Option 1b** if your router does support UPnP.

If you have a public IP address, you can skip this network setup section entirely.

### Option 1a

Port forward to port `33133` for both external port (port range) and internal port (local port). You will also have to select the option for **BOTH** TCP and UDP protocol in your router menu when port forwarding. <br><br> An example of this process can be found [**HERE**](https://www.linksys.com/us/support-article?articleNum=136711). After port forwarding, you may check if you have successfully port forwarded with this [**Open Port Check Tool**](https://www.yougetsignal.com/tools/open-ports/).

### Option 1b

Enable UPnP mode on your home router. Please Google how to access your home router setting to enable UPnP, an example can be found [**HERE**](https://routerguide.net/how-to-enable-upnp-for-rt-ac66u/). You can check if you have enabled it UPnP by installing the following tool:
   ```shell
   sudo apt-get install miniupnpc
   ```
Then type the following in the command line:
   ```shell
   upnpc -s
   ```
You should get a message showing either:

   - "List of UPNP devices found on the network : ..."
   - **OR** "No IGD UPnP Device found on the network !".

The first message means UPnP mode has been enabled successfully, while the latter means the enabling of UPnP mode has failed. If you receive the latter message, proceed with using [**Option 1a**](#option-1a) instead.

## GPU driver setup for Zilminer

### OpenCL driver setup (for AMD/Nvidia GPUs)

If you wish to use OpenCL supported GPUs for PoW, please run the following to install the OpenCL developer package:

   ```shell
   sudo apt install ocl-icd-opencl-dev
   ```

You may need to reboot your PC for the installation to take effect. After reboot, check if your drivers are installed properly with the following command:

   ```shell
   clinfo
   ```
If you are facing issues such as missing OpenCL drivers, please follow this forum guide found [**HERE**](https://forum.zilliqa.com/t/guide-to-setting-up-6-amd-gpus-on-ubuntu-16-04/180). (Credits to @Speccles96)

### CUDA driver setup (for Nvidia GPUs only)

If you wish to use CUDA supported GPU for PoW, please download and install CUDA package from the [**NVIDIA official webpage**](https://developer.nvidia.com/cuda-downloads). You may need to reboot your PC for the installation to take effect.
