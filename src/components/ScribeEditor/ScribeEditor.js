import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, getDocs, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { checkUserRole } from '../Admin/auth';
import './ScribeEditor.css';

const ScribeEditor = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventPoints, setEventPoints] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [newEventName, setNewEventName] = useState("");
    const [newEventQuarter, setNewEventQuarter] = useState("");
    const [expandedQuarters, setExpandedQuarters] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = checkUserRole(navigate, 'scribe-editor');
        return () => {
            unsub();
        };
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersSnapshot = await getDocs(collection(firestore, 'users'));
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);

                // Fetch events
                const eventsSnapshot = await getDocs(collection(firestore, 'events'));
                const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(eventsList);

                // Fetch event points
                const pointsSnapshot = await getDocs(collection(firestore, 'eventPoints'));
                const pointsData = {};
                pointsSnapshot.docs.forEach(doc => {
                    pointsData[doc.id] = doc.data();
                });
                setEventPoints(pointsData);
            } catch (error) {
                console.error("Error fetching data: ", error);
                alert("Error fetching data. If you are a Scribe, you may need to log out and log back in to sync your permissions.");
            }
        };
        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users
        .filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const lastA = (a.lastName || '').toLowerCase();
            const lastB = (b.lastName || '').toLowerCase();
            if (lastA < lastB) return -1;
            if (lastA > lastB) return 1;

            // Tiebreaker: first name
            const firstA = (a.firstName || '').toLowerCase();
            const firstB = (b.firstName || '').toLowerCase();
            if (firstA < firstB) return -1;
            if (firstA > firstB) return 1;
            return 0;
        });

    const handleCellEdit = (userId, eventId, value) => {
        setEventPoints(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [eventId]: value === '' ? 0 : parseInt(value) || 0
            }
        }));
    };

    const calculateTotalPoints = (userId) => {
        const userPoints = eventPoints[userId] || {};
        return Object.values(userPoints).reduce((sum, points) => sum + (points || 0), 0);
    };

    const handleSave = async () => {
        try {
            console.log("Starting save process...");
            // Update event points
            const pointUpdates = Object.entries(eventPoints).map(([userId, points]) =>
                setDoc(doc(firestore, 'eventPoints', userId), points)
            );
            await Promise.all(pointUpdates);
            console.log("Event points updated");

            // Update user total points
            const userUpdates = users.map(user => {
                const totalPoints = calculateTotalPoints(user.id);
                return updateDoc(doc(firestore, 'users', user.id), { points: totalPoints });
            });
            await Promise.all(userUpdates);
            console.log("User points updated");

            alert('Changes saved successfully!');
        } catch (error) {
            console.error("Error saving changes: ", error);
            alert(`Error saving changes: ${error.message || 'Unknown error'}. Please check your permissions.`);
        }
    };

    const handleAddEvent = async () => {
        if (!newEventName.trim() || !newEventQuarter.trim()) {
            alert("Please enter both an event name and a quarter (e.g., 'Spring 25')");
            return;
        }

        try {
            console.log("Adding new event:", newEventName);
            const newEventRef = doc(collection(firestore, 'events'));
            const newEvent = {
                id: newEventRef.id,
                name: newEventName.trim(),
                quarter: newEventQuarter.trim(),
                date: new Date().toISOString()
            };

            await setDoc(newEventRef, newEvent);
            setEvents(prev => [...prev, newEvent]);
            setNewEventName("");
            console.log("Event added successfully with ID:", newEventRef.id);
        } catch (error) {
            console.error("Error adding event: ", error);
            alert(`Error adding event: ${error.message || 'Unknown error'}. You may not have permission to add events.`);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            // Close modal immediately to provide snappy feedback
            setShowDeleteConfirm(false);
            setEventToDelete(null);

            // Delete the event
            await deleteDoc(doc(firestore, 'events', eventId));

            // Remove the event from the events state
            setEvents(events.filter(event => event.id !== eventId));

            // Remove the event points from all users
            const updatedEventPoints = {};
            for (const [userId, points] of Object.entries(eventPoints)) {
                const { [eventId]: removed, ...remainingPoints } = points;
                updatedEventPoints[userId] = remainingPoints;
            }
            setEventPoints(updatedEventPoints);

            // Update Firebase with the new points
            for (const [userId, points] of Object.entries(updatedEventPoints)) {
                await setDoc(doc(firestore, 'eventPoints', userId), points);
            }

            setShowDeleteConfirm(false);
            setEventToDelete(null);
        } catch (error) {
            console.error("Error deleting event: ", error);
            alert('Error deleting event. Please try again.');
        }
    };

    const confirmDelete = (event) => {
        setEventToDelete(event);
        setShowDeleteConfirm(true);
    };

    const handleReset = async () => {
        try {
            // Delete all events
            for (const event of events) {
                await deleteDoc(doc(firestore, 'events', event.id));
            }

            // Delete all event points
            for (const userId of Object.keys(eventPoints)) {
                await deleteDoc(doc(firestore, 'eventPoints', userId));
            }

            // Reset user points to 0
            for (const user of users) {
                await updateDoc(doc(firestore, 'users', user.id), { points: 0 });
            }

            // Reset local state
            setEvents([]);
            setEventPoints({});

            setShowResetConfirm(false);
            alert('All data has been reset successfully!');
        } catch (error) {
            console.error("Error resetting data: ", error);
            alert('Error resetting data. Please try again.');
        }
    };

    const toggleQuarter = (quarter) => {
        setExpandedQuarters(prev => ({
            ...prev,
            [quarter]: !prev[quarter]
        }));
    };

    const groupedEvents = events.reduce((groups, event) => {
        const quarter = event.quarter || 'Other';
        if (!groups[quarter]) {
            groups[quarter] = [];
        }
        groups[quarter].push(event);
        return groups;
    }, {});

    // Sort quarters (e.g., Fall 24, Spring 25, Fall 25)
    const sortedQuarters = Object.keys(groupedEvents).sort((a, b) => {
        const parseQuarter = (q) => {
            const [season, year] = q.split(' ');
            const seasonScore = season === 'Spring' ? 0 : (season === 'Fall' ? 1 : 2);
            return parseInt(year) * 10 + seasonScore;
        };
        return parseQuarter(a) - parseQuarter(b);
    });

    return (
        <div className="scribe-editor-page">
            <header className="scribe-header">
                <h1>Scribe Editor</h1>
            </header>

            <div className="scribe-container">
                <div className="controls-grid">
                    {/* Search Card */}
                    <div className="control-card">
                        <h3>Search Brothers</h3>
                        <div className="input-row">
                            <input
                                type="text"
                                placeholder="Filter by name..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {/* Add Event Card */}
                    <div className="control-card">
                        <h3>Quick Add Event</h3>
                        <div className="input-row">
                            <input
                                type="text"
                                placeholder="Event Name"
                                value={newEventName}
                                onChange={(e) => setNewEventName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Quarter"
                                value={newEventQuarter}
                                onChange={(e) => setNewEventQuarter(e.target.value)}
                                style={{ width: '120px' }}
                            />
                            <button className="scribe-btn scribe-btn-primary" onClick={handleAddEvent}>
                                <span className="material-icons-outlined">add</span>
                            </button>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="control-card">
                        <h3>Editor Actions</h3>
                        <div className="input-row">
                            <button className="scribe-btn scribe-btn-primary" style={{ flex: 2 }} onClick={handleSave}>
                                <span className="material-icons-outlined">save</span>
                                Save Changes
                            </button>
                            <button className="scribe-btn scribe-btn-danger" style={{ flex: 1 }} onClick={() => setShowResetConfirm(true)}>
                                <span className="material-icons-outlined">restart_alt</span>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div className="spreadsheet-section">
                    <div className="table-wrapper">
                        <table className="spreadsheet">
                            <thead>
                                <tr>
                                    <th rowSpan="2">Brother Name</th>
                                    {sortedQuarters.map(quarter => (
                                        <th
                                            key={quarter}
                                            colSpan={expandedQuarters[quarter] ? groupedEvents[quarter].length + 1 : 1}
                                            className="quarter-header-cell"
                                            onClick={() => toggleQuarter(quarter)}
                                        >
                                            {quarter} {expandedQuarters[quarter] ? '▼' : '▶'}
                                        </th>
                                    ))}
                                    <th rowSpan="2" className="final-total-cell">Total Points</th>
                                </tr>
                                <tr>
                                    {sortedQuarters.map(quarter => (
                                        <React.Fragment key={`${quarter}-sub`}>
                                            {expandedQuarters[quarter] ? (
                                                <>
                                                    {groupedEvents[quarter].map(event => (
                                                        <th key={event.id} className="sub-header-cell">
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                {event.name}
                                                                <button
                                                                    className="delete-event-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        confirmDelete(event);
                                                                    }}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        </th>
                                                    ))}
                                                    <th className="sub-header-cell">Total</th>
                                                </>
                                            ) : (
                                                <th className="sub-header-cell">Total</th>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.firstName} {user.lastName}</td>
                                        {sortedQuarters.map(quarter => {
                                            const quarterEvents = groupedEvents[quarter];
                                            const quarterTotal = quarterEvents.reduce((sum, event) =>
                                                sum + (eventPoints[user.id]?.[event.id] || 0), 0);

                                            return (
                                                <React.Fragment key={`${user.id}-${quarter}`}>
                                                    {expandedQuarters[quarter] ? (
                                                        <>
                                                            {quarterEvents.map(event => (
                                                                <td key={event.id}>
                                                                    <input
                                                                        type="number"
                                                                        className="point-input"
                                                                        value={eventPoints[user.id]?.[event.id] || ''}
                                                                        onChange={(e) => handleCellEdit(user.id, event.id, e.target.value)}
                                                                        min="0"
                                                                    />
                                                                </td>
                                                            ))}
                                                            <td className="quarter-total-cell">{quarterTotal}</td>
                                                        </>
                                                    ) : (
                                                        <td className="quarter-total-cell">{quarterTotal}</td>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                        <td className="final-total-cell">
                                            {calculateTotalPoints(user.id)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete the event <strong>"{eventToDelete?.name}"</strong>? This will remove all associated points permanently.</p>
                        <div className="modal-actions">
                            <button className="scribe-btn scribe-btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="scribe-btn scribe-btn-primary" style={{ backgroundColor: '#dc3545' }} onClick={() => handleDeleteEvent(eventToDelete.id)}>Delete Event</button>
                        </div>
                    </div>
                </div>
            )}

            {showResetConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Danger Zone</h2>
                        <p>You are about to reset <strong>EVERYTHING</strong>. This will delete all events and clear all points for every brother. This action is irreversible.</p>
                        <div className="modal-actions">
                            <button className="scribe-btn scribe-btn-secondary" onClick={() => setShowResetConfirm(false)}>Abort Mission</button>
                            <button className="scribe-btn scribe-btn-primary" style={{ backgroundColor: '#dc3545' }} onClick={handleReset}>Reset All Data</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScribeEditor;

