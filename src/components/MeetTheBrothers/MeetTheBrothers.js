import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import CoatArms from '../assets/CoatArms.png';
import './MeetTheBrothers.css';
import { firestore, storage } from '../../firebase';
import thetaClass from "../assets/IMG_9401.jpeg"; // Adjust the path as necessary

const MeetTheBrothers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user
    const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
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

    // Helper function to sort users alphabetically by last name
    const sortByLastName = (users) => {
        return users.sort((a, b) => {
            const aLastName = a.lastName ?? "";
            const bLastName = b.lastName ?? "";
            return aLastName.localeCompare(bLastName);
        });
    };

    const openPopup = (user) => {
        console.log("Opening popup for user:", user);
        setSelectedUser(user);
        console.log("State after setting selectedUser:", selectedUser); // May not reflect immediately
        setIsPopupVisible(true);
        console.log("Popup visibility:", isPopupVisible); // May delay as well
    };

    // Close the popup
    const closePopup = () => {
        setSelectedUser(null);
        setIsPopupVisible(false);
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

    const leadershipUsers = sortByLastName(users.filter(user => user.role && !executiveBoardRoles.includes(user.role)));

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

    return (
        <div className="meet-the-brothers-component">
            <div className="meet-the-brothers-hero" style={{backgroundImage: `url(${thetaClass})`}}>
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
                                {user.profilePicUrl && (
                                    <img
                                        src={user.profilePicUrl}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="meet-the-brothers-executive-board-profile-pic"
                                        onError={handleImageError}
                                    />
                                )}
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
                                {user.profilePicUrl && (
                                    <img
                                        src={user.profilePicUrl}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="meet-the-brothers-leadership-profile-pic"
                                        onError={handleImageError}
                                    />
                                )}
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
                                className="meet-the-brothers-brother-card"
                                onClick={() => {
                                    // console.log("Card clicked for user:", user);
                                    openPopup(user);
                                }}
                            >
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
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {isPopupVisible && selectedUser && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-main">
                            <div className="popup-user-image-container">
                                <img
                                    src={selectedUser.profilePicUrl || CoatArms}
                                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                    className="popup-user-image"
                                />
                            </div>
                            <div className="popup-user-info">
                                <h2>{selectedUser.firstName} {selectedUser.lastName}</h2>
                                <p>Graduation Year: {selectedUser.graduationYear}</p>
                                <p>Class: {selectedUser.class}</p>
                                <p>Leadership Position: {selectedUser.role || "N/A"}</p>
                            </div>
                        </div>
                        <button className="popup-close-button" onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetTheBrothers;
