import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, updateDoc, setDoc, query, where, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { checkUserRoles } from './auth';
import './ScribeEditor.css'; // Import new CSS file

const ScribeEditor = () => {
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventPoints, setEventPoints] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCell, setEditingCell] = useState(null);
    const [newEventName, setNewEventName] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = checkUserRoles(['Webmaster', 'Scribe'], navigate);
        return () => {
            unsub();
        };
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
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
        };
        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            // Update event points
            for (const [userId, points] of Object.entries(eventPoints)) {
                await setDoc(doc(firestore, 'eventPoints', userId), points);
            }

            // Update user total points
            for (const user of users) {
                const totalPoints = calculateTotalPoints(user.id);
                await updateDoc(doc(firestore, 'users', user.id), { points: totalPoints });
            }

            alert('Changes saved successfully!');
        } catch (error) {
            console.error("Error saving changes: ", error);
            alert('Error saving changes. Please try again.');
        }
    };

    const handleAddEvent = async () => {
        if (!newEventName.trim()) return;

        try {
            const newEventRef = doc(collection(firestore, 'events'));
            const newEvent = {
                id: newEventRef.id,
                name: newEventName.trim(),
                date: new Date().toISOString()
            };

            await setDoc(newEventRef, newEvent);
            setEvents([...events, newEvent]);
            setNewEventName("");
        } catch (error) {
            console.error("Error adding event: ", error);
            alert('Error adding event. Please try again.');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
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

    return (
        <div className="admin-page">
            <h1>Scribe Editor</h1>
            <div className="controls">
                <div className="admin-input-group">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />
                </div>
                <div className="admin-input-group add-event-group">
                    <input
                        type="text"
                        placeholder="New event name"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                    />
                    <button className="rush-btn" onClick={handleAddEvent}>Add Event</button>
                </div>
                <button className="rush-btn" onClick={handleSave}>Save All Changes</button>
            </div>
            <div className="spreadsheet-container">
                <table className="spreadsheet">
                    <thead>
                        <tr>
                            <th>Name</th>
                            {events.map(event => (
                                <th key={event.id}>
                                    {event.name}
                                    <button 
                                        className="close"
                                        onClick={() => confirmDelete(event)}
                                        style={{ marginLeft: '8px', padding: '2px 6px' }}
                                    >
                                        ×
                                    </button>
                                </th>
                            ))}
                            <th>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.firstName} {user.lastName}</td>
                                {events.map(event => (
                                    <td key={event.id}>
                                        <input
                                            type="number"
                                            value={eventPoints[user.id]?.[event.id] || ''}
                                            onChange={(e) => handleCellEdit(user.id, event.id, e.target.value)}
                                            min="0"
                                        />
                                    </td>
                                ))}
                                <td className="total-points">
                                    {calculateTotalPoints(user.id)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showDeleteConfirm && (
                <>
                    <div className="admin-edit-user-overlay" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="admin-edit-user">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete the event "{eventToDelete?.name}"? This will remove all points associated with this event.</p>
                        <div className="admin-buttons">
                            <button className="close" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="add" onClick={() => handleDeleteEvent(eventToDelete.id)}>Delete</button>
                        </div>
                    </div>
                </>
            )}

            {showResetConfirm && (
                <>
                    <div className="admin-edit-user-overlay" onClick={() => setShowResetConfirm(false)} />
                    <div className="admin-edit-user">
                        <h2>Confirm Reset</h2>
                        <p>Are you sure you want to reset everything? This will:</p>
                        <ul>
                            <li>Delete all events</li>
                            <li>Clear all event points</li>
                            <li>Reset all user points to zero</li>
                        </ul>
                        <p>This action cannot be undone!</p>
                        <p>This also may take up to a minute for this request to complete.</p>
                        <div className="admin-buttons">
                            <button className="close" onClick={() => setShowResetConfirm(false)}>CANCEL</button>
                            <button className="add" onClick={handleReset}>RESET EVERYTHING</button>
                        </div>
                    </div>
                </>
            )}

            <div className="reset-section">
                <button 
                    className="rush-btn reset-btn" 
                    onClick={() => setShowResetConfirm(true)}
                    style={{ marginTop: '20px', backgroundColor: '#dc3545' }}
                >
                    Reset Everything
                </button>
            </div>
        </div>
    );
};

export default ScribeEditor;
