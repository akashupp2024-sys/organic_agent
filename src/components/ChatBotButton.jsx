import sproutBot from '../assets/sprout-bot.png';

import { useState } from 'react';
import botImage from '../assets/sprout-bot.png';

function ChatBotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
  onClick={() => setOpen(!open)}
  className="fixed bottom-6 right-6 z-50 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl transition hover:scale-105"
>
  <img
    src={sproutBot}
    alt="Sprout AI"
    className="h-full w-full object-cover"
  />
</button>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
          <div className="flex items-center gap-3 border-b pb-4">
            <img
              src={botImage}
              alt="Bot"
              className="h-12 w-12 rounded-full"
            />

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
  Sprout 🌱
</h2>

<p className="text-base font-medium text-slate-600">
  Your Organic Shopping Assistant
</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
              👋 Hello! Welcome to OrganicStore.
            </div>

            <div className="rounded-2xl bg-green-100 p-3 text-sm text-slate-700">
              Ask me about:
              <ul className="mt-2 list-disc pl-5">
                <li>Organic products</li>
                <li>Prices & discounts</li>
                <li>Healthy recommendations</li>
                <li>Order tracking</li>
              </ul>
            </div>
          </div>

          <button className="mt-5 w-full rounded-full bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
            Start Chat
          </button>
        </div>
      )}
    </>
  );
}

export default ChatBotButton;