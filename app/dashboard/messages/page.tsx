'use client';

import { cn } from '@/lib/utils';
import { Image as ImageIcon, Info, Mic, MoreVertical, Phone, Plus, Search, Send, Video } from 'lucide-react';
import { useState } from 'react';

const mockMessages = [
    { id: '1', name: 'Study Group: AI', lastMsg: 'Did anyone finish the quiz?', time: '12:00 PM', unread: 3, online: true },
    { id: '2', name: 'Dr. Sarah (Tutor)', lastMsg: 'Your paper looks great!', time: '10:30 AM', unread: 0, online: true },
    { id: '3', name: 'Physics Lab Team', lastMsg: 'Meeting at 5 PM tomorrow.', time: 'Yesterday', unread: 0, online: false },
    { id: '4', name: 'James Wilson', lastMsg: 'Can you share the notes?', time: 'Monday', unread: 0, online: true },
];

export default function MessagesPage() {
    const [activeChat, setActiveChat] = useState<string | null>(mockMessages[0].id);

    return (
        <div className="h-[calc(100vh-180px)] overflow-hidden flex bg-white/5 border border-white/10 rounded-[40px] animate-fade-in-up">

            {/* Sidebar: Chats List */}
            <aside className="w-full md:w-96 border-r border-white/5 flex flex-col">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white px-2">Messages</h2>
                    <button className="p-3 rounded-2xl bg-walia-primary/10 text-walia-primary hover:bg-walia-primary hover:text-white transition-all">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-walia-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-walia-primary/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
                    {mockMessages.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={cn(
                                "p-4 rounded-3xl cursor-pointer flex items-center transition-all group",
                                activeChat === chat.id ? "bg-white/10" : "hover:bg-white/5"
                            )}
                        >
                            <div className="relative mr-4">
                                <div className="w-14 h-14 rounded-2xl bg-walia-primary/20 flex items-center justify-center font-bold text-walia-primary text-xl border border-walia-primary/20 group-hover:scale-105 transition-transform">
                                    {chat.name.charAt(0)}
                                </div>
                                {chat.online && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-4 border-[#070712]" />
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-bold text-white truncate pr-2">{chat.name}</h4>
                                    <span className="text-[10px] text-white/30 font-medium whitespace-nowrap">{chat.time}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-white/40 truncate flex-1">{chat.lastMsg}</p>
                                    {chat.unread > 0 && (
                                        <span className="w-5 h-5 rounded-lg bg-walia-primary text-white text-[10px] font-black flex items-center justify-center ml-2 shadow-lg shadow-walia-primary/30 animate-pulse">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Workspace */}
            <main className="flex-1 flex flex-col relative bg-black/20">
                {/* Header */}
                <header className="h-24 px-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-2xl bg-walia-primary/20 flex items-center justify-center font-bold text-walia-primary border border-walia-primary/30 mr-4">
                            {mockMessages.find(c => c.id === activeChat)?.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">
                                {mockMessages.find(c => c.id === activeChat)?.name}
                            </h3>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Online</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-white">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-white">
                            <Video className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-white">
                            <Info className="w-5 h-5" />
                        </button>
                        <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-white">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Message Thread */}
                <div className="flex-1 overflow-y-auto p-10 flex flex-col-reverse justify-start space-y-reverse space-y-6 custom-scrollbar">
                    {/* Example Messages */}
                    <div className="flex justify-start">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-white/80 text-sm max-w-[70%] rounded-tl-none leading-relaxed">
                            Hello! Have you checked the latest study materials for the AI module?
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="p-6 rounded-3xl bg-walia-primary text-white text-sm max-w-[70%] rounded-tr-none shadow-lg shadow-walia-primary/20 leading-relaxed">
                            Yes, I already started working on the summary. I'll share it here when it's done. 🚀
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="p-8 flex items-center space-x-4">
                    <div className="flex items-center space-x-2 mr-2">
                        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all">
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative group flex-1">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full bg-white/5 border border-white/10 rounded-[28px] pl-8 pr-20 py-5 text-sm text-white focus:border-walia-primary/50 outline-none transition-all"
                        />
                        <button className="absolute right-2 top-2 bottom-2 px-6 rounded-2xl bg-walia-primary text-white hover:bg-walia-secondary transition-all flex items-center shadow-lg">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </main>

        </div>
    );
}
