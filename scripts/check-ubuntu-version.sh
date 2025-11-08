#!/bin/bash

echo "========================================="
echo "Ubuntu 版本和依赖检查"
echo "========================================="
echo ""

# 检查 Ubuntu 版本
echo "Ubuntu 版本："
lsb_release -a
echo ""

# 检查已安装的 webkit 版本
echo "已安装的 WebKit 版本："
pkg-config --list-all | grep -i webkit
echo ""

# 检查可用的 webkit 包
echo "可用的 WebKit 包："
apt list --installed | grep -i webkit
echo ""

echo "可安装的 WebKit 包："
apt search webkit2gtk 2>/dev/null | grep -E "webkit2gtk-[0-9]"