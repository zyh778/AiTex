#!/bin/bash

echo "========================================="
echo "安装 WebKit2GTK for Tauri"
echo "========================================="

# 添加 Ubuntu Universe 仓库（如果尚未添加）
echo "确保 Universe 仓库已启用..."
sudo add-apt-repository universe -y

# 更新软件包列表
echo "更新软件包列表..."
sudo apt-get update

# 尝试安装 webkit2gtk-4.1
echo "尝试安装 webkit2gtk-4.1-dev..."
sudo apt-get install -y webkit2gtk-4.1-dev

# 如果失败，尝试安装 webkit2gtk-4.0
if [ $? -ne 0 ]; then
    echo "webkit2gtk-4.1 未找到，尝试安装 webkit2gtk-4.0-dev..."
    sudo apt-get install -y webkit2gtk-4.0-dev
fi

# 如果还是失败，安装默认版本
if [ $? -ne 0 ]; then
    echo "安装默认 webkit2gtk-dev..."
    sudo apt-get install -y webkit2gtk-dev
fi

# 验证安装
echo ""
echo "验证安装..."
pkg-config --list-all | grep webkit

echo ""
echo "========================================="
echo "✅ WebKit 安装尝试完成！"
echo ""
echo "请重新运行："
echo "  npm run tauri:dev"
echo "========================================="