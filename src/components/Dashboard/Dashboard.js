import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import './Dashboard.css';
import { AiOutlineEdit } from 'react-icons/ai';
import EditUserPopup from './EditUserPopup';
import { initClient, getUpcomingEvents } from './googleCalendarService';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [points, setPoints] = useState(0);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [broDateGroup, setBroDateGroup] = useState([]);
    const [target, setTarget] = useState(null);

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
                        setPoints(userData.points || 0);

                        // Fetch target information
                        const targetsQuery = query(collection(firestore, 'targets'), where('userId', '==', userData.id));
                        const targetsSnapshot = await getDocs(targetsQuery);
                        if (!targetsSnapshot.empty) {
                            setTarget(targetsSnapshot.docs[0].data());
                        }

                        // Fetch BroDate group
                        const broDatesQuery = query(collection(firestore, 'brodates'));
                        const broDatesSnapshot = await getDocs(broDatesQuery);
                        const broDates = broDatesSnapshot.docs.map(doc => doc.data());
                        const userGroup = broDates.find(group => group.members.some(member => member.email === currentUser.email));
                        if (userGroup) {
                            setBroDateGroup(userGroup.members);
                        }
                    } else {
                        setError('User data not found');
                    }
                } catch (err) {
                    console.error('Error fetching Firestore data:', err);
                    setError('Failed to fetch user data.');
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Initialize the Google API client and fetch events
        const fetchEvents = async () => {
            try {
                await initClient();
                const upcomingEvents = await getUpcomingEvents();
                setEvents(upcomingEvents);
            } catch (error) {
                console.error('Error initializing Google API client or fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const openEditPopup = () => {
        setIsEditPopupOpen(true);
    };

    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const progressGoal = 2000;
    const progressPercentage = (points / progressGoal) * 100;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                {user ? (
                    <>
                        <div className="user-info">
                            <img className="profile-picture" src={user.profilePictureUrl} alt="Profile"/>
                            <div className="welcome-container">
                                <h1 className="welcome-message">Welcome, {user.firstName}</h1>
                                <div className="user-details">
                                    <p>{user.email}</p>
                                    <p>{user.role}</p>
                                    <p>{user.major}</p>
                                    <p>{user.class} Class</p>
                                    <p>{user.graduationYear}</p>
                                    <p>{user.family}</p>
                                </div>
                            </div>
                        </div>
                        <AiOutlineEdit className="edit-icon" onClick={openEditPopup}/>
                    </>
                ) : (
                    <p>User is not logged in.</p>
                )}
            </div>

            {/*Spoon Assassins widget*/}
            {/*<div className="widgets">*/}
            {/*    <div className="card spoon-card">*/}
            {/*        <h2>Spoon Assassin</h2>*/}
            {/*        <p>Your target: {target.targetName}</p>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="widgets">
                <div className="card progress-card">
                    <h2>Points</h2>
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{width: `${progressPercentage}%`}}
                        ></div>
                    </div>
                    <p>{points} / {progressGoal} Points</p>
                </div>

                <div className="card calendar-card">
                    <h2>Upcoming Events</h2>
                    {events.length > 0 ? (
                        events.map((event, index) => {
                            let eventDate;

                            if (event.start.date && !event.start.dateTime) {
                                // Handle all-day events by treating the date as-is
                                const dateParts = event.start.date.split('-');
                                const year = parseInt(dateParts[0], 10);
                                const month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-indexed
                                const day = parseInt(dateParts[2], 10);

                                const localDate = new Date(year, month, day);
                                eventDate = localDate.toLocaleDateString(); // Display only the date without time adjustments
                            } else {
                                // Handle timed events
                                eventDate = new Date(event.start.dateTime).toLocaleString(); // Display date and time for timed events
                            }

                            return (
                                <div className="event" key={index}>
                                    <div className="event-name">{event.summary}</div>
                                    <div className="event-date">{eventDate}</div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No upcoming events</p>
                    )}
                </div>

            </div>

            <div className="widgets">
                <div className="card brother-card">
                    <h2>BroDates</h2>
                    {broDateGroup.length > 0 ? (
                        <ul>
                            {broDateGroup.map((member, index) => (
                                <li key={index}>{member.firstName} {member.lastName}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No BroDate group found.</p>
                    )}
                </div>
            </div>

            {isEditPopupOpen && <EditUserPopup user={user} onClose={closeEditPopup}/>}

            <div>
                <div className="buttons-container">
                    {user && (user.role === 'Webmaster' || user.role === 'Scribe') && (
                        <button onClick={() => window.location.href = '/scribe-editor'}>Go to Scribe Editor</button>
                    )}
                    {user && user.role === 'Webmaster' && (
                        <button onClick={() => window.location.href = '/admin'}>Go to Admin</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;