import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, firestore } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { query, where, collection, getDocs } from 'firebase/firestore'; // Import necessary Firestore methods

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

                try {
                    // Check if the user's email already exists in the 'users' collection
                    const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
                    const userSnapshot = await getDocs(userQuery);

                    if (userSnapshot.empty) {
                        throw new Error("Your account does not exist in the system. Please contact support.");
                    }

                    // If user exists, navigate to the dashboard
                    navigate('/dashboard');
                } catch (error) {
                    setError(error.message); // Display error if user doesn't exist or other issues occur
                }
            })
            .catch((error) => {
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