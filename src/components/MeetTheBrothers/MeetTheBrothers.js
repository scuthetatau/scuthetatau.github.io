import React, {useEffect, useState} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import CoatArms from '../assets/CoatArms.png';
import GenericProfile from '../assets/generic.png';
import './MeetTheBrothers.css';
import {firestore, storage} from '../../firebase';
import ChapterPhoto from "../assets/ChapterPhoto.jpeg";

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
                                user.profilePicUrl = await getDownloadURL(ref(storage, user.profilePictureUrl));
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

    // Helper function to sort users alphabetically by last name
    const sortByLastName = (users) => {
        return users.sort((a, b) => {
            const aLastName = a.lastName ?? "";
            const bLastName = b.lastName ?? "";
            return aLastName.localeCompare(bLastName);
        });
    };

    const executiveBoardRoles = ['Scribe', 'Corresponding Secretary', 'Regent', 'Treasurer', 'Vice Regent'];

    const executiveBoardUsers = sortByLastName(users.filter(user => executiveBoardRoles.includes(user.role)))
        .sort((a, b) => {
            const roleOrder = ['Regent', 'Vice Regent'];
            const aIndex = roleOrder.indexOf(a.role);
            const bIndex = roleOrder.indexOf(b.role);
            if (aIndex !== -1 || bIndex !== -1) {
                return (aIndex !== -1 ? aIndex : Infinity) - (bIndex !== -1 ? bIndex : Infinity);
            }
            return 0;
        });

    const hiddenRoles = ['Mediation Chair']; // Roles to be hidden from leadership section
    const leadershipUsers = sortByLastName(users.filter(user => 
        user.role && 
        !executiveBoardRoles.includes(user.role) && 
        !hiddenRoles.includes(user.role)
    ));

    const groupedUsers = users.reduce((groups, user) => {
        const classGroup = user.class || 'Unknown Class';
        if (!groups[classGroup]) {
            groups[classGroup] = [];
        }
        groups[classGroup].push(user);
        return groups;
    }, {});

    const handleImageError = (event) => {
        event.target.onerror = null; // Prevents infinite loop if fallback image fails
        event.target.src = CoatArms; // Fallback image
    };

    const handleCardClick = (user) => {
        if (user.linkedinUrl) {
            window.open(user.linkedinUrl, '_blank');
        }
    };

    return (
        <div className="meet-the-brothers-component">
            <div className="meet-the-brothers-hero" style={{backgroundImage: `url(${ChapterPhoto})`}}>
                <div className="join-overlay">
                    <h2 className="hero-title">Meet the Brothers</h2>
                </div>
            </div>
            {/*<img src={CoatArms} alt="CoatArms" className="meet-the-brothers-coat-arms"/>*/}

            {error && <p className="error-message">{error}</p>}

            {executiveBoardUsers.length > 0 && (
                <div className="meet-the-brothers-executive-board-section">
                    <h2>{currentYear} Executive Board</h2>
                    <div className="meet-the-brothers-executive-board-grid">
                        {executiveBoardUsers.map(user => (
                            <div
                                key={user.email}
                            >
                                <img
                                    src={user.profilePicUrl || GenericProfile}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="meet-the-brothers-executive-board-profile-pic"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                                <div
                                    className="meet-the-brothers-executive-board-name">{user.firstName} {user.lastName}</div>
                                <div className="meet-the-brothers-executive-board-role">{user.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {leadershipUsers.length > 0 && (
                <div className="meet-the-brothers-leadership-section">
                    <h2>{currentYear} Leadership</h2>
                    <div className="meet-the-brothers-leadership-grid">
                        {leadershipUsers.map(user => (
                            <div key={user.email} className="meet-the-brothers-leadership-profile">
                                <img
                                    src={user.profilePicUrl || GenericProfile}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="meet-the-brothers-leadership-profile-pic"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                                <div className="meet-the-brothers-leadership-name">{user.firstName} {user.lastName}</div>
                                <div className="meet-the-brothers-leadership-role">{user.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {Object.keys(groupedUsers).map(classGroup => (
                <div key={classGroup} className="meet-the-brothers-class-group">
                    <h2>{classGroup} Class</h2>
                    <div className="meet-the-brothers-user-grid">
                        {sortByLastName(groupedUsers[classGroup]).map(user => (
                            <div
                                key={user.email}
                                className={`meet-the-brothers-brother-card ${user.linkedinUrl ? 'linkedin-available' : ''}`}
                                onClick={() => handleCardClick(user)}
                                style={{ cursor: user.linkedinUrl ? 'pointer' : 'default' }}
                            >
                                <img
                                    src={user.profilePicUrl || GenericProfile}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="meet-the-brothers-profile-pic"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                                <p className="meet-the-brothers-user-name">{user.firstName} {user.lastName}</p>
                                {user.role && user.role !== 'Mediation Chair' && <p className="meet-the-brothers-user-role">{user.role}</p>}
                                {user.major && <p className="meet-the-brothers-user-major">{user.major}</p>}
                                {user.graduationYear && <p className="meet-the-brothers-user-graduation-year">Class of {user.graduationYear}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MeetTheBrothers;
