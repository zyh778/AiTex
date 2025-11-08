import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  latex: string;
  className?: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ latex, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false,
          trust: true,
          macros: {
            "\\f": "#1f(#2)"
          }
        });
      } catch (error) {
        containerRef.current.innerHTML = `<div class="text-red-500">LaTeX渲染错误: ${error}</div>`;
      }
    }
  }, [latex]);

  if (!latex) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${className}`}>
        <p className="text-gray-500">识别结果将显示在这里</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg overflow-auto ${className}`}>
      <div ref={containerRef} className="p-4 text-lg" />
    </div>
  );
};