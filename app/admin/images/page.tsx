'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface ImageItem {
    id: string;
    title: string;
    type: string;
    status: string;
    url: string;
    size: string;
    date: string;
    sourcePath?: string; // e.g. 'users/123' or 'upgrades/abc' or 'chats/xyz/messages/123'
}

export default function AdminImages() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const aggregatedImages: ImageItem[] = [];
                const usersSnap = await getDocs(collection(db, 'users'));
                usersSnap.docs.forEach(d => {
                    if (d.data().photoURL) aggregatedImages.push({ id: d.id, url: d.data().photoURL } as ImageItem);
                });
                const upgradesSnap = await getDocs(collection(db, 'upgrades'));
                upgradesSnap.docs.forEach(d => {
                    if (d.data().screenshotURL) aggregatedImages.push({ id: d.id, url: d.data().screenshotURL } as ImageItem);
                });
                setImages(aggregatedImages);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-2xl font-bold">Admin Images UI Removed</h1>
            <p className="text-white/50">Image management backend logic remains available.</p>
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Connectivity Proof:</p>
                <p className="text-xl font-bold">{images.length} Assets Found across Collections</p>
            </div>
        </div>
    );
}
