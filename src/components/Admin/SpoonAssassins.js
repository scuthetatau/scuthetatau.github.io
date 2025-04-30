import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc, addDoc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { checkUserRole } from './auth';
import { FaArrowRight, FaPlus, FaMinus, FaSave } from 'react-icons/fa';
import './Admin.css';

const styles = {
    container: {
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
    },
    builderSection: {
        backgroundColor: '#f4f4f8',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    currentAssignmentsSection: {
        backgroundColor: '#f4f4f8',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    userSelect: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        minWidth: '200px',
    },
    builderRow: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
        gap: '15px',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        color: '#800000',
    },
    assignmentTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
    },
    tableHeader: {
        backgroundColor: '#800000',
        color: 'white',
        textAlign: 'left',
        padding: '10px',
    },
    tableCell: {
        border: '1px solid #ddd',
        padding: '8px',
    },
    spinner: {
        display: 'block',
        margin: '20px auto',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderLeftColor: '#800000',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        animation: 'spin 1s linear infinite',
    },
    chainItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    personBox: {
        padding: '7px',
        backgroundColor: '#f4f4f8',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        width: '200px',
        textAlign: 'center',
        border: '2px solid #800000',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    eliminatedPersonBox: {
        padding: '7px',
        backgroundColor: '#ffadad',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        width: '200px',
        textAlign: 'center',
        border: '2px solid #800000',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    arrow: {
        margin: '10px 0',
        fontSize: '24px',
        color: '#800000',
        transform: 'rotate(90deg)',
    },
    builderContainer: {
        marginTop: '20px',
    },
    warningText: {
        color: 'red',
        marginBottom: '10px',
    },
    successText: {
        color: 'green',
        marginBottom: '10px',
    }
};

const SpoonAssassins = () => {
    const [users, setUsers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [eliminatedUsers, setEliminatedUsers] = useState([]);
    const navigate = useNavigate();

    // New state for the builder
    const [chain, setChain] = useState([{ userId: '', targetId: '' }]);

    useEffect(() => {
        // Verify authentication and role
        const unsubscribe = checkUserRole(navigate);
        return () => unsubscribe && unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch users for assigning targets
                const usersSnapshot = await getDocs(collection(firestore, 'users'));
                const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);

                // Fetch current Spoon Assassins targets
                const targetsSnapshot = await getDocs(collection(firestore, 'targets'));
                const targetsList = targetsSnapshot.docs.map((doc) => doc.data());
                setAssignments(targetsList);

                // Fetch eliminated users
                const eliminationsSnapshot = await getDocs(collection(firestore, 'eliminated'));
                const eliminatedUserIds = eliminationsSnapshot.docs.map(doc => doc.data().userId);
                setEliminatedUsers(eliminatedUserIds);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error loading data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatUserName = (user) => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        } else if (user?.displayName) {
            return user.displayName;
        } else {
            return 'Unknown';
        }
    };

    const getUserById = (userId) => {
        return users.find(user => user.id === userId);
    };

    // Add a new player to the chain
    const addPlayerToChain = () => {
        setChain([...chain, { userId: '', targetId: '' }]);
    };

    // Remove a player from the chain
    const removePlayerFromChain = (index) => {
        const newChain = [...chain];
        newChain.splice(index, 1);
        setChain(newChain);
    };

    // Update the player in the chain
    const updatePlayerInChain = (index, userId) => {
        const newChain = [...chain];
        newChain[index].userId = userId;
        setChain(newChain);
    };

    // Auto-connect targets when a user is selected
    useEffect(() => {
        if (chain.length > 0) {
            const newChain = [...chain];

            for (let i = 0; i < newChain.length; i++) {
                // If this is not the last item, set target to the next person
                if (i < newChain.length - 1) {
                    newChain[i].targetId = newChain[i + 1].userId;
                } else {
                    // The last person targets the first person to complete the loop
                    newChain[i].targetId = newChain[0].userId;
                }
            }

            setChain(newChain);
        }
    }, [chain.map(item => item.userId).join(',')]);

    // Check if the chain is valid for saving
    const isValidChain = () => {
        // Check if any user appears more than once
        const userIds = chain.map(item => item.userId).filter(id => id !== '');
        const uniqueUserIds = new Set(userIds);

        if (userIds.length === 0) return false;
        if (uniqueUserIds.size !== userIds.length) return false;

        // Make sure no empty selections
        return !chain.some(item => item.userId === '' || item.targetId === '');
    };

    // Toggle the elimination status of a user
    const toggleEliminationStatus = async (userId) => {
        try {
            const isCurrentlyEliminated = eliminatedUsers.includes(userId);
            
            if (!isCurrentlyEliminated) {
                // Mark as eliminated
                // Find who eliminated this user
                const eliminatedBy = assignments.find(a => a.targetId === userId);
                if (!eliminatedBy) {
                    setError('Could not determine who eliminated this user');
                    return;
                }

                // Create elimination record
                const eliminationData = {
                    userId: userId,
                    eliminatedBy: eliminatedBy.userId,
                    timestamp: new Date().toISOString()
                };

                // Add to eliminated collection
                await addDoc(collection(firestore, 'eliminated'), eliminationData);
                
                // Update local state
                setEliminatedUsers([...eliminatedUsers, userId]);
            } else {
                // Remove elimination
                // Find the elimination document
                const eliminationsSnapshot = await getDocs(
                    query(collection(firestore, 'eliminated'), 
                    where('userId', '==', userId))
                );
                
                // Delete the elimination document
                if (!eliminationsSnapshot.empty) {
                    const eliminationDoc = eliminationsSnapshot.docs[0];
                    await deleteDoc(doc(firestore, 'eliminated', eliminationDoc.id));
                }
                
                // Update local state
                setEliminatedUsers(eliminatedUsers.filter(id => id !== userId));
            }

            setSuccess(`User elimination status updated successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error updating elimination status:', error);
            setError('Failed to update elimination status. Please try again.');
        }
    };

    // Save the assignments to Firestore
    const saveAssignments = async () => {
        if (!isValidChain()) {
            setError('Cannot save. Please make sure all players are selected and no player appears more than once.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Delete all current assignments
            const promises = [];
            for (const assignment of assignments) {
                promises.push(deleteDoc(doc(firestore, 'targets', assignment.userId)));
            }
            await Promise.all(promises);

            // Create new assignments
            const newAssignments = [];
            for (const item of chain) {
                const user = getUserById(item.userId);
                const target = getUserById(item.targetId);

                if (user && target) {
                    const assignment = {
                        userId: user.id,
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        targetId: target.id,
                        targetName: `${target.firstName || ''} ${target.lastName || ''}`,
                    };

                    await setDoc(doc(firestore, 'targets', user.id), assignment);
                    newAssignments.push(assignment);
                }
            }

            setAssignments(newAssignments);
            setSuccess('Assignments saved successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error saving assignments:', error);
            setError('Failed to save assignments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Create an ordered chain for display, following the target links for proper circle
    const getOrderedChain = () => {
        if (assignments.length === 0) return [];
        const map = new Map();
        assignments.forEach(a => map.set(a.userId, a));
        // Find a start (any user who isn't someone else's target, or just the first assignment)
        let start = assignments[0].userId;
        let visited = new Set();
        const ordered = [];
        let current = start;
        while (map.has(current) && !visited.has(current)) {
            visited.add(current);
            const entry = map.get(current);
            ordered.push(entry);
            current = entry.targetId;
        }
        return ordered;
    };

    const orderedChain = getOrderedChain();

    return (
        <div className="admin-page">
            <h2>Spoon Assassins</h2>
            <p>Build a chain of targets for the Spoon Assassins game</p>

            {loading && <div style={styles.spinner}></div>}

            {!loading && (
                <div style={styles.container}>
                    {/* Builder Section */}
                    <div style={styles.builderSection}>
                        <h3>Target Builder</h3>
                        <p>Add players and arrange them in the order you want. Each player will target the next person in the chain.</p>

                        {error && <div style={styles.warningText}>{error}</div>}
                        {success && <div style={styles.successText}>{success}</div>}

                        <div style={styles.builderContainer}>
                            {chain.map((item, index) => (
                                <div key={index} style={styles.builderRow}>
                                    <select
                                        style={styles.userSelect}
                                        value={item.userId}
                                        onChange={(e) => updatePlayerInChain(index, e.target.value)}
                                    >
                                        <option value="">-- Select Player {index + 1} --</option>
                                        {users
                                            .filter(user =>
                                                // Show the user if they're not selected elsewhere or if they're the current selection
                                                !chain.some((chainItem, idx) =>
                                                    idx !== index &&
                                                    chainItem.userId === user.id
                                                ) ||
                                                user.id === item.userId
                                            )
                                            .map(user => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {formatUserName(user)}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    {index > 0 && (
                                        <button
                                            style={styles.iconButton}
                                            onClick={() => removePlayerFromChain(index)}
                                            title="Remove player"
                                        >
                                            <FaMinus />
                                        </button>
                                    )}

                                    {index === chain.length - 1 && (
                                        <button
                                            style={styles.iconButton}
                                            onClick={addPlayerToChain}
                                            title="Add player"
                                        >
                                            <FaPlus />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                className="rush-btn"
                                onClick={saveAssignments}
                                disabled={!isValidChain()}
                                style={{ marginTop: '20px' }}
                            >
                                <FaSave style={{ marginRight: '8px' }} />
                                SAVE ASSIGNMENTS
                            </button>
                        </div>
                    </div>

                    {/* Current Assignments Section */}
                    {assignments.length > 0 && (
                        <div style={styles.currentAssignmentsSection}>
                            <h3>Current Assignments</h3>
                            <p style={{ marginBottom: '15px' }}>
                                This table shows who is targeting whom in a tabular format.
                            </p>

                            <table style={styles.assignmentTable}>
                                <thead>
                                <tr>
                                    <th style={styles.tableHeader}>Assassin</th>
                                    <th style={styles.tableHeader}>Target</th>
                                </tr>
                                </thead>
                                <tbody>
                                {assignments.map((assignment) => (
                                    <tr key={assignment.userId}>
                                        <td style={styles.tableCell}>
                                            {assignment.firstName} {assignment.lastName}
                                        </td>
                                        <td style={styles.tableCell}>
                                            {assignment.targetName}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {assignments.length > 0 && (
                <div style={{
                    marginTop: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    // background: 'none',  <-- No longer needed, just here for clarity.
                }}>
                    <h3>Assassination Chain</h3>
                    <p style={{ marginBottom: '15px' }}>
                        This view shows all players in a single chain. Click on a player to mark them as eliminated.
                        Eliminated players will be highlighted in red.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '10px 0',
                            // backgroundColor: 'none', // Remove background
                            borderRadius: '0',
                            boxShadow: 'none',
                            padding: 0,
                        }}
                    >
                        {orderedChain.map((assignment, index) => {
                            const isEliminated = eliminatedUsers.includes(assignment.userId);
                            return (
                                <React.Fragment key={assignment.userId}>
                                    <div
                                        style={{
                                            ...(isEliminated ? styles.eliminatedPersonBox : styles.personBox),
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                        }}
                                        onClick={() => toggleEliminationStatus(assignment.userId)}
                                        title={isEliminated ? "Click to mark as active" : "Click to mark as eliminated"}
                                    >
                                        <strong>
                                            {assignment.firstName} {assignment.lastName}
                                        </strong>
                                    </div>
                                    {index < orderedChain.length - 1 && (
                                        <div style={styles.arrow}>
                                            <FaArrowRight />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpoonAssassins;

