import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import './Dashboard.css';

const NewDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                try {
                    const userQuery = query(collection(firestore, 'users'), where('email', '==', currentUser.email));
                    const userSnapshot = await getDocs(userQuery);

                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();
                        let profilePicUrl = userData.profilePictureUrl;

                        if (profilePicUrl && !profilePicUrl.startsWith('https://lh3.googleusercontent.com/')) {
                            try {
                                profilePicUrl = await getDownloadURL(ref(storage, profilePicUrl));
                            } catch (error) {
                                console.error(`Error getting image URL for user ${currentUser.email}:`, error);
                            }
                        }

                        setUser({
                            ...userData,
                            profilePictureUrl: profilePicUrl || currentUser.photoURL
                        });
                        setPoints(userData.points || 0); // Assuming points are stored in user data
                    } else {
                        setError('User data not found');
                    }
                } catch (err) {
                    console.error('Error fetching Firestore data:', err);
                    setError('Failed to fetch user data.');
                }
            } else {
                setError('No authenticated user found.');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const progressGoal = 2000;
    const progressPercentage = (points / progressGoal) * 100;

    return (
        <div className="new-dashboard-container">
            <div className="dashboard-header">
                {user && (
                    <div className="user-info">
                        <img className="profile-picture" src={user.profilePictureUrl} alt="Profile" />
                        <div className="welcome-container">
                            <h1 className="welcome-message">Welcome, {user.firstName}</h1>
                            <div className="user-details">
                                <p>{user.email}</p>
                                <p>{user.role}</p>
                                <p>{user.team}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="widgets">
                <div className="card progress-card">
                    <h2>Points</h2>
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p>{points} / {progressGoal} Points</p>
                </div>
                <div className="card calendar-card">
                    {/* Google Calendar widget will go here */}
                    <h2>Upcoming Events</h2>
                </div>
            </div>
            <div className="widgets">
                <div className="card progress-card">
                    <h2>BroDates</h2>
                    <p>Your Brodate's for this week</p>
                </div>
            </div>
        </div>
    );
};

export default NewDashboard;