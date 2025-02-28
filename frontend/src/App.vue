<!--
 * @Author: wenzheng 528604031@qq.com
 * @Date: 2025-02-26 15:44:53
 * @LastEditors: wenzheng 528604031@qq.com
 * @LastEditTime: 2025-02-26 17:25:41
 * @FilePath: \claude_demo\frontend\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">
    <h1>OpenAI 问答系统</h1>
    <ChatBox />
  </div>
</template>

<script setup>
import ChatBox from './components/ChatBox.vue';
</script>
<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #fff;
  margin-bottom: 30px;
}
</style> 