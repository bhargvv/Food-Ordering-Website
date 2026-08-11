import React, { useState, useEffect, useRef } from 'react';
import './AIChatWidget.css';
import { assets } from '../../assets/assets';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I'm the TasteCart AI Assistant 🍔. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Auto-scroll to bottom of chat
    const chatEndRef = useRef(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input.trim() };
        // Save current messages to history excluding the initial greeting
        const history = messages.filter((_, idx) => idx !== 0); 
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Point to the Node.js Express backend which has the /api/chat route
            const url = 'https://food-ordering-website-1-7j9n.onrender.com/api/chat';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text, history })
            });

            const data = await response.json();
            
            if (data.success) {
                setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: data.message || "Sorry, I ran into an error." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Network error. Make sure the backend is running." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="ai-chat-widget-container">
            {isOpen && (
                <div className="ai-chat-popup">
                    <div className="ai-chat-header">
                        <div className="header-title">
                            <span className="robot-icon">🤖</span>
                            TasteCart AI
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-chat-btn">×</button>
                    </div>
                    
                    <div className="ai-chat-body">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-bubble-container ${msg.sender === 'user' ? 'user-container' : 'ai-container'}`}>
                                <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-bubble-container ai-container">
                                <div className="chat-bubble ai-bubble typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="ai-chat-footer">
                        <input 
                            type="text" 
                            placeholder="Ask me about the menu..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                            Send
                        </button>
                    </div>
                </div>
            )}
            
            <button 
                className={`ai-chat-toggle-btn ${isOpen ? 'open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '💬' : '🤖'}
            </button>
        </div>
    );
};

export default AIChatWidget;
