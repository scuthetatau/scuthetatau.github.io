import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import CoatArms from './assets/CoatArms.png'; // Fallback image
import UpsilonClass from './assets/UpsilonEpsilonThetaTau.png'
import './MeetTheBrothers/MeetTheBrothers.css'; // Use styling similar to `MeetTheBrothers`
import { firestore, storage } from '../firebase';

const Alumni = () => {
    const [alumni, setAlumni] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const alumniCollection = collection(firestore, 'alumni'); // Collection for alumni
                const alumniSnapshot = await getDocs(alumniCollection);
                const alumniList = alumniSnapshot.docs.map((doc) => doc.data());

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

    return (
        <div className="meet-the-brothers-component">
            <div className="meet-the-brothers-hero" style={{ backgroundImage: `url(${UpsilonClass})` }}>
                <div className="join-overlay">
                    <h2 className="rush-hero-title">Our Alumni</h2>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {sortedYears.map((year) => (
                <div key={year} className="meet-the-brothers-executive-board-section">
                    <h2>Class of {year} </h2>
                    <div className="meet-the-brothers-user-grid">
                        {sortByLastName(groupedAlumni[year]).map((alum, index) => (
                            <div key={index} className="meet-the-brothers-brother-card">
                                {alum.profilePicUrl && (
                                    <img
                                        src={alum.profilePicUrl || CoatArms}
                                        alt={`${alum.firstName} ${alum.lastName}`}
                                        className="meet-the-brothers-profile-pic"
                                        onError={handleImageError}
                                    />
                                )}
                                <p className="meet-the-brothers-user-name">{alum.firstName} {alum.lastName}</p>
                                {alum.major && <p className="meet-the-brothers-user-major">{alum.major}</p>}
                                {alum.graduationYear && <p className="meet-the-brothers-user-graduation-year">Class of {alum.graduationYear}</p>}
                                {/*{alum.profession && <p className="meet-the-brothers-user-role">{alum.profession}</p>}*/}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Alumni;