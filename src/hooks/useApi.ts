import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { ApiConfig } from '../types/config';

export const useApi = () => {
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const configData = await apiService.getConfig();
      setConfig(configData);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: ApiConfig) => {
    try {
      setLoading(true);
      await apiService.saveConfig(newConfig);
      setConfig(newConfig);
    } catch (err) {
      setError(err as string);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (): Promise<string> => {
    if (!config) throw new Error('配置未加载');
    return await apiService.testConnection(config);
  };

  return {
    config,
    loading,
    error,
    saveConfig,
    testConnection,
    reloadConfig: loadConfig
  };
};