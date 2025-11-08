import { invoke } from '@tauri-apps/api/tauri';
import type { ApiConfig } from '../types/config';

export const apiService = {
  // 获取API配置
  async getConfig(): Promise<ApiConfig> {
    return await invoke('get_api_config');
  },

  // 验证API配置
  async validateConfig(config: ApiConfig): Promise<string> {
    return await invoke('validate_api_config', { config });
  },

  // 保存API配置
  async saveConfig(config: ApiConfig): Promise<string> {
    return await invoke('save_api_config', { config });
  },

  // 测试API连接
  async testConnection(config: ApiConfig): Promise<string> {
    return await invoke('test_api_connection', { config });
  },

  // 处理图像
  async processImage(imagePath: string): Promise<string> {
    return await invoke('process_image', { imagePath });
  },

  // 获取剪贴板图像
  async getClipboardImage(): Promise<string | null> {
    return await invoke('get_clipboard_image');
  },

  // 触发截图
  async triggerScreenshot(): Promise<void> {
    return await invoke('trigger_screenshot');
  }
};