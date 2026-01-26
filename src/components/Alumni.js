import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { auth, firestore, storage } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import CoatArms from './assets/CoatArms.png'; // Fallback image
import UpsilonClass from './assets/UpsilonEpsilonThetaTau.png'
import './MeetTheBrothers/MeetTheBrothers.css'; // Use styling similar to `MeetTheBrothers`

const Alumni = () => {
    const [alumni, setAlumni] = useState([]);
    const [randomLogos, setRandomLogos] = useState([]);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load company logos dynamically
    useEffect(() => {
        try {
            const context = require.context('./assets/company_logos', false, /\.(png|jpe?g|svg)$/);
            const logos = context.keys().map(context);
            // Shuffle logos
            const shuffled = [...logos].sort(() => 0.5 - Math.random());
            setRandomLogos(shuffled);
        } catch (err) {
            console.error('Error loading company logos:', err);
        }
    }, []);

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
                                    alum.profilePicUrl = await getDownloadURL(ref(storage, alum.profilePictureUrl));
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

        // June graduation rule: Don't show if it's before June of their graduation year
        if (alum.graduationYear) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth(); // 0-indexed (May is 4, June is 5)

            const gradYear = parseInt(alum.graduationYear, 10);

            // Hide if:
            // 1. Current year is before graduation year
            // 2. Current year IS graduation year, but it's before June (month index 5)
            if (currentYear < gradYear || (currentYear === gradYear && currentMonth < 5)) {
                return groups;
            }
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
                    <h1 className="font-anton text-7xl md:text-9xl text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl text-center">
                        OUR <span className="text-accent">ALUMNI</span>
                    </h1>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {/* Where Our Alumni Work Section */}
            <section className="alumni-careers-section">
                <div className="alumni-section-header">
                    <h2 className="alumni-section-title">WHERE OUR ALUMNI WORK</h2>
                    <div className="alumni-section-divider"></div>
                    <p className="alumni-section-description">
                        Our brothers transition into industry leaders at the world's most innovative engineering and technology companies.
                    </p>
                </div>
                <div className="alumni-logos-grid">
                    {randomLogos.map((logo, index) => (
                        <div key={index} className="alumni-logo-item">
                            <img alt={`Company Logo ${index}`} src={logo} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Success Stories Section */}
            {/*<section className="alumni-success-stories">*/}
            {/*    <div className="alumni-section-header">*/}
            {/*        <h2 className="alumni-section-title">SUCCESS STORIES</h2>*/}
            {/*        /!*<p className="alumni-section-subtitle text-accent">ALUMNI SPOTLIGHT</p>*!/*/}
            {/*    </div>*/}
            {/*    <div className="alumni-stories-grid">*/}
            {/*        <div className="alumni-story-card">*/}
            {/*            <div className="alumni-story-image-container">*/}
            {/*                <img alt="Marcus Thorne" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbuwhSe4-67g0zFrGvqBlPfZG9PB72a0VSAMD4hPuosNGGvxC-aYGfMLeZ4ritaK632MM64r2xU55K-5ygkEr_ZqSj63TtBMj9mtNoAhovYxBA6hgAPOp0GMpGSOdsOlKeW1bbOQl7VhGasZ8QYwq4ZviXqQMK6Ad3A3U25hGjBB_HL00AZsme9rjXFaXM4r_HT95wjaXj2RC5Dk-aJaXYaTyldIqTyiVzqB0FZHLHvaV3UT74cGWbqXLe1jVMV7nTrGr7fUmtro0T" />*/}
            {/*            </div>*/}
            {/*            <h3 className="alumni-story-name">Marcus Thorne</h3>*/}
            {/*            <p className="alumni-story-role">SpaceX | Propulsion Engineer</p>*/}
            {/*            <p className="alumni-story-quote">*/}
            {/*                "The leadership skills I gained as Regent prepared me for the high-stakes environment of aerospace engineering."*/}
            {/*            </p>*/}
            {/*            <span className="alumni-story-class">Class of 2018</span>*/}
            {/*        </div>*/}
            {/*        <div className="alumni-story-card">*/}
            {/*            <div className="alumni-story-image-container">*/}
            {/*                <img alt="Elena Rodriguez" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxFgVTawuWFmFNXMq2op2FlnMu0EqA2fhwNfsYJ6dg81KcfW1fPeVxZ5E93vtpUQbSUNu_2dRSejj90NAKWboaOei0ygxlkLRNUev83Cbh-AG4cXprkWy6B3QLw7buqjr5fegYepOx1leC9fRL5WUyb-zc3TMAoH_nrCvZqrE9CKIfQcnZbNheHuBoQ4DKCTe51LjzvTIY-46kvVurhvGxYo_HC9A8xaQCEL034BLcc0neW0KT8z8Y2acp0-jQyd2GGMjScQTlOaSW" />*/}
            {/*            </div>*/}
            {/*            <h3 className="alumni-story-name">Elena Rodriguez</h3>*/}
            {/*            <p className="alumni-story-role">Google | Senior SWE</p>*/}
            {/*            <p className="alumni-story-quote">*/}
            {/*                "Our brotherhood network was instrumental in landing my first internship. Now I mentor active members every year."*/}
            {/*            </p>*/}
            {/*            <span className="alumni-story-class">Class of 2019</span>*/}
            {/*        </div>*/}
            {/*        <div className="alumni-story-card">*/}
            {/*            <div className="alumni-story-image-container">*/}
            {/*                <img alt="Julian Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAox6yTVJwDTzp-CyQ-8jQPSDe0PhqJD3-vqE8jBQaYCx35LPCvbRRerqyirvE5Fi5XSD3azDJRsG6FeJW3IUs5H2rTbwa7pGhRrXyo6IgLjoM5IYmdA6kjgG8OcDMp4N2ShrP2cxZ-4I4a7YVIQQbs-tXN7R79VgX6nbznZD-4zfzBUIXoYkt3zhp0-5X1yc4Wx_JeVr1RW9us7VO8VIB0dWGPezmWyUHaVxLxUVYAkXV8xDYj1A21jaDIRNk6_9uK3mXm4T7vE_wU" />*/}
            {/*            </div>*/}
            {/*            <h3 className="alumni-story-name">Julian Chen</h3>*/}
            {/*            <p className="alumni-story-role">Boeing | Systems Lead</p>*/}
            {/*            <p className="alumni-story-quote">*/}
            {/*                "The professional standards of Theta Tau gave me a competitive edge in the job market right after graduation."*/}
            {/*            </p>*/}
            {/*            <span className="alumni-story-class">Class of 2017</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {sortedYears.map((year) => (
                <div key={year} className="meet-the-brothers-class-group">
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