// #file: Login.js
import React, { useState, useEffect } from 'react';
import {useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [error, setError] = useState('');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMessage = params.get('error');
        if (errorMessage) {
            setError(errorMessage);
        }
    }, [location]);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5001/api/auth/google';
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