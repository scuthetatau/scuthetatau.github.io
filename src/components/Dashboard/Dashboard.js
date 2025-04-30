import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
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
    const [eliminations, setEliminations] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                try {
                    const userQuery = query(
                        collection(firestore, 'users'),
                        where('email', '==', currentUser.email) // Match user by email
                    );
                    const userSnapshot = await getDocs(userQuery);

                    if (!userSnapshot.empty) { // User exists in Firestore
                        const userData = userSnapshot.docs[0].data();
                        let profilePicUrl = userData?.profilePictureUrl;

                        // Resolve profile picture URL
                        if (profilePicUrl && !profilePicUrl.startsWith('https://lh3.googleusercontent.com/')) {
                            try {
                                const fileRef = ref(storage, profilePicUrl);
                                profilePicUrl = await getDownloadURL(fileRef);
                            } catch (error) {
                                console.error(
                                    `Error getting profile picture URL for ${currentUser.email}:`,
                                    error
                                );
                            }
                        }

                        // Retrieve BroDate group associated with the user
                        const broDatesSnapshot = await getDocs(
                            collection(firestore, 'brodates')
                        );
                        const broDates = broDatesSnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        // Find the group that contains the current user
                        const userGroup = broDates.find((group) =>
                            group.members.some(
                                (member) => member.email === currentUser.email
                            )
                        );

                        setUser({
                            ...userData,
                            id: userSnapshot.docs[0].id, // Add Firestore document ID to the user object
                            profilePictureUrl:
                                profilePicUrl || currentUser.photoURL, // Default to Google photo if not available
                        });
                        setPoints(userData.points || 0);

                        if (userGroup) {
                            setBroDateGroup(userGroup.members); // Set the user's BroDate group
                        } else {
                            setBroDateGroup([]); // No group found
                        }

                        // Fetch the current user's target for Spoon Assassins
                        try {
                            const targetDocRef = doc(firestore, 'targets', userSnapshot.docs[0].id);
                            const targetDoc = await getDoc(targetDocRef);
                            
                            if (targetDoc.exists()) {
                                const targetData = targetDoc.data();
                                
                                // Check if the target is eliminated
                                try {
                                    // First check if the current user has eliminated someone
                                    const eliminationsSnapshot = await getDocs(
                                        query(collection(firestore, 'eliminated'),
                                        where('eliminatedBy', '==', userSnapshot.docs[0].id))
                                    );
                                    
                                    if (!eliminationsSnapshot.empty) {
                                        // User has eliminated someone, get their most recent elimination
                                        const latestElimination = eliminationsSnapshot.docs[0].data();
                                        
                                        // Get the eliminated user's target
                                        const eliminatedUserTargetDoc = await getDoc(doc(firestore, 'targets', latestElimination.userId));
                                        if (eliminatedUserTargetDoc.exists()) {
                                            const eliminatedTargetData = eliminatedUserTargetDoc.data();
                                            
                                            // Check if this target is also eliminated
                                            const targetEliminatedSnapshot = await getDocs(
                                                query(collection(firestore, 'eliminated'),
                                                where('userId', '==', eliminatedTargetData.targetId))
                                            );
                                            
                                            if (targetEliminatedSnapshot.empty) {
                                                // Target is active, use it
                                                setTarget({
                                                    ...eliminatedTargetData,
                                                    isNewTarget: true,
                                                    eliminatedPreviousTarget: true
                                                });
                                            } else {
                                                // Target is eliminated, get their target
                                                const nextTargetDoc = await getDoc(doc(firestore, 'targets', eliminatedTargetData.targetId));
                                                if (nextTargetDoc.exists()) {
                                                    const nextTargetData = nextTargetDoc.data();
                                                    setTarget({
                                                        ...nextTargetData,
                                                        isNewTarget: true,
                                                        eliminatedPreviousTarget: true,
                                                        eliminationChainLength: 1
                                                    });
                                                } else {
                                                    setTarget(targetData);
                                                }
                                            }
                                        } else {
                                            setTarget(targetData);
                                        }
                                    } else {
                                        // Check if current target is eliminated
                                        const targetEliminatedSnapshot = await getDocs(
                                            query(collection(firestore, 'eliminated'),
                                            where('userId', '==', targetData.targetId))
                                        );
                                        
                                        if (!targetEliminatedSnapshot.empty) {
                                            // Target is eliminated, get their target
                                            const eliminatedTargetDoc = await getDoc(doc(firestore, 'targets', targetData.targetId));
                                            if (eliminatedTargetDoc.exists()) {
                                                const eliminatedTargetData = eliminatedTargetDoc.data();
                                                
                                                // Check if this target is also eliminated
                                                const nextTargetEliminatedSnapshot = await getDocs(
                                                    query(collection(firestore, 'eliminated'),
                                                    where('userId', '==', eliminatedTargetData.targetId))
                                                );
                                                
                                                if (nextTargetEliminatedSnapshot.empty) {
                                                    // Target is active, use it
                                                    setTarget({
                                                        ...eliminatedTargetData,
                                                        isNewTarget: true,
                                                        targetWasEliminated: true
                                                    });
                                                } else {
                                                    // Target is eliminated, get their target
                                                    const nextTargetDoc = await getDoc(doc(firestore, 'targets', eliminatedTargetData.targetId));
                                                    if (nextTargetDoc.exists()) {
                                                        const nextTargetData = nextTargetDoc.data();
                                                        setTarget({
                                                            ...nextTargetData,
                                                            isNewTarget: true,
                                                            targetWasEliminated: true,
                                                            eliminationChainLength: 1
                                                        });
                                                    } else {
                                                        setTarget(targetData);
                                                    }
                                                }
                                            } else {
                                                setTarget(targetData);
                                            }
                                        } else {
                                            setTarget(targetData);
                                        }
                                    }
                                } catch (eliminatedError) {
                                    console.warn('Error checking eliminations:', eliminatedError);
                                    setTarget(targetData);
                                }
                            } else {
                                console.warn('User target not found in targets collection.');
                                setTarget(null);
                            }
                        } catch (targetError) {
                            console.warn('Error fetching target:', targetError);
                            setTarget(null);
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
                console.error(
                    'Error initializing Google API client or fetching events:',
                    error
                );
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

    const progressGoal = 2500;
    const progressPercentage = (points / progressGoal) * 100;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                {user ? (
                    <>
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
                        </div>
                        <AiOutlineEdit className="edit-icon" onClick={openEditPopup} />
                    </>
                ) : (
                    <p>User is not logged in.</p>
                )}
            </div>

            {/* Spoon Assassins widget */}
            <div className="widgets">
                <div className="card spoon-card">
                    <h2>Spoon Assassin</h2>
                    {target ? (
                        <>
                            <p>Your target: {target.targetName}</p>
                            {target.isNewTarget && (
                                <p className="new-target-notice">
                                    {target.eliminatedPreviousTarget 
                                        ? `New target assigned after your elimination!${target.eliminationChainLength > 1 ? ` (Chain of ${target.eliminationChainLength} eliminations)` : ''}`
                                        : target.targetWasEliminated
                                            ? `New target assigned because your previous target was eliminated!${target.eliminationChainLength > 1 ? ` (Chain of ${target.eliminationChainLength} eliminations)` : ''}`
                                            : "New target assigned!"}
                                </p>
                            )}
                        </>
                    ) : (
                        <p>No target assigned</p>
                    )}
                </div>
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
                    <p>
                        {points} / {progressGoal} Points
                    </p>
                </div>

                <div className="card calendar-card">
                    <h2>Upcoming Events</h2>
                    {events.length > 0 ? (
                        events.map((event, index) => {
                            let eventDate;

                            if (event.start.date && !event.start.dateTime) {
                                const dateParts = event.start.date.split('-');
                                const year = parseInt(dateParts[0], 10);
                                const month = parseInt(dateParts[1], 10) - 1;
                                const day = parseInt(dateParts[2], 10);

                                const localDate = new Date(year, month, day);
                                eventDate = localDate.toLocaleDateString();
                            } else {
                                eventDate = new Date(
                                    event.start.dateTime
                                ).toLocaleString();
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
                                <li key={index}>
                                    {member.firstName} {member.lastName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No BroDate group found.</p>
                    )}
                </div>
            </div>

            {isEditPopupOpen && (
                <EditUserPopup user={user} onClose={closeEditPopup} />
            )}

            <div>
                <div className="buttons-container">
                    {user &&
                        (user.role === 'Webmaster' || user.role === 'Scribe') && (
                            <button
                                className="rush-btn"
                                onClick={() =>
                                    (window.location.href = '/scribe-editor')
                                }
                            >
                                Go to Scribe Editor
                            </button>
                        )}
                    {user && user.role === 'Webmaster' && (
                        <button
                            className="rush-btn"
                            onClick={() => (window.location.href = '/admin')}
                        >
                            Admin
                        </button>
                    )}
                    {user && user.role === 'Webmaster' && (
                        <button
                            className="rush-btn"
                            onClick={() => (window.location.href = '/admin/user-management')}
                        >
                            User Management
                        </button>
                    )}
                    {user && (user.role === 'Webmaster' || user.role === 'Brotherhood Chair') && (
                        <button
                            className="rush-btn"
                            onClick={() =>
                                (window.location.href = '/admin/bro-dates')
                            }
                        >
                            Manage Brodates
                        </button>
                    )}
                    {user && (user.role === 'Webmaster' || user.role === 'Brotherhood Chair') && (
                        <button
                            className="rush-btn"
                            onClick={() =>
                                (window.location.href =
                                    '/admin/spoon-assassins')
                            }
                        >
                            Spoon Assassins
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;