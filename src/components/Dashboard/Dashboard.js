import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import './Dashboard.css';
import { AiOutlineEdit } from 'react-icons/ai';
import EditUserPopup from './EditUserPopup';
import { initClient, getUpcomingEvents } from './googleCalendarService';

// Constants
const PROGRESS_GOAL = 2500;
const GOOGLE_PHOTO_PREFIX = 'https://lh3.googleusercontent.com/';

// Utility functions
const getProfilePictureUrl = async (userData, currentUser) => {
    let profilePicUrl = userData?.profilePictureUrl;

    if (profilePicUrl && !profilePicUrl.startsWith(GOOGLE_PHOTO_PREFIX)) {
        try {
            const fileRef = ref(storage, profilePicUrl);
            profilePicUrl = await getDownloadURL(fileRef);
        } catch (error) {
            console.error(`Error getting profile picture URL for ${currentUser.email}:`, error);
            profilePicUrl = currentUser.photoURL;
        }
    } else {
        profilePicUrl = currentUser.photoURL;
    }

    return profilePicUrl;
};

const formatEventDate = (event) => {
    if (event.start.date && !event.start.dateTime) {
        const dateParts = event.start.date.split('-');
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);
        return new Date(year, month, day).toLocaleDateString();
    }
    return new Date(event.start.dateTime).toLocaleString();
};

// Reusable components
const UserInfo = ({ user, onEditClick }) => (
    <div className="user-info">
        <img
            className="profile-picture"
            src={user.profilePictureUrl}
            alt="Profile"
        />
        <div className="welcome-container">
            <h1 className="welcome-message">
                Welcome, {user.firstName}
            </h1>
            <div className="user-details">
                <p>{user.email}</p>
                <p>{user.role}</p>
                <p>{user.major}</p>
                <p>{user.class} Class</p>
                <p>{user.graduationYear}</p>
                <p>{user.family}</p>
            </div>
        </div>
        <AiOutlineEdit className="edit-icon" onClick={onEditClick} />
    </div>
);

const SpoonAssassinCard = ({ target }) => (
    <div 
        className={`card spoon-card ${target?.isEliminated ? 'eliminated' : ''}`}
        style={target?.isEliminated ? { backgroundColor: '#2c2c2c', color: 'white' } : {}}
    >
        <h2>Spoon Assassin</h2>
        {target?.isEliminated ? (
            <p>You have been eliminated</p>
        ) : (
            <p>
                Your target: {target ? target.targetName : 'No target assigned'}
            </p>
        )}
    </div>
);

const PointsCard = ({ points }) => {
    const progressPercentage = (points / PROGRESS_GOAL) * 100;
    
    return (
        <div className="card progress-card">
            <h2>Points</h2>
            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <p>
                {points} / {PROGRESS_GOAL} Points
            </p>
        </div>
    );
};

const CalendarCard = ({ events }) => (
    <div className="card calendar-card">
        <h2>Upcoming Events</h2>
        {events.length > 0 ? (
            events.map((event, index) => (
                <div className="event" key={index}>
                    <div className="event-name">{event.summary}</div>
                    <div className="event-date">{formatEventDate(event)}</div>
                </div>
            ))
        ) : (
            <p>No upcoming events</p>
        )}
    </div>
);

