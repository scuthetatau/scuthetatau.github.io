import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';

export const checkUserRoles = (allowedRoles, navigate) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // console.log("Authenticated account");
            const userQuery = query(collection(firestore, 'users'), where('email', '==', user.email));
            try {
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userDoc = userSnapshot.docs[0];
                    const userData = userDoc.data();
                    // console.log("User data:", userData);
                    if (!allowedRoles.includes(userData.role)) {
                        // console.log(`User role is ${userData.role}, redirecting to home page`);
                        navigate('/');
                    } else {
                        // console.log(`User role is ${userData.role}, access granted`);
                    }
                } else {
                    // console.log("User data does not exist in Firestore, redirecting to home page");
                    navigate('/');
                }
            } catch (error) {
                // console.error("Error fetching user document:", error);
                navigate('/');
            }
        } else {
            console.log("No authenticated account, redirecting to home page");
            navigate('/');
        }
    });
};