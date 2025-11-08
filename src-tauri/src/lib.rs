// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::{Manager, State};
use std::sync::{Arc, Mutex};

// API配置结构
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiConfig {
    pub enabled: bool,
    pub provider: String,
    pub api_url: String,
    pub api_key: String,
    pub model_name: String,
    pub system_prompt: String,
}

impl Default for ApiConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            provider: "硅基流动".to_string(),
            api_url: "https://api.siliconflow.cn/v1".to_string(),
            api_key: "".to_string(),
            model_name: "Qwen/Qwen2.5-VL-72B-Instruct".to_string(),
            system_prompt: "你是一个专业的数学公式识别系统，请严格按照以下要求操作：
1. 专注识别图像中的数学公式、符号、希腊字母、运算符等
2. 输出标准LaTeX代码，确保可被编译器解析
3. 所有公式必须转换为单行格式（禁止使用\\begin{align}等多行环境）
4. 多行公式用空格分隔或合并为单行
5. 不添加解释性文字，直接输出纯净的LaTeX代码".to_string(),
        }
    }
}

// 全局状态
pub struct AppState {
    pub config: Arc<Mutex<ApiConfig>>,
}

// 读取API配置
#[tauri::command]
async fn get_api_config(state: State<'_, AppState>) -> Result<ApiConfig, String> {
    let config = state.config.lock().unwrap();
    Ok(config.clone())
}

// 保存API配置
#[tauri::command]
async fn save_api_config(config: ApiConfig, state: State<'_, AppState>) -> Result<(), String> {
    let mut state_config = state.config.lock().unwrap();
    *state_config = config.clone();

    // 保存到文件
    if let Ok(home_dir) = dirs::home_dir() {
        let config_path = home_dir.join(".aitex/config.json");
        if let Some(parent) = config_path.parent() {
            std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
        std::fs::write(config_path, json).map_err(|e| e.to_string())?;
    }

    Ok(())
}

// 测试API连接
#[tauri::command]
async fn test_api_connection(config: ApiConfig) -> Result<String, String> {
    let client = reqwest::Client::new();

    let mut body = serde_json::Map::new();
    body.insert("model".to_string(), serde_json::Value::String(config.model_name.clone()));

    let messages = serde_json::json!([
        {
            "role": "system",
            "content": config.system_prompt
        },
        {
            "role": "user",
            "content": "Hello, this is a test message."
        }
    ]);
    body.insert("messages".to_string(), messages);
    body.insert("max_tokens".to_string(), serde_json::Value::Number(serde_json::Number::from(10)));
    body.insert("temperature".to_string(), serde_json::Value::Number(serde_json::Number::from_f64(0.2).unwrap()));

    let response = client
        .post(format!("{}/chat/completions", config.api_url))
        .header("Authorization", format!("Bearer {}", config.api_key))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("网络请求失败: {}", e))?;

    if response.status().is_success() {
        Ok("API连接成功".to_string())
    } else {
        let status = response.status();
        let error = response.text().await.unwrap_or_default();
        Err(format!("API连接失败: {} - {}", status, error))
    }
}

