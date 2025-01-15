import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import './Admin.css';

const SpoonAssassins = () => {
    const [users, setUsers] = useState([]);
    const [targets, setTargets] = useState([]);

    useEffect(() => {
        // Fetch users for assigning targets
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(firestore, 'users'));
            const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };

        // Fetch current Spoon Assassins targets
        const fetchTargets = async () => {
            const targetsSnapshot = await getDocs(collection(firestore, 'targets'));
            const targetsList = targetsSnapshot.docs.map((doc) => doc.data());
            setTargets(targetsList);
        };

        fetchUsers();
        fetchTargets();
    }, []);

    // Function to assign new targets (reshuffle)
    const assignTargets = async () => {
        if (!users.length) return;

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

        setTargets(newTargets); // Update state with new targets
        alert('Targets have been assigned!');
    };

    return (
        <div className="admin-page">
            <h2>Spoon Assassins Targets</h2>
            <button className="rush-btn" onClick={assignTargets}>ASSIGN TARGETS</button>
            <div className="targets-container">
                {targets.map((target) => (
                    <div key={target.userId} className="target">
                        <strong>
                            {target.firstName} {target.lastName}
                        </strong>{' '}
                        has target: {target.targetName}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpoonAssassins;