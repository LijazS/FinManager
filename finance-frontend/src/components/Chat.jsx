import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    // 1. State for the input
    const [message, setMessage] = useState('');
    // 2. State for the chat history (User + Bot)
    const [chatHistory, setChatHistory] = useState([]);
    // 3. Loading state
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message to UI immediately
        const userMsg = { role: 'user', text: message };
        setChatHistory(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            // Retrieve token from localStorage (Assuming you saved it there during Login)
            const token = localStorage.getItem('token'); 

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat`,
                { message: message }, // Match backend Pydantic model: { message: str }
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Must send token!
                    },
                }
            );

            // Add Bot response to UI
            const botMsg = { role: 'bot', text: response.data.response };
            setChatHistory(prev => [...prev, botMsg]);
            setMessage(''); // Clear input

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg = { role: 'bot', text: "❌ Error: Could not connect to agent." };
            setChatHistory(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Chat History Area */}
            <div className="mb-4 flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                {chatHistory.length === 0 && <p className="text-gray-400 text-center">Start chatting...</p>}
                
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`mb-2 flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`inline-block px-4 py-2 rounded-lg ${
                            chat.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}>
                            {chat.text}
                        </span>
                    </div>
                ))}
                {isLoading && <div className="text-gray-500 text-sm">FinAgent is typing...</div>}
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="I spent $10 on coffee..."
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 px-4 py-2 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;
