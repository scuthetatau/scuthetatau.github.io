import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, firestore } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { query, collection, getDocs } from 'firebase/firestore'; // Removed 'where' since we're retrieving all users

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
                    // Get all users from the 'users' collection instead of using a where clause
                    const userQuery = query(collection(firestore, 'users'));
                    const userSnapshot = await getDocs(userQuery);

                    console.log('Query results empty:', userSnapshot.empty);

                    // Find a user with matching email (case-insensitive)
                    const matchingUser = userSnapshot.docs.find(doc =>
                        doc.data().email && doc.data().email.toLowerCase() === email.toLowerCase()
                    );

                    // Log all users to help debug
                    userSnapshot.forEach(doc => {
                        console.log('Found user document:', doc.id, doc.data());
                    });

                    if (!matchingUser) {
                        console.log('No matching user found for email:', email);
                        throw new Error("Your account does not exist in the system. Please contact support.");
                    }

                    console.log('Matching user found:', matchingUser.id, matchingUser.data());

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