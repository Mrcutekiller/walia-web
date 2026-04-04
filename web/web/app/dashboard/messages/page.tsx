'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    Search, Plus, Video, Phone, MoreVertical, 
    CheckCheck, ImageIcon, Paperclip, Smile, Send,
    User, BellOff, FileText, LayoutDashboard 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UserBadge from '@/components/UserBadge';

export default function MessagesPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('All');
    
    // UI Layout translated directly from Stitch Monolith theme
    return (
        <div className="flex flex-1 h-[calc(100vh-80px)] lg:h-screen bg-[var(--color-surface)] overflow-hidden lg:pl-0">
            
            {/* Conversation List Pane (Middle) */}
            <section className="w-full md:w-[400px] flex flex-col bg-[var(--color-surface-container-low)] border-r border-[var(--color-outline)]/10 relative z-10">
                {/* Top Header for Messages */}
                <header className="flex flex-col gap-6 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-[family-name:var(--font-manrope)] font-bold text-[var(--color-on-surface)] tracking-tight">Messages</h2>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-variant)] transition-colors text-[var(--color-on-surface-variant)]">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm hover:scale-95 transition-transform">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Stories Section (Instagram Style) */}
                    <div className="flex gap-4 overflow-x-auto premium-scrollbar pb-2">
                        <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
                            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-[var(--color-primary)]">
                                <div className="w-full h-full rounded-full border-2 border-[var(--color-surface-container-low)] overflow-hidden bg-[var(--color-surface)] flex items-center justify-center">
                                    {user?.photoURL ? <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" /> : <span className="font-bold text-[var(--color-on-surface)] uppercase">{user?.name?.charAt(0) || 'U'}</span>}
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">You</span>
                        </div>
                        {/* Mock Story */}
                        <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
                            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-[var(--color-tertiary)]">
                                <div className="w-full h-full rounded-full border-2 border-[var(--color-surface-container-low)] overflow-hidden bg-[var(--color-surface-variant)] flex items-center justify-center">
                                    <span className="font-bold text-[var(--color-on-surface-variant)]">S</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Sarah</span>
                        </div>
                        {/* Mock Story */}
                        <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer opacity-50">
                            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-[var(--color-outline-variant)]">
                                <div className="w-full h-full rounded-full border-2 border-[var(--color-surface-container-low)] overflow-hidden bg-[var(--color-surface-container)] flex items-center justify-center">
                                    <span className="font-bold text-[var(--color-on-surface-variant)]">M</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Marcus</span>
                        </div>
                    </div>
                    
                    {/* Category Tabs */}
                    <div className="flex gap-6 border-b-0">
                        {['All', 'Chats', 'Groups'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-2 font-semibold text-sm transition-all shadow-[0_1px_rgba(0,0,0,0.03)]",
                                    activeTab === tab 
                                        ? "text-[var(--color-on-surface)] border-b-2 border-[var(--color-primary)] shadow-none" 
                                        : "text-[var(--color-on-surface-variant)] font-medium hover:text-[var(--color-on-surface)]"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-1 premium-scrollbar">
                    {/* Active Conversation Item */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface-container-lowest)] shadow-[0_4px_20px_rgba(45,52,53,0.04)] cursor-pointer">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-surface-variant)] flex items-center justify-center">
                                <span className="font-bold text-[var(--color-on-surface-variant)]">E</span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--color-surface-container-lowest)] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-semibold text-[var(--color-on-surface)] font-[family-name:var(--font-inter)] truncate">Elena Vance</h3>
                                <span className="text-[10px] text-[var(--color-on-surface-variant)] font-medium">10:42 AM</span>
                            </div>
                            <p className="text-sm text-[var(--color-on-surface-variant)] truncate font-medium">I've attached the final AI prototypes for the...</p>
                        </div>
                        <div className="w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center shrink-0">
                            <span className="text-[10px] text-[var(--color-on-primary)] font-bold">2</span>
                        </div>
                    </div>

                    {/* Inactive Conversation Item */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer group">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-surface-variant)] flex items-center justify-center">
                                <span className="font-bold text-[var(--color-on-surface-variant)]">M</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-semibold text-[var(--color-on-surface)] font-[family-name:var(--font-inter)] truncate">Marcus Aurelius</h3>
                                <span className="text-[10px] text-[var(--color-on-surface-variant)]">Yesterday</span>
                            </div>
                            <p className="text-sm text-[var(--color-on-surface-variant)] truncate">The quarterly data looks promising. Let's sync.</p>
                        </div>
                    </div>

                    {/* Group Conversation */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer group">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-tertiary-container)] flex items-center justify-center text-[var(--color-tertiary)] font-bold">DT</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-semibold text-[var(--color-on-surface)] font-[family-name:var(--font-inter)] truncate">Design Team</h3>
                                <span className="text-[10px] text-[var(--color-on-surface-variant)]">Yesterday</span>
                            </div>
                            <p className="text-sm text-[var(--color-on-surface-variant)] truncate"><span className="text-[var(--color-primary)] font-medium">Sarah:</span> Can someone check the Figma link?</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chat Window (Right Pane) */}
            <section className="flex-1 hidden md:flex flex-col bg-[var(--color-surface)] overflow-hidden relative">
                {/* Chat Header */}
                <header className="flex items-center justify-between px-10 h-20 bg-[var(--color-surface-container-lowest)]/80 backdrop-blur-md z-20 shadow-[0_1px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--color-surface-variant)] flex items-center justify-center">
                                <span className="font-bold text-[var(--color-on-surface-variant)]">E</span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--color-surface-container-lowest)] rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="font-[family-name:var(--font-manrope)] font-bold text-[var(--color-on-surface)] leading-tight">Elena Vance</h2>
                            <p className="text-[11px] text-green-600 font-semibold tracking-wide flex items-center gap-1">
                                <span className="w-1 h-1 bg-green-600 rounded-full"></span> Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] transition-colors">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 flex flex-col premium-scrollbar">
                    <div className="flex justify-center">
                        <span className="px-4 py-1 rounded-full bg-[var(--color-surface-container)] text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Today</span>
                    </div>
                    
                    {/* Received Message */}
                    <div className="flex gap-4 max-w-[70%] group">
                        <div className="mt-auto">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-surface-variant)] flex items-center justify-center">
                                <span className="font-bold text-xs text-[var(--color-on-surface-variant)]">E</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] px-5 py-3 rounded-2xl rounded-bl-none text-sm font-medium leading-relaxed shadow-[0_0_0_1px_rgba(0,0,0,0.03)] border-none">
                                Hey! Have you had a chance to look at the new Walia AI design language we discussed?
                            </div>
                            <span className="text-[10px] text-[var(--color-on-surface-variant)]/60 font-medium tracking-tight">10:38 AM</span>
                        </div>
                    </div>
                    
                    {/* Sent Message */}
                    <div className="flex flex-col items-end gap-1 ml-auto max-w-[70%]">
                        <div className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-5 py-3 rounded-2xl rounded-br-none text-sm font-medium leading-relaxed shadow-sm">
                            Just checking them now. The "No-Line" architecture really sets a professional tone. Love the tonal shifts!
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--color-on-surface-variant)]/60 font-medium tracking-tight">10:40 AM</span>
                            <CheckCheck className="w-[14px] h-[14px] text-[var(--color-primary)]" />
                        </div>
                    </div>
                    
                    {/* Received Asset Message */}
                    <div className="flex gap-4 max-w-[70%]">
                        <div className="mt-auto">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-surface-variant)] flex items-center justify-center">
                                <span className="font-bold text-xs text-[var(--color-on-surface-variant)]">E</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] px-5 py-3 rounded-2xl rounded-bl-none text-sm font-medium leading-relaxed shadow-[0_0_0_1px_rgba(0,0,0,0.03)] border-none">
                                Exactly. Here's the updated asset for the "Atelier" project workspace.
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.03)] aspect-video w-full max-w-[320px] bg-[var(--color-surface-container)] flex items-center justify-center border-none">
                                <span className="text-[var(--color-outline)] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Image Asset
                                </span>
                            </div>
                            <span className="text-[10px] text-[var(--color-on-surface-variant)]/60 font-medium tracking-tight">10:42 AM</span>
                        </div>
                    </div>
                </div>

                {/* Message Input Area */}
                <footer className="px-10 py-6 bg-[var(--color-surface)] z-10 shadow-[0_-1px_rgba(0,0,0,0.03)] border-none">
                    <div className="flex items-center gap-4 bg-[var(--color-surface-container-low)] px-4 py-3 rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)] focus-within:shadow-[0_0_0_1px_var(--color-primary)] transition-all">
                        <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                            <Plus className="w-[22px] h-[22px]" />
                        </button>
                        <input className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-[var(--color-on-surface-variant)]/80 text-[var(--color-on-surface)]" placeholder="Type a message..." type="text"/>
                        <div className="flex items-center gap-2">
                            <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors rounded-full p-2 hover:bg-[var(--color-surface-container)]">
                                <Smile className="w-[20px] h-[20px]" />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] flex items-center justify-center hover:scale-[1.03] transition-transform active:scale-95 ml-1">
                                <Send className="w-[18px] h-[18px]" />
                            </button>
                        </div>
                    </div>
                </footer>
            </section>

            {/* Info Pane (Rightmost) */}
            <section className="w-[320px] bg-[var(--color-surface-container-lowest)] flex flex-col shadow-[-1px_0_rgba(0,0,0,0.03)] hidden xl:flex z-10 relative">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-[var(--color-surface-variant)] mb-4 ring-4 ring-[var(--color-surface-container-lowest)] shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                        <span className="text-3xl font-bold text-[var(--color-on-surface-variant)]">E</span>
                    </div>
                    <h3 className="text-lg font-[family-name:var(--font-manrope)] font-bold text-[var(--color-on-surface)]">Elena Vance</h3>
                    <p className="text-xs text-[var(--color-on-surface-variant)] font-medium mb-6">Creative Director at Walia AI</p>
                    
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button className="flex flex-col items-center gap-2 p-3 pb-4 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-container)] transition-colors group shadow-sm">
                            <User className="w-[22px] h-[22px] text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] mt-1" />
                            <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Profile</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-3 pb-4 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-container)] transition-colors group shadow-sm">
                            <BellOff className="w-[22px] h-[22px] text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)] mt-1" />
                            <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Mute</span>
                        </button>
                    </div>
                </div>

                <div className="px-8 flex-1 overflow-y-auto space-y-8 premium-scrollbar pb-10">
                    {/* Media Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Shared Assets</h4>
                            <button className="text-[10px] font-bold text-[var(--color-primary)]">View All</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({length: 6}).map((_, i) => (
                                <div key={i} className="aspect-square rounded-lg bg-[var(--color-surface-variant)] flex items-center justify-center shadow-[0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden">
                                     <span className="text-[10px] font-bold text-[var(--color-outline)] opacity-50 uppercase tracking-widest">Img</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Documents</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-surface-variant)]">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-semibold text-[var(--color-on-surface)] truncate">Brand_Guidelines_V2.pdf</h5>
                                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">4.2 MB • Oct 24</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-tertiary)] transition-colors group-hover:bg-[var(--color-surface-variant)]">
                                    <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-semibold text-[var(--color-on-surface)] truncate">User_Feedback_Results.xlsx</h5>
                                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">1.8 MB • Oct 21</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Section */}
                    <div className="space-y-4 pt-4 border-t border-[var(--color-outline)]/5 mt-4">
                        <button className="w-full flex items-center justify-between text-red-600 font-semibold text-xs py-2 px-1 hover:bg-red-50 rounded-lg transition-colors">
                            <span>Block Elena</span>
                            <span className="font-bold text-sm">×</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

