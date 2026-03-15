'use client';

import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface UserBadgeProps {
    uid: string;
    showUsername?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function UserBadge({ uid, showUsername = true, className, size = 'md' }: UserBadgeProps) {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (!uid) return;
        const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
            if (snap.exists()) {
                setUserData(snap.data());
            }
        });
        return () => unsub();
    }, [uid]);

    const sizes = {
        sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4', text: 'text-[10px]', subtext: 'text-[8px]' },
        md: { box: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6', text: 'text-xs', subtext: 'text-[10px]' },
        lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7', text: 'text-sm', subtext: 'text-[11px]' }
    };

    const currentSize = sizes[size];

    return (
        <div className={cn("flex items-center space-x-3", className)}>
            <div className={cn(
                "bg-walia-primary/10 border border-walia-primary/20 flex items-center justify-center font-bold text-walia-primary overflow-hidden relative shrink-0",
                currentSize.box
            )}>
                {userData?.photoURL ? (
                    <Image src={userData.photoURL} alt={userData.name || 'User'} fill className="object-cover" />
                ) : (
                    <User className={currentSize.icon} />
                )}
            </div>
            {(userData || !uid) && (
                <div className="flex flex-col min-w-0">
                    <h4 className={cn("font-black text-black dark:text-white truncate", currentSize.text)}>
                        {userData?.name || userData?.displayName || 'Student'}
                    </h4>
                    {showUsername && (
                        <p className={cn("text-gray-500 dark:text-white/30 font-black uppercase tracking-widest truncate", currentSize.subtext)}>
                            @{userData?.username || 'walia_user'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
