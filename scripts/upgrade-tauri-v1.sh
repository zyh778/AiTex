#!/bin/bash

echo "========================================="
echo "降级到 Tauri 1.x（兼容旧系统）"
echo "========================================="
echo ""

# 备份当前文件
echo "备份当前配置..."
cp src-tauri/Cargo.toml src-tauri/Cargo.toml.backup
cp src-tauri/tauri.conf.json src-tauri/tauri.conf.json.backup
cp package.json package.json.backup
echo ""

# 更新 Cargo.toml
echo "更新 src-tauri/Cargo.toml..."
cat > src-tauri/Cargo.toml << 'EOF'
[package]
name = "aitex"
version = "2.0.0"
description = "AiTex - 智能数学公式识别软件"
authors = ["zstar1003"]
edition = "2021"

[build-dependencies]
tauri-build = { version = "1.0", features = [] }

[dependencies]
tauri = { version = "1.0", features = ["api-all"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
image = { version = "0.24", features = ["png"] }
base64 = "0.22"
arboard = "3.2"
anyhow = "1.0"
dirs = "5.0"
tempfile = "3.0"

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
EOF

# 更新 tauri.conf.json
echo "更新 src-tauri/tauri.conf.json..."
cat > src-tauri/tauri.conf.json << 'EOF'
{
  "$schema": "https://schema.tauri.app/config/1.0.0",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:1420",
    "distDir": "../dist"
  },
  "package": {
    "productName": "AiTex",
    "version": "2.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "dialog": {
        "all": false,
        "open": true,
        "save": true
      },
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "readDir": true,
        "copyFile": true,
        "createDir": true,
        "removeDir": true,
        "removeFile": true,
        "renameFile": true
      },
      "path": {
        "all": true
      },
      "protocol": {
        "all": false,
        "asset": true,
        "assetScope": ["$APPCONFIG", "$RESOURCE", "$APPDATA", "$APPLOCALDATA", "$APPCACHE", "$APPLOG"]
      }
    },
    "bundle": {
      "active": true,
      "category": "Productivity",
      "copyright": "",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.aitex.app",
      "longDescription": "AiTex 是一款免费的智能数学公式识别软件，能够将图像中的数学公式转换为可编辑的 LaTeX 格式。",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "智能数学公式识别软件",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 800,
        "resizable": true,
        "title": "AiTex - 数学公式识别",
        "width": 1200,
        "minWidth": 1000,
        "minHeight": 600,
        "center": true
      }
    ]
  }
}
EOF

# 更新 package.json
echo "更新 package.json 中的 Tauri 依赖..."
npm uninstall @tauri-apps/cli @tauri-apps/api
npm install @tauri-apps/cli@^1.0.0 @tauri-apps/api@^1.0.0

echo ""
echo "========================================="
echo "✅ Tauri 已降级到 1.x 版本！"
echo ""
echo "清理旧的编译缓存..."
rm -rf src-tauri/target
echo ""
echo "现在可以运行："
echo "  npm run tauri:dev"
echo "========================================="