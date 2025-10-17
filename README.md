
# Chat Application Backend

A real-time chat application backend built with Node.js, Express, Socket.IO, and MongoDB.  
This backend also integrates OpenAI API to generate AI responses in chats.

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
```

## Scripts

- `npm run dev` - Start the development server

## OpenAI API Integration

This project uses **OpenAI API** to generate AI responses in chats.  
We are using the **GPT-OSS-20B** model (OpenAI open-weight model) for AI responses.

### Model Information

- **Model Name**: `gpt-oss-20b`
- **API**: OpenAI Chat Completions API (`openai.chat.completions.create`)
- **Usage**: Handles user messages and generates AI responses in chat.

### Example Usage in Backend

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIResponse = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: "gpt-oss-20b",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
```

## AI Chat Modal Flow

1. User sends a message through the chat modal.
2. Message is saved to MongoDB.
3. Backend calls `generateAIResponse` using the `gpt-oss-20b` model.
4. AI response is saved to DB and emitted to frontend via Socket.IO.

## Features

- User authentication with JWT
- Real-time chat using Socket.IO
- AI-powered chat responses using GPT-OSS-20B
- MongoDB database for storing users, chats, and messages
- AI Chat Modal for interactive AI responses in chat

## Running the Server

```bash
npm run dev
```

Server will run on `http://localhost:5000` by default.
