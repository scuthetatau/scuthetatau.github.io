import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CoatArms from '../assets/CoatArms.png';
import './MeetTheBrothers.css';

const MeetTheBrothers = () => {
    const [users, setUsers] = useState([]);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/meet_the_brothers');
                console.log('Fetched users:', response.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const groupedUsers = users.reduce((groups, user) => {
        const classGroup = user.class || 'Unknown Class';
        if (!groups[classGroup]) {
            groups[classGroup] = [];
        }
        groups[classGroup].push(user);
        return groups;
    }, {});

    // Sort leadership users to ensure Regent and Vice Regent appear first
    const leadershipUsers = users.filter(user => user.role).sort((a, b) => {
        const roleOrder = ['Regent', 'Vice Regent'];
        const indexA = roleOrder.indexOf(a.role);
        const indexB = roleOrder.indexOf(b.role);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <div className="meet-the-brothers-component">
            <h1>Meet the Brothers</h1>
            <img src={CoatArms} alt="CoatArms" className="meet-the-brothers-coat-arms"/>

            {leadershipUsers.length > 0 && (
                <div className="meet-the-brothers-leadership-section">
                    <h2>{currentYear} Leadership</h2>
                    <div className="meet-the-brothers-leadership-grid">
                        {leadershipUsers.map(user => (
                            <div key={user.email} className="meet-the-brothers-leadership-profile">
                                {user.profilePic && (
                                    <img
                                        src={`http://localhost:5001/${user.profilePic}`}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="meet-the-brothers-leadership-profile-pic"
                                        onError={(e) => console.error(`Failed to load image: http://localhost:5001/${user.profilePic}`)}
                                    />
                                )}
                                <p className="meet-the-brothers-leadership-name">{user.firstName} {user.lastName}</p>
                                <p className="meet-the-brothers-leadership-role">{user.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {Object.keys(groupedUsers).map(classGroup => (
                <div key={classGroup} className="meet-the-brothers-class-group">
                    <h2>{classGroup} Class</h2>
                    <div className="meet-the-brothers-user-grid">
                        {groupedUsers[classGroup].map(user => (
                            <div key={user.email} className="meet-the-brothers-brother-card">
                                {user.profilePic && (
                                    <img
                                        src={`http://localhost:5001/${user.profilePic}`}
                                        alt={`${user.firstName} {user.lastName}`}
                                        className="meet-the-brothers-profile-pic"
                                        onError={(e) => console.error(`Failed to load image: http://localhost:5001/${user.profilePic}`)}
                                    />
                                )}
                                <p className="meet-the-brothers-user-name">{user.firstName} {user.lastName}</p>
                                {user.role && <p className="meet-the-brothers-user-role">{user.role}</p>}
                                {user.major && <p className="meet-the-brothers-user-major">{user.major}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MeetTheBrothers;