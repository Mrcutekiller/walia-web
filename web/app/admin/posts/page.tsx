'use client';

import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface Post {
    id: string;
    author: string;
    content: string;
    type: string;
    status: string;
    likes: number;
    comments: number;
    time: string;
}

const mockPosts: Post[] = [
    { id: '1', author: 'Biruk A.', content: 'Just finished my first AI study session! This tool is incredible.', type: 'Success', status: 'Approved', likes: 24, comments: 5, time: '2h ago' },
    { id: '2', author: 'Anonymous', content: 'Anyone has notes for Advanced Calculus? I really need them for my finals.', type: 'Question', status: 'Pending', likes: 0, comments: 2, time: '4h ago' },
    { id: '3', author: 'Sarah M.', content: 'Check out this cool prompt I used to generate a study plan! [Link]', type: 'Sharing', status: 'Reported', likes: 12, comments: 8, time: '1d ago' },
    { id: '4', author: 'John Doe', content: 'SPAM SPAM SPAM buy this now!!!', type: 'Spam', status: 'Pending', likes: 0, comments: 0, time: '5m ago' },
    { id: '5', author: 'Emma W.', content: 'Walia AI really helped me understand quantum physics concepts better.', type: 'Feedback', status: 'Approved', likes: 45, comments: 12, time: '3h ago' },
];

export default function AdminPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'posts'), (snap) => {
            setPosts(snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as Post)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Posts UI Removed</h1>
            <p className="text-white/50">Content moderation backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{posts.length} Community Posts Found</p>
            </div>
        </div>
    );
}
