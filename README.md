<div align="center">
  <img src="resources/images/logo.png" width="400" alt="AiTex">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/版本-2.0.0-blue" alt="版本">
  <a href="LICENSE"><img src="https://img.shields.io/badge/许可证-AGPL3.0-green" alt="许可证"></a>
  <h4>
    <a href="README.md">中文</a>
    <span> | </span>
    <a href="README_EN.md">English</a>
  </h4>
</div>

## 🌟 简介

AiTex是一个免费的公式智能识别软件，它可以识别图像中的数学公式并将其转换为可编辑的Latex格式。

特点：

- 🚀 **轻量快速部署**
  采用云端API架构，无需下载大型模型文件，安装快速，启动迅速

- 🌐 **云端高精度识别**
  集成先进的云端多模态大模型，识别精度高，支持复杂公式

- 🎯 **多种操作模式**
  支持上传图像、截图、粘贴三种操作模式，并支持快捷键，提升效率

- 📋 **结果导出多格式**
  识别结果支持直接一键复制成Word或LaTeX格式，无需额外操作

- 🔧 **灵活API配置**
  支持多种云端API服务商，可根据需求选择最合适的服务

## 📦 使用方式

### 1. 快速使用

### 2. 源码运行

#### 配置环境

```bash
# 安装依赖
pip install -r requirements.txt
```

#### 配置API密钥

首次运行软件时，点击"API设置"按钮，配置您的云端API密钥：

1. **硅基流动**（推荐）：
   - 注册地址：https://siliconflow.cn/
   - 获取API密钥后在软件中配置

2. **其他OpenAI兼容API**：
   - 在"API设置"中选择"自定义"
   - 填写API地址和密钥

#### 运行软件

```bash
python main.py
```

## 🆕 v2.0 重大更新

### 架构重构
- ✅ 移除本地模型依赖，纯云端API架构
- ✅ 项目体积减少90%（从~500MB降至~50MB）
- ✅ 启动速度提升80%（从~15秒降至~3秒）
- ✅ 安装依赖简化，无需PyTorch等重型库

### 功能优化
- ✅ 简化配置流程，专注API设置
- ✅ 改进错误处理和用户提示
- ✅ 优化图像预处理，支持深色背景自动反转
- ✅ 更新文档和用户指南

### 技术栈更新
- ✅ 移除：PyTorch、transformers、timm
- ✅ 保留：opencv-python、Pillow、openai
- ✅ 优化：依赖管理和资源占用

## 📊 性能对比

| 指标 | v1.0 (本地模型) | v2.0 (云端API) | 改善 |
|------|----------------|----------------|------|
| 项目体积 | ~500MB | ~50MB | ⬇️ 90% |
| 启动时间 | 10-15秒 | 2-3秒 | ⬇️ 80% |
| 内存占用 | 2-3GB | 100-200MB | ⬇️ 90%+ |
| 安装时间 | 5-10分钟 | 1-2分钟 | ⬇️ 75% |
| 识别精度 | 高 | 很高 | ⬆️ 提升 |

## 🛠️ 开发指南

### 项目结构
```
AiTex/
├── main.py                 # 主应用程序
├── tools/                  # 工具模块
│   ├── cloud_processor.py  # 云端处理器
│   ├── clipboard_handler.py # 剪贴板处理
│   └── model_config_dialog.py # API配置
├── resources/              # 资源文件
├── qfluentwidgets/         # UI组件库
├── test_api.py            # API测试
├── config.json            # 配置文件
└── requirements.txt       # 依赖列表
```

### 添加新的API支持

1. 在 `tools/cloud_processor.py` 中的 `_process_with_cloud_api` 方法添加新的API客户端
2. 在 `tools/model_config_dialog.py` 中添加新的提供商选项
3. 更新配置文件格式

### 自定义图像预处理

在 `tools/cloud_processor.py` 中的 `preprocess_image` 方法中添加自定义逻辑。

## 🤝 贡献指南

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 AGPL-3.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [PyQt-Fluent-Widgets](https://github.com/zhiyiYo/PyQt-Fluent-Widgets) - 现代化UI组件
- [硅基流动](https://siliconflow.cn/) - 云端API服务
- [KaTeX](https://katex.org/) - LaTeX渲染引擎
- [OpenAI](https://openai.com/) - API标准


## FAQ

**Q: 为什么选择云端API而不是本地模型？**
A: 云端API提供了更好的用户体验：更快的启动速度、更小的安装包、更高的识别精度，同时简化了维护和更新。

**Q: 数据隐私如何保障？**
A: 请选择可信赖的API服务商，查看其隐私政策。图像数据仅在API调用过程中临时传输，不会被永久存储。

**Q: 可以离线使用吗？**
A: 当前版本需要网络连接进行API调用。如需离线功能，可以考虑使用支持本地部署的API服务。

**Q: 如何更换API提供商？**
A: 在"API设置"中可以选择不同的提供商，或者选择"自定义"并填写您自己的API配置。