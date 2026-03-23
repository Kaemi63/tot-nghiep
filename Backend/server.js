const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

//API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    // Lấy tin nhắn
    const lastMessage = messages[messages.length - 1].content;
    
    console.log("User hỏi:", lastMessage);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Thiết lập Header cho Streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const result = await model.generateContentStream(lastMessage);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
      res.write(chunkText);
    }

    res.end();
  } catch (error) {
    console.error("Lỗi Backend:", error);
    res.status(500).send(error.message);
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server AI đang chạy tại cổng ${PORT}`));