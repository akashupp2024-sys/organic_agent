import { useState } from 'react';
import sproutBot from '../assets/Sprout-bot.png';
import axios from 'axios';

function ChatBotButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hello! I am Sprout AI. Ask me anything about organic products.',
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: 'user',
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post('https://organic-agent.onrender.com/api/chat', {
        message,
      });

      const botReply = {
        sender: 'bot',
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Sprout AI is currently unavailable.',
        },
      ]);
    }

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Circle Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl transition hover:scale-105"
      >
        <img
          src={sproutBot}
          alt="Sprout AI"
          className="h-full w-full object-cover"
        />
      </button>

      {/* Fullscreen Chat */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">

          {/* Header */}
          <div className="flex items-center justify-between border-b bg-green-600 p-4 text-white shadow">
            <div className="flex items-center gap-3">
              <img
                src={sproutBot}
                alt="Sprout"
                className="h-14 w-14 rounded-full border-2 border-white"
              />

              <div>
                <h2 className="text-xl font-bold">
                  Sprout 🌱
                </h2>

                <p className="text-sm">
                  Organic Shopping Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-green-700"
            >
              Close
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-100 p-4">
            <div className="mx-auto max-w-3xl space-y-4">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-green-600 text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="mx-auto flex max-w-3xl gap-3">

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Sprout AI something..."
                className="flex-1 rounded-full border border-gray-300 px-5 py-4 text-black outline-none focus:border-green-500"
              />

              <button
                onClick={sendMessage}
                className="rounded-full bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
              >
                Send
              </button>

            </div>
          </div>

        </div>
      )}
    </>
  );
}

export default ChatBotButton;