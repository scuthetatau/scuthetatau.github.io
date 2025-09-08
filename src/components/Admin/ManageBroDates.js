import React, {useEffect, useState} from 'react';
import {fetchGroups, shuffleGroups} from './groupService';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
import {checkUserRole} from './auth'; // Import checkUserRole function

const ManageBroDates = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        // Verify authentication and role
        const unsubscribe = checkUserRole(navigate, 'bro-dates'); // Check user role and redirect if unauthorized
        return () => unsubscribe && unsubscribe(); // Clean up on unmount
    }, [navigate]);

    useEffect(() => {
        const fetchAllGroups = async () => {
            try {
                const groupsList = await fetchGroups();
                setGroups(groupsList);
            } catch (err) {
                console.error('Failed to fetch brodate groups:', err);
                setError('Failed to fetch brodate groups.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllGroups();
    }, []);

    const handleShuffleGroups = async () => {
        try {
            setLoading(true); // Show loading indicator during reshuffle
            const shuffledGroups = await shuffleGroups();
            setGroups(shuffledGroups);
        } catch (err) {
            console.error('Failed to reshuffle brodate groups:', err);
            setError('Failed to reshuffle brodate groups.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading brodate groups...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="admin-page">
            <h1>Bro Dates</h1>
            <button className="rush-btn" onClick={handleShuffleGroups}>Create/Reshuffle Groups</button>
            <div className="groups-container">
                {groups.length > 0 ? (
                    groups.map((group, index) => (
                        <div key={index} className="group brodate-group">
                            <h3>Group {index + 1}</h3>
                            <ul>
                                {group.members.map((member) => (
                                    <li key={member.id}>{`${member.firstName} ${member.lastName}`}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No BroDate group found.</p>
                )}
            </div>
        </div>
    );
};

export default ManageBroDates;