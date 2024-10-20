import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';

export const checkUserRole = (navigate) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role !== 'Webmaster') {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    });
};