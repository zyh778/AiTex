import React, { useState } from 'react';
import { ImageViewer } from './components/ImageViewer';
import { LatexRenderer } from './components/LatexRenderer';
import { Toolbar } from './components/Toolbar';
import { SettingsDialog } from './components/SettingsDialog';
import { apiService } from './services/api';

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [latexResult, setLatexResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [imagePath, setImagePath] = useState<string>('');

  const handleImageSelect = (path: string) => {
    setImagePath(path);
    setImageUrl(`file://${path}`);
  };

  const handleProcess = async () => {
    if (!imagePath) {
      alert('请先选择图片');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.processImage(imagePath);
      setLatexResult(result);
    } catch (error) {
      alert(`处理失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = async () => {
    await apiService.triggerScreenshot();
    // 延迟一下再检查剪贴板
    setTimeout(async () => {
      try {
        const clipboardImage = await apiService.getClipboardImage();
        if (clipboardImage) {
          handleImageSelect(clipboardImage);
        }
      } catch (error) {
        console.error('获取截图失败:', error);
      }
    }, 1000);
  };

  const handleCopyLatex = () => {
    if (latexResult) {
      navigator.clipboard.writeText(latexResult);
      alert('LaTeX代码已复制到剪贴板');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 顶部栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">AiTex - 数学公式识别</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">云端API模式</span>
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              API设置
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 - 左右布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧 - 图像显示 */}
        <div className="w-1/2 p-4">
          <div className="h-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">原始图像</h2>
            <div className="h-full pb-16">
              <ImageViewer imageUrl={imageUrl} className="h-full" />
            </div>
          </div>
        </div>

        {/* 右侧 - 识别结果 */}
        <div className="w-1/2 p-4 border-l border-gray-200">
          <div className="h-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">识别结果</h2>
              {latexResult && (
                <button
                  onClick={handleCopyLatex}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  复制LaTeX
                </button>
              )}
            </div>
            <div className="h-full pb-16">
              <LatexRenderer latex={latexResult} className="h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 底部工具栏 */}
      <Toolbar
        onImageSelect={handleImageSelect}
        onProcess={handleProcess}
        onScreenshot={handleScreenshot}
        loading={loading}
      />

      {/* 设置对话框 */}
      <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default App;