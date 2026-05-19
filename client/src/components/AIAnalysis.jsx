import React, { useState } from 'react';

export const AIAnalysis = ({ 
  date, 
  description, 
  aiResponse, 
  loading, 
  onDescriptionChange, 
  onAnalyze,
  isReadOnly 
}) => {
  const [localDescription, setLocalDescription] = useState(description || '');

  const handleSubmit = () => {
    if (!localDescription.trim()) return;
    onAnalyze(localDescription);
  };

  const handleDescriptionChange = (e) => {
    setLocalDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  // 格式化AI回复内容
  const formatAIResponse = (content) => {
    if (!content) return null;
    
    // 将内容按段落分割
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // 检测标题行（以数字或特定符号开头）
      const isHeading = /^[\d一二三四五六七八九十]、/.test(paragraph) || 
                       /^(总结|优化|推荐|建议|明日)/.test(paragraph);
      
      if (isHeading) {
        return (
          <h4 key={index} className="font-semibold text-text mt-4 mb-2 text-sm">
            {paragraph}
          </h4>
        );
      }
      
      return (
        <p key={index} className="text-text-muted text-sm leading-relaxed mb-2">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="glass-panel rounded-2xl shadow-soft overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-white to-bg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-accent flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-text">
              AI 计划分析
            </h3>
            <p className="text-xs text-text-muted">
              {isReadOnly ? '查看历史分析' : '描述今日执行情况，获取智能建议'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 描述输入区域 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text">
            今日执行描述
            <span className="text-text-muted font-normal ml-1">（可选）</span>
          </label>
          <textarea
            value={localDescription}
            onChange={handleDescriptionChange}
            disabled={isReadOnly || loading}
            placeholder={isReadOnly 
              ? "历史计划无法修改描述" 
              : "描述今天计划的执行情况，例如：\n- 哪些任务完成了，哪些没有\n- 执行过程中遇到的困难\n- 时间分配是否合理\n- 其他想要补充的信息"
            }
            className={`
              w-full h-32 p-4 rounded-xl border border-border 
              bg-white text-sm text-text placeholder-text-muted
              resize-none transition-all
              focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral
              disabled:bg-gray-50 disabled:cursor-not-allowed
            `}
          />
        </div>

        {/* 分析按钮 */}
        {!isReadOnly && (
          <button
            onClick={handleSubmit}
            disabled={loading || !localDescription.trim()}
            className={`
              w-full py-3 px-4 rounded-xl font-medium text-sm
              flex items-center justify-center gap-2
              transition-all duration-300
              ${loading || !localDescription.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-coral to-accent text-white shadow-md hover:shadow-lg hover:translate-y-[-1px]'
              }
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>AI 分析中...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>获取 AI 分析建议</span>
              </>
            )}
          </button>
        )}

        {/* AI 回复显示区域 */}
        {aiResponse && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-coral to-accent flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-text">AI 分析结果</span>
              <span className="text-xs text-text-muted">
                {new Date(aiResponse.createdAt).toLocaleString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <div className="bg-gradient-to-br from-coral/5 to-accent/5 rounded-xl p-4 border border-coral/10">
              <div className="prose prose-sm max-w-none">
                {formatAIResponse(aiResponse.content)}
              </div>
            </div>
          </div>
        )}

        {/* 历史分析记录 */}
        {aiResponse?.history && aiResponse.history.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-text">历史分析记录</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {aiResponse.history.map((item, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-bg hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">
                      {new Date(item.createdAt).toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-text line-clamp-2">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
