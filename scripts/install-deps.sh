#!/bin/bash

# AiTeX Ubuntu/Debian 依赖安装脚本
echo "========================================="
echo "AiTeX - 系统依赖安装脚本"
echo "========================================="
echo ""
echo "此脚本将安装 Tauri 应用所需的系统依赖"
echo ""

# 更新软件包列表
echo "正在更新软件包列表..."
sudo apt-get update

# 安装基本构建工具
echo ""
echo "正在安装基本构建工具..."
sudo apt-get install -y \
    build-essential \
    curl \
    wget \
    file \
    pkg-config

# 安装 GTK 开发库
echo ""
echo "正在安装 GTK 开发库..."
sudo apt-get install -y \
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# 安装其他必需的库
echo ""
echo "正在安装其他必需库..."
sudo apt-get install -y \
    libssl-dev \
    libglib2.0-dev \
    libgobject-2.0-dev \
    libgio2.0-dev \
    libsoup-3.0-dev \
    libjavascriptcoregtk-4.1-dev

# 清理
echo ""
echo "清理不需要的软件包..."
sudo apt-get autoremove -y

echo ""
echo "========================================="
echo "✅ 安装完成！"
echo ""
echo "现在可以运行："
echo "  npm run tauri:dev"
echo ""
echo "如果仍有问题，可能需要："
echo "  sudo reboot"
echo "========================================="