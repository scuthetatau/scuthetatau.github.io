// src/components/dashboard/widgets/BroDateWidget.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BroDateWidget.css';

const BroDateWidget = () => {
    const [group, setGroup] = useState([]);
    const [lastSunday, setLastSunday] = useState('');

    useEffect(() => {
        const fetchBroDateGroup = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/brodate-group', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setGroup(response.data.group);
            } catch (error) {
                console.error('Error fetching BroDateWidget group:', error);
            }
        };

        fetchBroDateGroup();
    }, []);

    useEffect(() => {
        const getLastSunday = () => {
            const today = new Date();
            const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
            setLastSunday(lastSunday.toLocaleDateString());
        };

        getLastSunday();
    }, []);

    return (
        <div className="brodate-widget">
            <h2>BroDate Group - Week of {lastSunday}</h2>
            {group.length > 0 ? (
                <ul>
                    {group.map((member) => (
                        <li key={member.email}>{member.firstName} {member.lastName} ({member.email})</li>
                    ))}
                </ul>
            ) : (
                <p>No BroDate group assigned for this week.</p>
            )}
        </div>
    );
};

export default BroDateWidget;