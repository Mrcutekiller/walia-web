import { GoogleAuthProvider } from 'firebase/auth';
export { auth, db, storage, default as app } from '@/services/firebase';

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
