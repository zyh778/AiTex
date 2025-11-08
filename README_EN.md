<div align="center">
  <img src="resources/images/logo.png" width="400" alt="AiTex">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-blue" alt="Version">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL3.0-green" alt="License"></a>
  <h4>
    <a href="README.md">🇨🇳 Chinese</a>
    <span> | </span>
    <a href="README_EN.md">🇬🇧 English</a>
  </h4>
</div>

## 🌟 Introduction

AiTex is a free intelligent formula recognition software that can identify mathematical formulas in images and convert them into editable LaTeX format.

Features:

- 🚀 **Lightweight and Fast Deployment**
  Adopts cloud API architecture, no need to download large model files, quick installation and fast startup

- 🌐 **Cloud-based High-Precision Recognition**
  Integrates advanced cloud multimodal large models with high recognition accuracy and support for complex formulas

- 🎯 **Multiple Operation Modes**
  Supports three operation modes: image upload, screenshot, and paste, with shortcut keys for improved efficiency

- 📋 **Multiple Export Formats**
  Recognition results can be directly copied to Word or LaTeX format with one click, no additional operations needed

- 🔧 **Flexible API Configuration**
  Supports multiple cloud API service providers, allowing you to choose the most suitable service according to your needs

## 📦 Usage

### 1. Quick Start

### 2. Run from Source

#### Environment Setup

```bash
# Install dependencies
pip install -r requirements.txt
```

#### Configure API Key

When running the software for the first time, click the "API Settings" button to configure your cloud API key:

1. **SiliconFlow** (Recommended):
   - Registration: https://siliconflow.cn/
   - Get API key and configure it in the software

2. **Other OpenAI-compatible APIs**:
   - Select "Custom" in "API Settings"
   - Fill in API address and key

#### Launch Application

```bash
python main.py
```

## 🆕 v2.0 Major Update

### Architecture Refactoring
- ✅ Removed local model dependencies, pure cloud API architecture
- ✅ Project size reduced by 90% (from ~500MB to ~50MB)
- ✅ Startup speed improved by 80% (from ~15 seconds to ~3 seconds)
- ✅ Simplified dependency installation, no need for PyTorch and other heavy libraries

### Feature Optimization
- ✅ Simplified configuration process, focusing on API settings
- ✅ Improved error handling and user prompts
- ✅ Optimized image preprocessing with automatic dark background inversion
- ✅ Updated documentation and user guide

### Tech Stack Updates
- ✅ Removed: PyTorch, transformers, timm
- ✅ Kept: opencv-python, Pillow, openai
- ✅ Optimized: dependency management and resource usage

## 📊 Performance Comparison

| Metric | v1.0 (Local Model) | v2.0 (Cloud API) | Improvement |
|--------|-------------------|----------------|-----------|
| Project Size | ~500MB | ~50MB | ⬇️ 90% |
| Startup Time | 10-15 seconds | 2-3 seconds | ⬇️ 80% |
| Memory Usage | 2-3GB | 100-200MB | ⬇️ 90%+ |
| Install Time | 5-10 minutes | 1-2 minutes | ⬇️ 75% |
| Recognition Accuracy | High | Very High | ⬆️ Improved |

## 🛠️ Development Guide

### Project Structure
```
AiTex/
├── main.py                 # Main application
├── tools/                  # Tools module
│   ├── cloud_processor.py  # Cloud processor
│   ├── clipboard_handler.py # Clipboard handling
│   └── model_config_dialog.py # API configuration
├── resources/              # Resource files
├── qfluentwidgets/         # UI component library
├── test_api.py            # API testing
├── config.json            # Configuration file
└── requirements.txt       # Dependency list
```

### Adding New API Support

1. Add new API client in `_process_with_cloud_api` method in `tools/cloud_processor.py`
2. Add new provider options in `tools/model_config_dialog.py`
3. Update configuration file format

### Custom Image Preprocessing

Add custom logic in the `preprocess_image` method in `tools/cloud_processor.py`.

## 🤝 Contributing

1. Fork this project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PyQt-Fluent-Widgets](https://github.com/zhiyiYo/PyQt-Fluent-Widgets) - Modern UI components
- [SiliconFlow](https://siliconflow.cn/) - Cloud API service
- [KaTeX](https://katex.org/) - LaTeX rendering engine
- [OpenAI](https://openai.com/) - API standard

## Star History

![Star History](https://starchart.cc/zstar1003/AiTex.svg)

## FAQ

**Q: Why choose cloud API instead of local models?**
A: Cloud APIs provide better user experience: faster startup speed, smaller installation packages, higher recognition accuracy, while simplifying maintenance and updates.

**Q: How is data privacy guaranteed?**
A: Please choose a trusted API service provider and review their privacy policy. Image data is only temporarily transmitted during API calls and is not permanently stored.

**Q: Can it be used offline?**
A: The current version requires network connection for API calls. If offline functionality is needed, consider using API services that support local deployment.

**Q: How to switch API providers?**
A: In "API Settings", you can select different providers or choose "Custom" and fill in your own API configuration.