// Mock data for the entire app

export interface ChatUser {
    id: string;
    name: string;
    username: string;
    photoURL: string;
    online: boolean;
    bio: string;
    stats: { likes: string; posts: number; views: string };
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    image?: string;
}

export interface Chat {
    id: string;
    type: 'private' | 'group';
    name: string;
    photoURL: string;
    lastMessage: string;
    lastTime: string;
    unread: number;
    members: string[];
    pinned: boolean;
    messages: Message[];
}

export interface Post {
    id: string;
    userId: string;
    type: 'text' | 'quiz' | 'note' | 'ai_share';
    content: string;
    title?: string;
    likes: number;
    comments: Comment[];
    shares: number;
    timestamp: string;
    liked: boolean;
    quizOptions?: string[];
    quizAnswer?: number;
}

export interface Comment {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

export interface Flashcard {
    id: string;
    front: string;
    back: string;
    difficulty: 'hard' | 'medium' | 'easy';
    category: string;
}

export interface Quiz {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    color: string;
    category: string;
    timestamp: string;
}

export interface Reminder {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    color: string;
    completed: boolean;
}

export interface AIChat {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    messages: { id: string; role: 'user' | 'ai'; text: string; timestamp: string }[];
}

// ----- USERS -----
export const USERS: ChatUser[] = [];


// ----- CHATS -----
export const CHATS: Chat[] = [];


// ----- COMMUNITY POSTS -----
export const POSTS: Post[] = [];


// ----- FLASHCARDS -----
export const FLASHCARDS: Flashcard[] = [];


// ----- QUIZZES -----
export const QUIZZES: Quiz[] = [];


// ----- NOTES -----
export const NOTES: Note[] = [];


// ----- REMINDERS -----
export const REMINDERS: Reminder[] = [];


// ----- AI CHATS -----
export const AI_CHATS: AIChat[] = [];


export function getUserById(id: string): ChatUser | undefined {
    return USERS.find(u => u.id === id);
}
