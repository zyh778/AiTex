import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import type { ApiConfig } from '../types/config';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { config, saveConfig, testConnection } = useApi();
  const [testResult, setTestResult] = useState<string>('');
  const [testing, setTesting] = useState(false);
  const [localConfig, setLocalConfig] = useState<ApiConfig | null>(null);

  React.useEffect(() => {
    if (config) {
      setLocalConfig({ ...config });
    }
  }, [config]);

  if (!isOpen || !localConfig) return null;

  const handleSave = async () => {
    try {
      await saveConfig(localConfig);
      onClose();
    } catch (error) {
      setTestResult(`保存失败: ${error}`);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult('');
    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult(`连接失败: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const updateConfig = (field: keyof ApiConfig, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">API 设置</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              启用云端识别
            </label>
            <input
              type="checkbox"
              checked={localConfig.enabled}
              onChange={(e) => updateConfig('enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API 提供商
            </label>
            <select
              value={localConfig.provider}
              onChange={(e) => updateConfig('provider', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="硅基流动">硅基流动</option>
              <option value="自定义">自定义</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API 地址
            </label>
            <input
              type="text"
              value={localConfig.api_url}
              onChange={(e) => updateConfig('api_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://api.example.com/v1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API 密钥
            </label>
            <input
              type="password"
              value={localConfig.api_key}
              onChange={(e) => updateConfig('api_key', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="sk-xxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型名称
            </label>
            <input
              type="text"
              value={localConfig.model_name}
              onChange={(e) => updateConfig('model_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="gpt-4-vision-preview"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              系统提示词
            </label>
            <textarea
              value={localConfig.system_prompt}
              onChange={(e) => updateConfig('system_prompt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
              placeholder="系统提示词..."
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg ${
              testResult.includes('成功')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {testResult}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={handleTest}
              disabled={testing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {testing ? '测试中...' : '测试连接'}
            </button>

            <div className="space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};