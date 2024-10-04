import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import CoatArms from '../assets/CoatArms.png';
import './MeetTheBrothers.css';
import { firestore, storage } from '../../firebase';
import thetaClass from "../assets/ThetaClassInitiation.png"; // Adjust the path as necessary

const MeetTheBrothers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => doc.data());

                const usersWithImages = await Promise.all(usersList.map(async user => {
                    if (user.profilePictureUrl) {
                        // Check if the URL is a Firebase Storage URL
                        if (user.profilePictureUrl.startsWith('https://lh3.googleusercontent.com/')) {
                            user.profilePicUrl = user.profilePictureUrl;
                        } else {
                            try {
                                const imageUrl = await getDownloadURL(ref(storage, user.profilePictureUrl));
                                user.profilePicUrl = imageUrl;
                            } catch (error) {
                                console.error(`Error getting image URL for user ${user.email}:`, error);
                            }
                        }
                    }
                    return user;
                }));

                setUsers(usersWithImages);
                setError(null);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users. Please try again later.');
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

    const leadershipUsers = users.filter(user => user.role).sort((a, b) => {
        const roleOrder = ['Regent', 'Vice Regent'];
        const indexA = roleOrder.indexOf(a.role);
        const indexB = roleOrder.indexOf(b.role);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const handleImageError = (event) => {
        event.target.onerror = null; // Prevents infinite loop if fallback image fails
        event.target.src = CoatArms; // Fallback image
    };

    return (
        <div className="meet-the-brothers-component">
            <div className="meet-the-brothers-hero" style={{backgroundImage: `url(${thetaClass})`}}>
                <div className="join-overlay">
                    <h2 className="rush-hero-title">Meet the Brothers</h2>
                </div>
            </div>
            {/*<img src={CoatArms} alt="CoatArms" className="meet-the-brothers-coat-arms"/>*/}

            {error && <p className="error-message">{error}</p>}

            {leadershipUsers.length > 0 && (
                <div className="meet-the-brothers-leadership-section">
                    <h2>{currentYear} Leadership</h2>
                    <div className="meet-the-brothers-leadership-grid">
                        {leadershipUsers.map(user => (
                            <div key={user.email} className="meet-the-brothers-leadership-profile">
                                {user.profilePicUrl && (
                                    <img
                                        src={user.profilePicUrl}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="meet-the-brothers-leadership-profile-pic"
                                        onError={handleImageError}
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
                                {user.profilePicUrl && (
                                    <img
                                        src={user.profilePicUrl}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="meet-the-brothers-profile-pic"
                                        onError={handleImageError}
                                    />
                                )}
                                <p className="meet-the-brothers-user-name">{user.firstName} {user.lastName}</p>
                                {user.role && <p className="meet-the-brothers-user-role">{user.role}</p>}
                                {user.major && <p className="meet-the-brothers-user-major">{user.major}</p>}
                                {user.graduationYear && <p className="meet-the-brothers-user-graduation-year">Class
                                    of {user.graduationYear}</p>}
                                {/*{user.family && <p className="meet-the-brothers-user-family">Family: {user.family}</p>}*/}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MeetTheBrothers;