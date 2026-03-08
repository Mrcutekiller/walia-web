import { deleteUser } from 'firebase/auth';
import {
    collection,
    doc,
    getDocs,
    query,
    where,
    writeBatch
} from 'firebase/firestore';
import { auth, db } from './firebase';

export async function deleteAccount() {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is logged in.');

    const batch = writeBatch(db);
    const userId = user.uid;

    try {
        // 1. Delete user document
        batch.delete(doc(db, 'users', userId));

        // 2. Delete user messages (subcollection)
        const messagesSnap = await getDocs(collection(db, 'users', userId, 'messages'));
        messagesSnap.forEach((d) => batch.delete(d.ref));

        // 3. Delete user usage records
        const usageSnap = await getDocs(query(collection(db, 'usage'), where('userId', '==', userId)));
        usageSnap.forEach((d) => batch.delete(d.ref));

        // 4. Delete user reviews
        const reviewsSnap = await getDocs(query(collection(db, 'reviews'), where('userId', '==', userId)));
        reviewsSnap.forEach((d) => batch.delete(d.ref));

        // Commit Firestore deletions
        await batch.commit();

        // 5. Delete Auth user (may fail if session is old)
        await deleteUser(user);

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting account:', error);
        if (error.code === 'auth/requires-recent-login') {
            throw new Error('This operation is sensitive and requires recent authentication. Please log out and log in again before deleting your account.');
        }
        throw error;
    }
}

export async function searchUsers(queryText: string) {
    if (!queryText.trim()) return [];
    const q = query(
        collection(db, 'users'),
        where('username', '>=', queryText.toLowerCase()),
        where('username', '<=', queryText.toLowerCase() + '\uf8ff')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function checkUsernameUnique(username: string): Promise<boolean> {
    const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
    const snap = await getDocs(q);
    return snap.empty;
}

export async function getOrCreateChat(user1Id: string, user2Id: string) {
    const participants = [user1Id, user2Id].sort();
    const q = query(collection(db, 'chats'),
        where('participants', '==', participants),
        where('type', '==', 'dm')
    );
    const snap = await getDocs(q);

    if (!snap.empty) return snap.docs[0].id;

    const { addDoc, serverTimestamp } = require('firebase/firestore');
    const newChat = await addDoc(collection(db, 'chats'), {
        participants,
        type: 'dm',
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp()
    });
    return newChat.id;
}

export async function createGroupChat(creatorId: string, participantIds: string[], name: string) {
    const { addDoc, serverTimestamp } = require('firebase/firestore');
    const participants = Array.from(new Set([creatorId, ...participantIds]));
    const newChat = await addDoc(collection(db, 'chats'), {
        participants,
        type: 'group',
        name,
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        createdBy: creatorId
    });
    return newChat.id;
}