const BroDateCard = ({ broDateGroup }) => (
    <div className="card brother-card">
        <h2>BroDates</h2>
        {broDateGroup.length > 0 ? (
            <ul>
                {broDateGroup.map((member, index) => (
                    <li key={index}>
                        {member.firstName} {member.lastName}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No BroDate group found.</p>
        )}
    </div>
);

const AdminButtons = ({ user }) => {
    const buttons = [
        {
            roles: ['Webmaster', 'Scribe'],
            label: 'Go to Scribe Editor',
            path: '/scribe-editor'
        },
        {
            roles: ['Webmaster'],
            label: 'Admin',
            path: '/admin'
        },
        {
            roles: ['Webmaster'],
            label: 'User Management',
            path: '/admin/user-management'
        },
        {
            roles: ['Webmaster', 'Brotherhood Chair'],
            label: 'Manage Brodates',
            path: '/admin/bro-dates'
        },
        {
            roles: ['Webmaster', 'Brotherhood Chair'],
            label: 'Spoon Assassins',
            path: '/admin/spoon-assassins'
        }
    ];

    return (
        <div className="buttons-container">
            {buttons.map((button, index) => (
                button.roles.includes(user?.role) && (
                    <button
                        key={index}
                        className="rush-btn"
                        onClick={() => window.location.href = button.path}
                    >
                        {button.label}
                    </button>
                )
            ))}
        </div>
    );
};

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [points, setPoints] = useState(0);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [broDateGroup, setBroDateGroup] = useState([]);
    const [target, setTarget] = useState(null);

    // Fetch user data and related information
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                try {
                    const userQuery = query(
                        collection(firestore, 'users'),
                        where('email', '==', currentUser.email)
                    );
                    const userSnapshot = await getDocs(userQuery);

                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();
                        const profilePicUrl = await getProfilePictureUrl(userData, currentUser);

                        // Fetch BroDate group
                        const broDatesSnapshot = await getDocs(collection(firestore, 'brodates'));
                        const broDates = broDatesSnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        const userGroup = broDates.find((group) =>
                            group.members.some(
                                (member) => member.email === currentUser.email
                            )
                        );

                        // Set user data
                        setUser({
                            ...userData,
                            id: userSnapshot.docs[0].id,
                            profilePictureUrl: profilePicUrl
                        });
                        setPoints(userData.points || 0);
                        setBroDateGroup(userGroup ? userGroup.members : []);

                        // Fetch target data
                        await fetchTargetData(userSnapshot.docs[0].id);
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

    // Fetch Google Calendar events
    useEffect(() => {
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

    // Helper function to fetch target data
    const fetchTargetData = async (userId) => {
        const targetDocRef = doc(firestore, 'targets', userId);
        const targetDoc = await getDoc(targetDocRef);
        
        if (targetDoc.exists()) {
            let currentTarget = targetDoc.data();
            
            if (currentTarget.isEliminated) {
                setTarget({ isEliminated: true });
            } else {
                let visited = new Set();
                const userTargetDoc = await getDoc(doc(firestore, 'targets', currentTarget.targetId));
                
                if (userTargetDoc.exists()) {
                    let nextTarget = userTargetDoc.data();
                    
                    while (nextTarget && nextTarget.isEliminated && !visited.has(nextTarget.targetId)) {
                        visited.add(nextTarget.targetId);
                        const nextTargetDoc = await getDoc(doc(firestore, 'targets', nextTarget.targetId));
                        if (nextTargetDoc.exists()) {
                            nextTarget = nextTargetDoc.data();
                        } else {
                            nextTarget = null;
                            break;
                        }
                    }
                    
                    currentTarget.targetName = nextTarget ? `${nextTarget.firstName} ${nextTarget.lastName}` : 'No target assigned';
                    currentTarget.targetId = nextTarget ? nextTarget.userId : null;
                }
                
                setTarget(currentTarget);
            }
        } else {
            console.warn('User target not found in targets collection.');
            setTarget(null);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <p>User is not logged in.</p>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <UserInfo user={user} onEditClick={() => setIsEditPopupOpen(true)} />
            </div>

            <div className="widgets">
                <SpoonAssassinCard target={target} />
            </div>

            <div className="widgets">
                <PointsCard points={points} />
                <CalendarCard events={events} />
            </div>

            <div className="widgets">
                <BroDateCard broDateGroup={broDateGroup} />
            </div>

            {isEditPopupOpen && (
                <EditUserPopup 
                    user={user} 
                    onClose={() => setIsEditPopupOpen(false)} 
                />
            )}

            <AdminButtons user={user} />
        </div>
    );
};

export default Dashboard;