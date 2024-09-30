import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BroDateGroups.css';

const BroDateGroups = () => {
    const [broDateGroups, setBroDateGroups] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchBroDateGroups(token);
        }
    }, []);

    const fetchBroDateGroups = async (token) => {
        try {
            const response = await axios.get('http://localhost:5001/api/brodate-groups-all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBroDateGroups(response.data.groups);
        } catch (error) {
            console.error('Error fetching BroDateWidget groups:', error);
        }
    };

    const handleReshuffleGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.get('http://localhost:5001/api/shuffle-groups', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Groups reshuffled successfully!');
            fetchBroDateGroups(token);
        } catch (error) {
            console.error('Error reshuffling groups:', error);
            alert('Failed to reshuffle groups.');
        }
    };

    const handleDownloadGroups = () => {
        const currentDateString = new Date().toLocaleDateString();
        const formattedGroups = broDateGroups.map((group, index) => {
            return `Group ${index + 1}:\n${group.map(user => `${user.firstName} ${user.lastName} (${user.email})`).join('\n')}\n`;
        }).join('\n');
        const blob = new Blob([formattedGroups], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Brodate Groups ${currentDateString}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2>BroDate Groups</h2>
            <div className="brodate-groups-container">
                {broDateGroups.map((group, index) => (
                    <div className="brodate-group-card" key={index}>
                        <div className="brodate-group-content">
                            <h2>Group {index + 1}</h2>
                            <ul>
                                {group.map(user => (
                                    <li key={user.email}>{user.firstName} {user.lastName} ({user.email})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button onClick={handleReshuffleGroups} className="reshuffle-button">
                    Reshuffle Groups
                </button>
                <button onClick={handleDownloadGroups} className="download-button">
                    Download .txt file
                </button>
            </div>
        </div>
    );
};

export default BroDateGroups;