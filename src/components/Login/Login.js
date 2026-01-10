import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, firestore } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { query, collection, getDocs, where, doc, setDoc } from 'firebase/firestore';

const ADMIN_ROLES = [
    'Webmaster', 'Regent', 'Vice Regent', 'Treasurer', 'Scribe',
    'Brotherhood Chair', 'Mediation Chair', 'Historian'
];

const Login = () => {
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMessage = params.get('error');
        if (errorMessage) {
            setError(errorMessage);
        }
    }, [location]);

    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                const { email } = user;

                // Add logging to debug
                console.log('Google returned email:', email);
                console.log('Starting Firestore query for email:', email);

                try {
                    // Query only the user with the matching email (Hella efficent)
                    const userQuery = query(
                        collection(firestore, 'users'),
                        where('email', '==', email)
                    );
                    const userSnapshot = await getDocs(userQuery);

                    console.log('Query results empty:', userSnapshot.empty);

                    if (userSnapshot.empty) {
                        console.log('No matching user found for email:', email);
                        setError("Your account does not exist in the system. Please contact support.");
                        return;
                    }

                    const matchingUser = userSnapshot.docs[0];
                    const userData = matchingUser.data();
                    console.log('Matching user found:', matchingUser.id, userData);

                    // Sync admin role to 'admins' collection for security rules
                    if (ADMIN_ROLES.includes(userData.role)) {
                        try {
                            await setDoc(doc(firestore, 'admins', email), {
                                role: userData.role,
                                userId: matchingUser.id
                            });
                            console.log('Admin role synced to Firestore');
                        } catch (adminErr) {
                            console.warn('Failed to sync admin role (this is expected if not an admin or first time):', adminErr);
                        }
                    }

                    // If user exists, navigate to the dashboard
                    navigate('/dashboard');
                } catch (error) {
                    console.error('Login error:', error);
                    setError(error.message); // Display error if user doesn't exist or other issues occur
                }
            })
            .catch((error) => {
                console.error('Google sign-in error:', error);
                setError(error.message);
            });
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-title">Active Login</div>
                {error && <p className="error-message">{error}</p>}
                <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Login;