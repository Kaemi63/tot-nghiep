const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Dán API Key thực tế của bạn vào đây
const genAI = new GoogleGenerativeAI("AIzaSyANlmTA26HsbI56J65pSHMAE4nGu7WxQ-o");

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    // Lấy nội dung tin nhắn cuối cùng
    const lastMessage = messages[messages.length - 1].content;
    
    console.log("📩 User hỏi:", lastMessage);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Thiết lập Header cho Streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const result = await model.generateContentStream(lastMessage);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText); // In ra console backend để kiểm tra
      res.write(chunkText);
    }

    res.end();
  } catch (error) {
    console.error("❌ Lỗi Backend:", error);
    res.status(500).send(error.message);
  }
});

app.listen(3001, () => console.log("🚀 Server AI đang chạy tại cổng 3001"));