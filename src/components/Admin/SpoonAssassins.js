import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { checkUserRole } from './auth';
import { FaArrowRight } from 'react-icons/fa'; // Import arrow icon
import './Admin.css';

// Add a new CSS for SpoonAssassins specifically
const styles = {
    assassinChain: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        margin: '20px 0',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    chainItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '15px',
    },
    personBox: {
        padding: '15px',
        backgroundColor: '#f4f4f8',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        width: '200px',
        textAlign: 'center',
        border: '2px solid #800000', // Theta Tau maroon color
    },
    arrow: {
        fontSize: '24px',
        color: '#800000', // Theta Tau maroon color
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
    noTargets: {
        textAlign: 'center',
        margin: '20px 0',
        padding: '20px',
        backgroundColor: '#f8f8f8',
        borderRadius: '8px',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
    chainContainer: {
        overflowX: 'auto',
        padding: '10px',
    }
};

const SpoonAssassins = () => {
    const [users, setUsers] = useState([]);
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                setTargets(targetsList);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to assign new targets (reshuffle)
    const assignTargets = async () => {
        if (!users.length) {
            alert('No users found to assign targets!');
            return;
        }

        setLoading(true);
        try {
            const shuffledUsers = [...users];
            for (let i = shuffledUsers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledUsers[i], shuffledUsers[j]] = [shuffledUsers[j], shuffledUsers[i]];
            }

            const newTargets = shuffledUsers.map((user, index) => ({
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                targetId: shuffledUsers[(index + 1) % shuffledUsers.length].id,
                targetName: `${shuffledUsers[(index + 1) % shuffledUsers.length].firstName} ${shuffledUsers[(index + 1) % shuffledUsers.length].lastName}`,
            }));

            await Promise.all(
                newTargets.map((target) =>
                    setDoc(doc(firestore, 'targets', target.userId), target)
                )
            );

            setTargets(newTargets);
            alert('Targets have been assigned successfully!');
        } catch (error) {
            console.error('Error assigning targets:', error);
            alert('Failed to assign targets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to organize targets in order
    const organizeChain = () => {
        if (!targets.length) return [];

        const chain = [];
        const targetMap = {};

        // Create a map for quick lookup
        targets.forEach(target => {
            targetMap[target.userId] = target;
        });

        // Find a starting point
        let current = targets[0];
        let count = 0;
        const maxCount = targets.length;

        // Build the chain
        while (count < maxCount) {
            chain.push(current);
            current = targetMap[current.targetId];
            count++;

            // Break if we've completed the circle or something went wrong
            if (!current || chain.includes(current)) break;
        }

        return chain;
    };

    const chainedTargets = organizeChain();

    return (
        <div className="admin-page">
            <h2>Spoon Assassins</h2>
            <p>Assign targets for brothers to "assassinate" with spoons</p>

            <button
                className="rush-btn"
                onClick={assignTargets}
                disabled={loading}
                style={{ marginBottom: '20px' }}
            >
                {loading ? 'ASSIGNING...' : 'ASSIGN NEW TARGETS'}
            </button>

            {loading && <div style={styles.spinner}></div>}

            {!loading && targets.length === 0 ? (
                <div style={styles.noTargets}>
                    <p>No assassination targets have been assigned yet.</p>
                    <p>Click the button above to assign targets.</p>
                </div>
            ) : (
                <div style={styles.chainContainer}>
                    <div style={styles.assassinChain}>
                        {chainedTargets.map((target, index) => (
                            <div style={styles.chainItem} key={target.userId}>
                                <div style={styles.personBox}>
                                    <strong>{target.firstName} {target.lastName}</strong>
                                </div>
                                <div style={styles.arrow}>
                                    <FaArrowRight />
                                </div>
                                <div style={styles.personBox}>
                                    <strong>{target.targetName}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && targets.length > 0 && (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    {targets.length} brothers are participating in Spoon Assassins
                </p>
            )}
        </div>
    );
};

export default SpoonAssassins;