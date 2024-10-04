import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, firestore } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore'; // Import necessary Firestore methods

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
                const { displayName, email, photoURL } = user;

                // Fetch the document containing the array of authorized emails
                const authorizedEmailsRef = doc(firestore, 'authorizedEmails', 'emails_array');
                const authorizedEmailsDoc = await getDoc(authorizedEmailsRef);

                if (!authorizedEmailsDoc.exists()) {
                    throw new Error("Authorization list not found.");
                }

                const authorizedEmails = authorizedEmailsDoc.data().email;

                if (!authorizedEmails || !Array.isArray(authorizedEmails) || !authorizedEmails.includes(email)) {
                    throw new Error("Your email is not listed as an authorized email.");
                }

                // Check if the user's email is already registered
                const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
                const userSnapshot = await getDocs(userQuery);

                let userData = {
                    firstName: displayName ? displayName.split(' ')[0] : null,
                    lastName: displayName ? displayName.split(' ')[1] : null,
                    email,
                    profilePictureUrl: photoURL,
                };

                if (userSnapshot.empty) {
                    // If no user with the email exists, create a new user document without using UID
                    await setDoc(doc(firestore, 'users', email), {
                        ...userData,
                        class: "", // Dummy data for class
                        graduationYear: 0, // Dummy data for graduation year
                        family: "", // Dummy data for family
                        major: "", // Dummy data for major
                        role: "", // Dummy data for role
                        points: 0 // Initialize points to 0
                    });
                } else {
                    // If user with the email exists, update the existing user's information with merge option
                    const existingUserRef = userSnapshot.docs[0].ref;
                    const existingUserData = userSnapshot.docs[0].data();

                    // Only update fields that are empty or zero
                    const updatedUserData = {
                        firstName: existingUserData.firstName || userData.firstName,
                        lastName: existingUserData.lastName || userData.lastName,
                        email: existingUserData.email || userData.email,
                        profilePictureUrl: existingUserData.profilePictureUrl || userData.profilePictureUrl,
                        class: existingUserData.class || "", // Replace with appropriate logic if needed
                        graduationYear: existingUserData.graduationYear || 0, // Replace with appropriate logic if needed
                        family: existingUserData.family || "", // Replace with appropriate logic if needed
                        major: existingUserData.major || "", // Replace with appropriate logic if needed
                        role: existingUserData.role || "", // Replace with appropriate logic if needed
                        points: existingUserData.points || 0 // Replace with appropriate logic if needed
                    };

                    await setDoc(existingUserRef, updatedUserData, { merge: true });
                }

                // Navigate to the dashboard on successful login
                navigate('/dashboard');
            })
            .catch((error) => {
                setError(error.message); // Display error if email is not authorized or other issues occur
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