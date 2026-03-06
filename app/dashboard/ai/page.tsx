'use client';

import { cn } from '@/lib/utils';
import { ArrowLeft, Bot, Plus, Send, Sparkles, Trash2, User } from 'lucide-react';
import { useState } from 'react';

const mockChats = [
    { id: '1', title: 'Quantum Physics Basics', lastText: 'Let\'s talk about relativity...', time: '12:45 PM' },
    { id: '2', title: 'Macroeconomics Prep', lastText: 'Explain supply and demand curves.', time: 'Yesterday' },
    { id: '3', title: 'Biology: Cell Structure', lastText: 'What is the mitochondria func...', time: 'Mar 2' },
];

export default function AIHubPage() {
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! I am Walia AI. How can I assist your studies today?' }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;
        setMessages([...messages, { role: 'user', text: message }]);
        setMessage('');

        // Fake AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: 'I am processing your request. I will provide a detailed explanation shortly...' }]);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-180px)] overflow-hidden flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-[40px] animate-fade-in-up">

            {/* Sidebar: Chat History */}
            <aside className={cn(
                "w-full md:w-80 border-r border-white/5 flex flex-col transition-all",
                activeChat ? "hidden md:flex" : "flex"
            )}>
                <div className="p-6 border-b border-white/5">
                    <button className="w-full py-4 rounded-2xl bg-walia-primary text-white font-bold flex items-center justify-center hover:bg-walia-secondary transition-all shadow-lg shadow-walia-primary/20">
                        <Plus className="w-5 h-5 mr-2" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    <p className="px-4 text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Historical Sessions</p>
                    {mockChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={cn(
                                "p-4 rounded-2xl cursor-pointer group transition-all",
                                activeChat === chat.id ? "bg-white/10" : "hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-bold text-white truncate max-w-[140px]">{chat.title}</h4>
                                <span className="text-[10px] text-white/30 font-medium">{chat.time}</span>
                            </div>
                            <p className="text-xs text-white/40 truncate">{chat.lastText}</p>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className={cn(
                "flex-1 flex flex-col transition-all relative",
                !activeChat ? "hidden md:flex" : "flex"
            )}>
                {/* Chat Header */}
                <header className="px-8 h-20 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex items-center">
                        <button className="md:hidden mr-4 text-white/40" onClick={() => setActiveChat(null)}>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-walia-primary/20 flex items-center justify-center mr-4 border border-walia-primary/30">
                            <Bot className="w-5 h-5 text-walia-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Walia AI Assistant</h3>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Model: Gemini 2.0</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-red-500">
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-walia-primary">
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Message Container */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex w-full mb-4 animate-fade-in-up",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "flex max-w-[80%] items-start space-x-4",
                                msg.role === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                    msg.role === 'user' ? "bg-white/5 border-white/10" : "bg-walia-primary/10 border-walia-primary/20"
                                )}>
                                    {msg.role === 'user' ? <User className="w-5 h-5 text-white/40" /> : <Bot className="w-5 h-5 text-walia-primary" />}
                                </div>
                                <div className={cn(
                                    "p-6 rounded-3xl text-sm leading-relaxed shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-walia-primary text-white rounded-tr-none"
                                        : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="p-6">
                    <div className="relative group max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask Walia AI anything about your studies..."
                            className="w-full bg-white/5 border border-white/10 rounded-[32px] pl-8 pr-20 py-6 text-white placeholder:text-white/20 focus:border-walia-primary/50 outline-none transition-all shadow-lg"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-3 top-3 bottom-3 px-6 rounded-2xl bg-walia-primary text-white hover:bg-walia-secondary transition-all flex items-center justify-center shadow-lg shadow-walia-primary/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-center mt-4 text-[10px] text-white/20 font-medium">
                        Walia AI can make mistakes. Verify important academic information.
                    </p>
                </div>
            </main>
        </div>
    );
}