// 处理图像
#[tauri::command]
async fn process_image(image_path: String, state: State<'_, AppState>) -> Result<String, String> {
    let config = state.config.lock().unwrap().clone();

    if !config.enabled {
        return Err("API未启用".to_string());
    }

    if config.api_key.is_empty() {
        return Err("API密钥未配置".to_string());
    }

    // 读取图像
    let image_data = std::fs::read(&image_path).map_err(|e| format!("读取图像失败: {}", e))?;

    // 图像预处理
    let img = image::load_from_memory(&image_data).map_err(|e| format!("图像格式错误: {}", e))?;

    // 转换为RGB
    let rgb_img = img.to_rgb8();

    // 检测背景并反转
    let (width, height) = rgb_img.dimensions();
    let mut pixels = rgb_img.into_raw();
    let mut sum = 0u64;

    // 计算平均亮度
    for chunk in pixels.chunks_exact(3) {
        let gray = (chunk[0] as u64 * 299 + chunk[1] as u64 * 587 + chunk[2] as u64 * 114) / 1000;
        sum += gray;
    }
    let avg_brightness = sum / (width * height) as u64;

    // 如果背景过深，反转图像
    if avg_brightness < 128 {
        for pixel in pixels.iter_mut() {
            *pixel = 255 - *pixel;
        }
    }

    // 重新构建图像
    let processed_img = image::RgbImage::from_raw(width, height, pixels)
        .ok_or("图像处理失败")?;

    // 转换为PNG格式的base64
    let mut buf = Vec::new();
    {
        let mut cursor = std::io::Cursor::new(&mut buf);
        processed_img.write_to(&mut cursor, image::ImageFormat::Png)
            .map_err(|e| format!("图像编码失败: {}", e))?;
    }
    let base64_image = base64::engine::general_purpose::STANDARD.encode(&buf);

    // 调用API
    let client = reqwest::Client::new();

    let mut body = serde_json::Map::new();
    body.insert("model".to_string(), serde_json::Value::String(config.model_name.clone()));

    let messages = serde_json::json!([
        {
            "role": "system",
            "content": config.system_prompt
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": format!("data:image/png;base64,{}", base64_image)
                    }
                },
                {
                    "type": "text",
                    "text": "请识别图像中的数学公式，输出纯净的LaTeX代码"
                }
            ]
        }
    ]);
    body.insert("messages".to_string(), messages);
    body.insert("max_tokens".to_string(), serde_json::Value::Number(serde_json::Number::from(1024)));
    body.insert("temperature".to_string(), serde_json::Value::Number(serde_json::Number::from_f64(0.2).unwrap()));

    let response = client
        .post(format!("{}/chat/completions", config.api_url))
        .header("Authorization", format!("Bearer {}", config.api_key))
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("API请求失败: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let error = response.text().await.unwrap_or_default();
        return Err(format!("API错误: {} - {}", status, error));
    }

    let response_json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("解析响应失败: {}", e))?;

    let latex_result = response_json
        .get("choices")
        .and_then(|c| c.get(0))
        .and_then(|m| m.get("message"))
        .and_then(|msg| msg.get("content"))
        .and_then(|c| c.as_str())
        .unwrap_or("")
        .trim()
        .to_string();

    // 清理LaTeX结果
    let cleaned_latex = clean_latex(&latex_result);

    Ok(cleaned_latex)
}

// 清理LaTeX代码
fn clean_latex(latex: &str) -> String {
    let mut result = latex.to_string();

    // 移除可能的解释性文字
    if let Some(start) = result.find('$') {
        if start > 0 {
            result = result[start..].to_string();
        }
    }

    // 移除末尾的非LaTeX内容
    let mut end = result.len();
    for (i, c) in result.char_indices().rev() {
        if c == '$' || c == '}' {
            end = i + 1;
            break;
        }
    }
    if end < result.len() {
        result = result[..end].to_string();
    }

    // 移除多余的空行
    while result.contains("\n\n") {
        result = result.replace("\n\n", "\n");
    }

    result.trim().to_string()
}

// 获取剪贴板图像
#[tauri::command]
async fn get_clipboard_image() -> Result<Option<String>, String> {
    use arboard::Clipboard;

    let mut clipboard = Clipboard::new()
        .map_err(|e| format!("访问剪贴板失败: {}", e))?;

    // 暂时返回空，因为剪贴板图像处理需要更复杂的逻辑
    Ok(None)
}

// 触发截图
#[tauri::command]
async fn trigger_screenshot() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(&["/c", "ms-screencapture:"])
            .spawn()
            .map_err(|e| format!("启动截图失败: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        // 尝试使用gnome-screenshot
        if std::path::Path::new("/usr/bin/gnome-screenshot").exists() {
            std::process::Command::new("gnome-screenshot")
                .arg("-a")
                .spawn()
                .map_err(|e| format!("启动截图失败: {}", e))?;
        } else if std::path::Path::new("/usr/bin/spectacle").exists() {
            std::process::Command::new("spectacle")
                .arg("-r")
                .spawn()
                .map_err(|e| format!("启动截图失败: {}", e))?;
        } else {
            return Err("未找到截图工具".to_string());
        }
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("screencapture")
            .arg("-i")
            .spawn()
            .map_err(|e| format!("启动截图失败: {}", e))?;
    }

    Ok(())
}

pub fn run_main() {
    // 加载配置
    let config = if let Ok(home_dir) = dirs::home_dir() {
        let config_path = home_dir.join(".aitex/config.json");
        if config_path.exists() {
            let json = std::fs::read_to_string(config_path).unwrap_or_default();
            serde_json::from_str(&json).unwrap_or_default()
        } else {
            ApiConfig::default()
        }
    } else {
        ApiConfig::default()
    };

    tauri::Builder::default()
        .manage(AppState {
            config: Arc::new(Mutex::new(config)),
        })
        .invoke_handler(tauri::generate_handler![
            get_api_config,
            save_api_config,
            test_api_connection,
            process_image,
            get_clipboard_image,
            trigger_screenshot
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}