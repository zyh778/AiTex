import React from 'react';
import { apiService } from '../services/api';

interface ToolbarProps {
  onImageSelect: (imagePath: string) => void;
  onProcess: () => void;
  onScreenshot: () => void;
  loading: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onImageSelect,
  onProcess,
  onScreenshot,
  loading
}) => {
  const handleFileSelect = () => {
    // 创建文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/bmp,image/webp';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 创建临时URL
        const url = URL.createObjectURL(file);
        onImageSelect(url);
      }
    };

    input.click();
  };

  const handlePaste = async () => {
    try {
      const imagePath = await apiService.getClipboardImage();
      if (imagePath) {
        onImageSelect(imagePath);
      }
    } catch (error) {
      console.error('粘贴失败:', error);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex space-x-4">
          <button
            onClick={handleFileSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            上传图片
          </button>

          <button
            onClick={onScreenshot}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            截图
          </button>

          <button
            onClick={handlePaste}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            disabled={loading}
          >
            粘贴
          </button>

          <button
            onClick={onProcess}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '识别中...' : '识别公式'}
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>支持 PNG, JPG, BMP, WebP 格式</span>
        </div>
      </div>
    </div>
  );
};