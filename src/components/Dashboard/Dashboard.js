import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import './Dashboard.css';
import { FaHome, FaBox, FaBullhorn, FaCalendarAlt, FaDollarSign, FaFileAlt, FaCog } from 'react-icons/fa'; // Importing Font Awesome icons
import Widgets from './pages/Widgets';  // Import Widgets component

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                try {
                    const userQuery = query(collection(firestore, 'users'), where('email', '==', currentUser.email));
                    const userSnapshot = await getDocs(userQuery);

                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();
                        setUser({
                            ...userData,
                            profilePictureUrl: currentUser.photoURL
                        });
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

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <nav className="sidebar">
                <div className="profile-section">
                    {user && (
                        <>
                            <img className="profile-picture" src={user.profilePictureUrl} alt="Profile" />
                            <p className="welcome-message">Welcome, {user.firstName}</p>
                        </>
                    )}
                </div>
                <ul className="menu">
                    <li><a href="/dashboard"><FaHome /> Overview</a></li>
                    <li><a href="/products"><FaBox /> Products</a></li>
                    <li><a href="/campaigns"><FaBullhorn /> Campaigns</a></li>
                    <li><a href="/schedule"><FaCalendarAlt /> Schedules</a></li>
                    <li><a href="/payouts"><FaDollarSign /> Payouts</a></li>
                    <li><a href="/statements"><FaFileAlt /> Statements</a></li>
                    <li><a href="/settings"><FaCog /> Settings</a></li>
                </ul>
            </nav>

            {/* Main Dashboard */}
            <div className="main-dashboard">
                <header className="dashboard-header">
                    <h2>Dashboard</h2>
                    <input type="search" placeholder="Search" className="search-bar" />
                </header>

                {/* Widgets */}
                <Widgets user={user} />
            </div>
        </div>
    );
};

export default Dashboard;