import React, {useEffect, useState} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';
import {auth, firestore, storage} from '../firebase';
import {onAuthStateChanged} from 'firebase/auth';
import CoatArms from './assets/CoatArms.png'; // Fallback image
import UpsilonClass from './assets/UpsilonEpsilonThetaTau.png'
import './MeetTheBrothers/MeetTheBrothers.css'; // Use styling similar to `MeetTheBrothers`

const Alumni = () => {
    const [alumni, setAlumni] = useState([]);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const foundersIDs = new Set([
        'K26DTygVlTGCbSOtYqnh',
        'KB6BbO0Tt7b7S0CPHoZr',
        '8UQWflUNYPJMUM6U9WDQ',
        'haV85nz8xqC8eXCnkYNr',
        'YvJ286qtey5i2QdA3lRo'
    ]);

    useEffect(() => {
        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const alumniCollection = collection(firestore, 'alumni'); // Collection for alumni
                const alumniSnapshot = await getDocs(alumniCollection);
                const alumniList = alumniSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));



                const alumniWithImages = await Promise.all(
                    alumniList.map(async (alum) => {
                        if (alum.profilePictureUrl) {
                            if (alum.profilePictureUrl.startsWith('https://lh3.googleusercontent.com/')) {
                                alum.profilePicUrl = alum.profilePictureUrl;
                            } else {
                                try {
                                    const imageUrl = await getDownloadURL(ref(storage, alum.profilePictureUrl));
                                    alum.profilePicUrl = imageUrl;
                                } catch (error) {
                                    console.error(`Error getting image URL for alumni ${alum.firstName} ${alum.lastName}:`, error);
                                }
                            }
                        }
                        return alum;
                    })
                );

                setAlumni(alumniWithImages);
                setError(null);
            } catch (error) {
                console.error('Error fetching alumni data:', error);
                setError('Failed to fetch alumni. Please try again later.');
            }
        };

        fetchAlumni();
    }, []);

    const handleImageError = (event) => {
        event.target.onerror = null; // Prevent infinite loop if fallback image fails
        event.target.src = CoatArms; // Use fallback CoatArms image
    };

    // Helper function to group alumni by graduation year
    const groupedAlumni = alumni.reduce((groups, alum) => {
        // Skip alumni who have dropped
        if (alum.dropped) {
            return groups;
        }
        const year = alum.graduationYear || 'Unknown Year';
        if (!groups[year]) {
            groups[year] = [];
        }
        groups[year].push(alum);
        return groups;
    }, {});

    // Sort years in descending order, with "Unknown Year" at the end
    const sortedYears = Object.keys(groupedAlumni).sort((a, b) => {
        if (a === 'Unknown Year') return 1; // Place 'Unknown Year' at the end
        if (b === 'Unknown Year') return -1;
        return b - a; // Sort in descending order by year
    });

    // Helper function to sort alumni alphabetically by last name within each group
    const sortByLastName = (alumniGroup) => {
        return alumniGroup.sort((a, b) => {
            const aLastName = a.lastName?.toLowerCase() || '';
            const bLastName = b.lastName?.toLowerCase() || '';
            return aLastName.localeCompare(bLastName);
        });
    };

    const handleCardClick = (alum) => {
        if (!isAuthenticated || !alum.linkedinUrl) {
            return;
        }
        window.open(alum.linkedinUrl, '_blank');
    };

    return (
        <div className="meet-the-brothers-component">
            <div className="meet-the-brothers-hero" style={{ backgroundImage: `url(${UpsilonClass})` }}>
                <div className="join-overlay">
                    <h2 className="hero-title">Our Alumni</h2>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {sortedYears.map((year) => (
                <div key={year} className="meet-the-brothers-executive-board-section">
                    <h2>Class of {year} </h2>
                    <div className="meet-the-brothers-user-grid">
                        {sortByLastName(groupedAlumni[year]).map((alum, index) => (
                            <div
                                key={index}
                                className={`meet-the-brothers-brother-card ${foundersIDs.has(alum.id) ? 'gold-glow' : ''} ${alum.linkedinUrl ? 'linkedin-available' : ''}`}
                                onClick={() => handleCardClick(alum)}
                                style={{ cursor: alum.linkedinUrl ? 'pointer' : 'default' }}
                            >
                                {alum.profilePicUrl && (
                                    <img
                                        src={alum.profilePicUrl || CoatArms}
                                        alt={`${alum.firstName} ${alum.lastName}`}
                                        className="meet-the-brothers-profile-pic"
                                        onError={handleImageError}
                                    />
                                )}
                                <p className="meet-the-brothers-user-name">{alum.firstName} {alum.lastName}</p>
                                {foundersIDs.has(alum.id) && (
                                    <div className="founder-alumni-badge">Founding Member</div>
                                )}
                                {alum.major && <p className="meet-the-brothers-user-major">{alum.major}</p>}
                                {alum.graduationYear && <p className="meet-the-brothers-user-graduation-year">Class of {alum.graduationYear}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Alumni;