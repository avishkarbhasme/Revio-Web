import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

const NonAuthChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      setMessages([
        { text: "Hi! 👋 I'm Revio Bot. How can I help you today?", sender: "bot" },
      ]);
    } else {
      setMessages([
        {
          text:
            "👋 Hi there! You’re not logged in.\n\nPlease login to access the main content.\n➡️ Don’t have an account? Type *register*\n🔑 Forgot password? Type *forgot password*",
          sender: "bot",
        },
      ]);
    }
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const reply = generateReply(input);
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    }, 500);

    setInput("");
  };

  const generateReply = (text) => {
    const msg = text.toLowerCase();

    if (!isLoggedIn) {
      if (msg.includes("login")) {
        navigate("/login");
        return "Taking you to the Login page 🔐 ...";
      }
      if (msg.includes("register") || msg.includes("sign up")) {
        navigate("/register");
        return "Redirecting to the Register page 📝 ...";
      }
      if (msg.includes("forgot")) {
        navigate("/forgot-password");
        return "No worries! Redirecting to Forgot Password 🔑 ...";
      }
      return (
        "Please login to access the main content.\n\n" +
        "👉 Type 'login' to go to login page\n" +
        "👉 Type 'register' to create a new account\n" +
        "👉 Type 'forgot password' if you forgot your password"
      );
    }

    if (msg.includes("hello") || msg.includes("hi"))
      return "Hello! 👋 How can I help you today?";
    if (msg.includes("support"))
      return "You can reach our support at timepasstalkies12@gmail.com 💌";
    if (msg.includes("report"))
      return "You can create a report on the 'Report' page 📋";
    if (msg.includes("help"))
      return "Visit the 'Help' section for guidance on how to use Revio 💡";

    return "I'm not sure I understand 🤔 — could you please rephrase?";
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none z-50"
      >
        {isOpen ? <RxCross2 size={24} /> : <TbMessageChatbotFilled size={24} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-800 dark:text-white shadow-xl rounded-2xl border border-gray-300 flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white p-3 font-semibold flex justify-between items-center">
            Revio Chatbot 💬
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <RxCross2 size={18} />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto h-64">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-[75%] whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-100 dark:bg-gray-700 text-left mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex border-t dark:border-gray-700">
            <input
              type="text"
              className="flex-1 p-2 outline-none dark:bg-gray-700 dark:text-white"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NonAuthChatbot;
