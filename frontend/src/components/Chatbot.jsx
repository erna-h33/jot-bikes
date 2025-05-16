import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputMessage, sender: 'user' }]);

    // Simulate bot response (you can replace this with actual API calls)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm a simple chatbot. I'll be more helpful once connected to an API!",
          sender: 'bot',
        },
      ]);
    }, 1000);

    setInputMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          className="bg-pink-600 hover:bg-[#FF1493] text-white px-6 pb-3 pt-2 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          onClick={() => setIsOpen(true)}
        >
          <span>Chat with us</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-[#FF69B4] text-white px-5 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Chat Support</h3>
            <button
              className="text-white text-2xl hover:opacity-80 transition-opacity"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-2.5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-[#FF69B4] text-white self-end rounded-br-sm'
                    : 'bg-[#FFF0F5] text-gray-800 self-start rounded-bl-sm'
                }`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#FFE4E1] flex gap-2.5">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 border border-[#FFE4E1] rounded-full text-sm outline-none focus:border-[#FF69B4]"
            />
            <button
              type="submit"
              className="bg-[#FF69B4] hover:bg-[#FF1493] text-white px-5 py-2.5 rounded-full text-sm transition-colors duration-300"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
