/*
 * @Author: wenzheng 528604031@qq.com
 * @Date: 2025-02-26 15:44:53
 * @LastEditors: wenzheng 528604031@qq.com
 * @LastEditTime: 2025-02-26 16:23:31
 * @FilePath: \claude_demo\backend\routes\api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();
// 初始化 OpenAI
const url = process.env.TONGYI_URL
const api_key = process.env.TONGYI_API_KEY
const model_name = process.env.TONGYI_MODEL || 'qwen-plus'

const openai = new OpenAI({
  apiKey: api_key,
  baseURL: url,
  temperature: 0,
})


// 处理聊天请求的路由
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: '请提供问题内容' });
    }

    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        model: model_name,
      })

    const reply = completion.choices[0].message.content;
    console.log('🚀🚀🚀 / reply', reply)
    
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI API 错误:', error);
    res.status(500).json({ error: '处理请求时出错', details: error.message });
  }
});

module.exports = router; 