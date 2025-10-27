import React, { useState } from "react";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Revio Bot 🤖. How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botReply = { text: generateBotReply(input), sender: "bot" };
      setMessages((prev) => [...prev, botReply]);

      // Check for redirection keywords
      handleRedirect(input);
    }, 500);
  };

  const generateBotReply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi"))
      return "Hello there! 👋 How can I assist you today?";
    if (lower.includes("support"))
      return "Redirecting you to the Support page...";
    if (lower.includes("report"))
      return "Redirecting you to the Report page...";
    if (lower.includes("settings"))
      return "Redirecting you to Settings...";
    if (lower.includes("profile"))
      return "Redirecting you to your profile...";
    if (lower.includes("dashboard"))
      return "Redirecting you to your dashboard...";
    if (lower.includes("help"))
      return "Redirecting you to your help...";
    if (lower.includes("history"))
      return "Redirecting you to your history...";
    if (lower.includes("likes"))
      return "Redirecting you to your likes...";
    if (lower.includes("history"))
      return "content you to your content...";

    return "I'm not sure I understand 🤔 — but I'll get smarter soon!\n\n"+
     "👉 Type 'dashboard' to go Admin dashboard\n"+
     "👉 Type 'support' if you want Report,contact \n" +
     "👉 Type 'report' if you want report on any Violation,Infringement,Action. \n" +
     "👉 Type 'settings' if you want change theme or details\n"+
     "👉 Type 'help' to go help page\n"+
     "👉 Type 'history' if you want access your watch history\n"+
     "👉 Type 'likes' to go your likes videos page\n"+
     "👉 Type 'content' to go your content page\n";
  };

  const handleRedirect = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("support")) navigate("/support");
    else if (lower.includes("dashboard")) navigate("/home/dashboard");
    else if (lower.includes("report")) navigate("/report");
    else if (lower.includes("settings")) navigate("/settings");
    else if (lower.includes("help")) navigate("/home/help"); 
    else if (lower.includes("history")) navigate("/home/watch-history");
    else if (lower.includes("likes")) navigate("/home/likeVideos");
    else if (lower.includes("content")) navigate("/home/my-content");
    // Add more routing keywords as needed
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none z-50"
      >
        {isOpen ? <RxCross2 size={24} /> : <TbMessageChatbotFilled size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-300 flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white p-3 font-semibold flex justify-between items-center">
            Revio Chatbot 💬
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <RxCross2 size={18} />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto h-64">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-[75%] ${
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

export default Chatbot;
