import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
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
    const [chain, setChain] = useState([{ userId: '', targetId: '' }]);

    useEffect(() => {
        const unsubscribe = checkUserRole(navigate, 'spoon-assassins');
        return () => unsubscribe && unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersSnapshot = await getDocs(collection(firestore, 'users'));
                const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);

                const targetsSnapshot = await getDocs(collection(firestore, 'targets'));
                const targetsList = targetsSnapshot.docs.map((doc) => doc.data());
                setAssignments(targetsList);

                const eliminatedUsersList = targetsList
                    .filter(target => target.isEliminated)
                    .map(target => target.userId);
                setEliminatedUsers(eliminatedUsersList);

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
        }
        return 'Unknown';
    };

    const getUserById = (userId) => {
        return users.find(user => user.id === userId);
    };

    const addPlayerToChain = () => {
        setChain([...chain, { userId: '', targetId: '' }]);
    };

    const removePlayerFromChain = (index) => {
        const newChain = [...chain];
        newChain.splice(index, 1);
        setChain(newChain);
    };

    const updatePlayerInChain = (index, userId) => {
        const newChain = [...chain];
        newChain[index].userId = userId;
        setChain(newChain);
    };

    useEffect(() => {
        if (chain.length > 0) {
            const newChain = [...chain];
            for (let i = 0; i < newChain.length; i++) {
                if (i < newChain.length - 1) {
                    newChain[i].targetId = newChain[i + 1].userId;
                } else {
                    newChain[i].targetId = newChain[0].userId;
                }
            }
            setChain(newChain);
        }
    }, [chain.map(item => item.userId).join(',')]);

    const isValidChain = () => {
        const userIds = chain.map(item => item.userId).filter(id => id !== '');
        const uniqueUserIds = new Set(userIds);
        if (userIds.length === 0) return false;
        if (uniqueUserIds.size !== userIds.length) return false;
        return !chain.some(item => item.userId === '' || item.targetId === '');
    };

    const toggleEliminationStatus = async (userId) => {
        try {
            const newEliminatedUsers = [...eliminatedUsers];
            const index = newEliminatedUsers.indexOf(userId);
            const isEliminated = index === -1;

            const targetRef = doc(firestore, 'targets', userId);
            await setDoc(targetRef, { isEliminated }, { merge: true });

            if (isEliminated) {
                newEliminatedUsers.push(userId);
            } else {
                newEliminatedUsers.splice(index, 1);
            }
            setEliminatedUsers(newEliminatedUsers);

            setSuccess(`User elimination status updated successfully!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error updating elimination status:', error);
            setError('Failed to update elimination status. Please try again.');
        }
    };

    const saveAssignments = async () => {
        if (!isValidChain()) {
            setError('Cannot save. Please make sure all players are selected and no player appears more than once.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const promises = assignments.map(assignment => 
                deleteDoc(doc(firestore, 'targets', assignment.userId))
            );
            await Promise.all(promises);

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
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error saving assignments:', error);
            setError('Failed to save assignments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getOrderedChain = () => {
        if (assignments.length === 0) return [];
        const map = new Map();
        assignments.forEach(a => map.set(a.userId, a));
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
                    <div style={styles.builderSection}>
                        <h3>Target Builder</h3>
                        <p>Add players and arrange them in the order you want. Each player will target the next person in the chain.</p>

                        {error && <div style={styles.warningText}>{error}</div>}
                        {success && <div style={styles.successText}>{success}</div>}

                        <div>
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
                </div>
            )}

            {assignments.length > 0 && (
                <div style={{
                    marginTop: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <h3>Assassination Chain</h3>
                    <p style={{ marginBottom: '15px' }}>
                        This view shows all players in a single chain. Click on a player to mark them as eliminated.
                        Eliminated players will be highlighted in red.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px 0',
                    }}>
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
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            margin: '10px 0',
                                        }}>
                                            <FaArrowRight style={{ fontSize: 32, color: '#800000', transform: 'rotate(90deg)' }} />
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

