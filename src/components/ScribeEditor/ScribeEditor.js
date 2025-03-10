import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { checkUserRoles } from './auth';
import './ScribeEditor.css'; // Import new CSS file

const ScribeEditor = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [newPoints, setNewPoints] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'ascending' });
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = checkUserRoles(['Webmaster', 'Scribe'], navigate);
        return () => {
            unsub();
        };
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(firestore, 'users'));
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };
        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (sortConfig.key === 'points') {
            return sortConfig.direction === 'ascending'
                ? a.points - b.points
                : b.points - a.points;
        } else {
            return sortConfig.direction === 'ascending'
                ? a.lastName.localeCompare(b.lastName)
                : b.lastName.localeCompare(a.lastName);
        }
    });

    const filteredUsers = sortedUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePointsUpdate = async (userId, updateType) => {
        const userRef = doc(firestore, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            let updatedPoints = userData.points;

            if (updateType === 'add') {
                updatedPoints += 50;
            } else if (updateType === 'remove') {
                updatedPoints -= 50;
            }

            try {
                await updateDoc(userRef, { points: updatedPoints });
                setUsers(users.map(user => user.id === userId ? { ...user, points: updatedPoints } : user));
            } catch (error) {
                console.error("Error updating points: ", error);
            }
        }
    };

    const handleSetPoints = async (userId) => {
        const userRef = doc(firestore, 'users', userId);
        const newPointsValue = newPoints[userId];
        if (newPointsValue !== undefined && !isNaN(newPointsValue)) {
            try {
                await updateDoc(userRef, { points: parseInt(newPointsValue) });
                setUsers(users.map(user => user.id === userId ? { ...user, points: parseInt(newPointsValue) } : user));
                setEditingUserId(null);
            } catch (error) {
                console.error("Error setting points: ", error);
            }
        }
    };

    const handlePointsInputChange = (userId, value) => {
        setNewPoints({ ...newPoints, [userId]: value });
    };

    const handleKeyPress = (event, userId) => {
        if (event.key === 'Enter') {
            handleSetPoints(userId);
        }
    };

    const getPointsIndicator = (points) => {
        return points > 2500 ? '✅' : '❌';
    };

    return (
        <div className="admin-page">
            <h1>Scribe Editor</h1>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />
            <table className="users-table">
                <thead>
                <tr>
                    <th onClick={() => handleSort('lastName')}>
                        Name {sortConfig.key === 'lastName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                    </th>
                    <th onClick={() => handleSort('points')}>
                        Points {sortConfig.key === 'points' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                    </th>
                    <th>Reached 2500</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map(user => (
                    <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td className="points-value">
                            {editingUserId === user.id ? (
                                <input
                                    type="number"
                                    value={newPoints[user.id] || user.points}
                                    onChange={(e) => handlePointsInputChange(user.id, e.target.value)}
                                    onBlur={() => handleSetPoints(user.id)}
                                    onKeyPress={(e) => handleKeyPress(e, user.id)}
                                    autoFocus
                                />
                            ) : (
                                <span onClick={() => setEditingUserId(user.id)}>
                                        {user.points}
                                    </span>
                            )}
                        </td>
                        <td>{getPointsIndicator(user.points)}</td>
                        <td className="points-actions">
                            <button className="adjust-button" onClick={() => handlePointsUpdate(user.id, 'remove')}>-</button>
                            <button className="adjust-button" onClick={() => handlePointsUpdate(user.id, 'add')}>+</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScribeEditor;
