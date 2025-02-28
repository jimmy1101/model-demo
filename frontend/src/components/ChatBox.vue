<!--
 * @Author: wenzheng 528604031@qq.com
 * @Date: 2025-02-26 15:44:53
 * @LastEditors: wenzheng 528604031@qq.com
 * @LastEditTime: 2025-02-26 17:24:09
 * @FilePath: \claude_demo\frontend\src\components\ChatBox.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="chat-container">
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" 
           :class="['message', msg.type === 'user' ? 'user-message' : 'ai-message']">
        <div class="message-content">
          <strong>{{ msg.type === 'user' ? '你' : 'AI' }}:</strong>
          <p v-if="msg.type === 'user'">{{ msg.text }}</p>
          <p v-else class="typewriter">
            {{ displayText[index] || '思考中...' }}
            <!-- <span class="cursor" v-if="loading"></span> -->
          </p>
        </div>
      </div>
      <div v-if="loading&&!newMessage" class="message ai-message">
        <div class="message-content">
          <strong>AI:</strong>
          <p>思考中...</p>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <textarea 
        v-model="userInput" 
        placeholder="请输入你的问题..." 
        @keydown.enter.prevent="sendMessage"
      ></textarea>
      <button @click="sendMessage" :disabled="loading || !userInput.trim()">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';
const userInput = ref('');
const messages = ref([]);
const loading = ref(false);
const newMessage = ref(false);
const messagesContainer = ref(null);
const displayText = ref({});

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }, 100);
}, { deep: true });

// 发送消息到后端
const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return;
  
  const userMessage = userInput.value;
  const messageIndex = messages.value.length;
  messages.value.push({ type: 'user', text: userMessage });
  userInput.value = '';
  loading.value = true;
  newMessage.value = false;
  
  try {
    const response = await axios.post(API_URL, { message: userMessage });
    const aiMessage = response.data.reply;
    messages.value.push({ type: 'ai', text: aiMessage });
    newMessage.value = true;
    // 逐字显示文本
    displayText.value[messageIndex + 1] = '';
    for (let i = 0; i < aiMessage.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      displayText.value[messageIndex + 1] = aiMessage.slice(0, i + 1);
    }
  } catch (error) {
    console.error('请求错误:', error);
    messages.value.push({ 
      type: 'ai', 
      text: '抱歉，处理您的请求时出错。请稍后再试。' 
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message-content {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  color: #333;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.user-message .message-content {
  background-color: #dcf8c6;
}

.ai-message .message-content {
  background-color: #fff;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}

textarea {
  flex: 1;
  height: 60px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  color: #333;
  background-color: #fff;
}

button {
  margin-left: 10px;
  padding: 0 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
}

.typewriter {
  position: relative;
  margin: 0;
  min-height: 1.5em;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #333;
  margin-left: 2px;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style> 