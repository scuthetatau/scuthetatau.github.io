import {onAuthStateChanged} from 'firebase/auth';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {auth, firestore} from '../../firebase';

/**
 * Role-based access permissions mapping.
 * Each role is mapped to an array of permissions they have access to.
 * Permissions are used to control access to specific features:
 * - user-management: Access to user management features
 * - bro-dates: Access to bro dates management
 * - scribe-editor: Access to scribe editor
 * - spoon-assassins: Access to spoon assassins game management
 */
const ROLE_PERMISSIONS = {
    'Webmaster': ['user-management', 'bro-dates', 'scribe-editor', 'spoon-assassins'],
    'Brotherhood Chair': ['bro-dates', 'spoon-assassins'],
    'Mediation Chair': ['bro-dates'],
    'Scribe': ['scribe-editor']
};

/**
 * Checks if a user has the required permission to access a feature.
 * If the user doesn't have the required permission, they are redirected to the home page.
 * 
 * @param {Function} navigate - React Router's navigate function
 * @param {string} requiredPermission - The permission required to access the feature
 * @returns {Function} Unsubscribe function for the auth state listener
 * 
 * Usage example:
 * useEffect(() => {
 *   const unsubscribe = checkUserRole(navigate, 'user-management');
 *   return () => unsubscribe && unsubscribe();
 * }, [navigate]);
 */

export const checkUserRole = (navigate, requiredPermission = null) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userQuery = query(collection(firestore, 'users'), where('email', '==', user.email));
            try {
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userDoc = userSnapshot.docs[0];
                    const userData = userDoc.data();
                    const userRole = userData.role;

                    // If no specific permission is required, just check if user has any admin role
                    if (!requiredPermission) {
                        if (!ROLE_PERMISSIONS[userRole]) {
                            navigate('/');
                        }
                    } else {
                        // Check if user's role has the required permission
                        const userPermissions = ROLE_PERMISSIONS[userRole] || [];
                        if (!userPermissions.includes(requiredPermission)) {
                            navigate('/');
                        }
                    }
                } else {
                    navigate('/');
                }
            } catch (error) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    });
};

/**
 * Gets all permissions for a given user based on their role.
 * 
 * @param {Object} user - Firebase auth user object
 * @returns {Promise<string[]>} Array of permissions the user has
 * 
 * Usage example:
 * const permissions = await getUserPermissions(auth.currentUser);
 * if (permissions.includes('user-management')) {
 *   // User has access to user management
 * }
 */

export const getUserPermissions = async (user) => {
    if (!user) return [];
    
    const userQuery = query(collection(firestore, 'users'), where('email', '==', user.email));
    const userSnapshot = await getDocs(userQuery);
    if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const role = userData.role;
        return ROLE_PERMISSIONS[role] || [];
    }
    return [];
};