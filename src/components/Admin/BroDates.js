import React, {useEffect, useState} from 'react';
import {fetchGroups, shuffleGroups} from './groupService';

const BroDates = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchAllGroups = async () => {
            const groupsList = await fetchGroups();
            setGroups(groupsList);
        };
        fetchAllGroups();
    }, []);

    const handleShuffleGroups = async () => {
        const shuffledGroups = await shuffleGroups();
        setGroups(shuffledGroups);
    };

    return (
        <div className="admin-page">
            <h1>Bro Dates</h1>
            <button className="rush-btn" onClick={handleShuffleGroups}>Create/Reshuffle Groups</button>
            <div className="groups-container">
                {groups.map((group, index) => (
                    <div key={index} className="group brodate-group">
                        <h3>Group {index + 1}</h3>
                        <ul>
                            {group.members.map((member) => (
                                <li key={member.id}>{`${member.firstName} ${member.lastName}`}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BroDates;