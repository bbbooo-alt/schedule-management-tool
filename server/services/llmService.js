/**
 * LLM 服务层
 * 
 * 封装 LLM API 调用逻辑，提供简洁的接口
 */

const fetch = require('node-fetch');
const { 
  validateConfig, 
  getChatCompletionsUrl, 
  getHeaders, 
  getRequestBody 
} = require('../config/llm');

/**
 * 调用 LLM 进行对话
 * @param {Array} messages - 消息列表，格式：[{role: 'user', content: '...'}]
 * @returns {Promise<string>} - LLM 的回复内容
 */
async function chat(messages) {
  // 验证配置
  const validation = validateConfig();
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const url = getChatCompletionsUrl();
  const headers = getHeaders();
  const body = getRequestBody(messages);

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API 请求失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('LLM API 返回格式异常');
  }

  return data.choices[0].message.content;
}

/**
 * 分析日程安排
 * @param {string} date - 日期
 * @param {string} scheduleText - 日程文本
 * @param {string} description - 用户描述
 * @returns {Promise<string>} - AI 分析结果
 */
async function analyzeSchedule(date, scheduleText, description) {
  const prompt = `请分析以下日程安排和执行情况，给出总结、优化建议和明日推荐计划。

## 今日日程
${scheduleText || '（今日无安排）'}

## 用户执行描述
${description || '（用户未提供描述）'}

请从以下几个方面分析：
1. 今日计划总结：简要总结今日计划的完成情况
2. 可优化方向：指出时间管理和任务安排中可以改进的地方
3. 明日推荐计划：根据今日情况，推荐明天的任务安排建议

请用中文回答，格式清晰。`;

  const messages = [
    { role: 'user', content: prompt }
  ];

  return await chat(messages);
}

/**
 * 检查 LLM 是否已配置
 * @returns {boolean}
 */
function isConfigured() {
  const validation = validateConfig();
  return validation.valid;
}

module.exports = {
  chat,
  analyzeSchedule,
  isConfigured
};
