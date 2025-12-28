import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const HISTORY_FILE = path.join(__dirname, 'history.json');

app.use(cors());
app.use(express.json());

// Endpoint to receive and save chat history
app.post('/api/save-chat', async (req, res) => {
  try {
    const { timestamp, messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid chat data.' });
    }

    let history = [];
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf8');
      history = JSON.parse(data);
    } catch (err) {
      // File doesn't exist yet, start with empty array
    }

    // Add the new conversation to the list
    history.push({ 
      id: `chat_${Date.now()}`,
      timestamp, 
      messages 
    });
    
    // Save back to history.json
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    
    console.log(`[${new Date().toLocaleTimeString()}] Securely saved chat history to history.json`);
    res.status(200).json({ success: true, message: 'Chat history stored securely.' });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ success: false, message: 'Server error saving chat history.' });
  }
});

app.listen(PORT, () => {
  console.log('----------------------------------------');
  console.log(`🚀 Ndu Backend running on http://localhost:${PORT}`);
  console.log(`📁 Chats will be saved to: ${HISTORY_FILE}`);
  console.log('----------------------------------------');
});
