import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import './Header.css';
import WhiteTT from '../assets/WhiteTT.png';
import {auth, firestore, storage} from '../../firebase';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {query, collection, getDocs} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';

const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const {displayName, email} = currentUser;

                try {
                    // Query users collection to find matching user
                    const userQuery = query(collection(firestore, 'users'));
                    const userSnapshot = await getDocs(userQuery);
                    
                    // Find user with matching email (case-insensitive)
                    const matchingUser = userSnapshot.docs.find(doc =>
                        doc.data().email && doc.data().email.toLowerCase() === email.toLowerCase()
                    );

                    if (!matchingUser) {
                        console.error("User not found in the system.");
                    setUser(null);
                    return;
                }

                    const userData = matchingUser.data();
                    let profilePicUrl = userData?.profilePictureUrl;

                    // Try to get Firebase Storage image first
                    if (profilePicUrl && !profilePicUrl.startsWith('https://lh3.googleusercontent.com/')) {
                        try {
                            profilePicUrl = await getDownloadURL(ref(storage, profilePicUrl));
                        } catch (error) {
                            console.error(`Error getting image URL for user ${email}:`, error);
                            // Fallback to Google photo if Firebase Storage image fails
                            profilePicUrl = currentUser.photoURL;
                        }
                    } else {
                        // If no Firebase Storage image is set, use Google photo
                        profilePicUrl = currentUser.photoURL;
                    }

                    const [firstName, lastName] = displayName ? displayName.split(' ') : [null, null];
                    setUser({
                        firstName,
                        lastName,
                        email,
                        profilePictureUrl: profilePicUrl
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
                navigate('/login');
            })
            .catch((error) => {
                console.error('Failed to log out:', error);
            });
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleIconClick = () => {
        setMobileMenuVisible(false);
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setMobileMenuVisible(!mobileMenuVisible);
    };

    return (
        <nav className="header">
            <img src={WhiteTT} alt="Logo" className="logo" onClick={handleIconClick}/>

            <button className={`hamburger-icon ${mobileMenuVisible ? 'active' : ''}`} onClick={toggleMobileMenu}>
                ☰
            </button>

            <div className={`nav-links ${mobileMenuVisible ? 'visible' : ''}`}>
                <ul>
                    <li className={location.pathname === '/' ? 'active' : ''}><Link to="/"
                                                                                    onClick={toggleMobileMenu}>Home</Link>
                    </li>
                    <li className={location.pathname === '/about-us' ? 'active' : ''}><Link to="/about-us"
                                                                                            onClick={toggleMobileMenu}>About
                        Us</Link></li>
                    <li className={location.pathname === '/meet-the-brothers' ? 'active' : ''}><Link
                        to="/meet-the-brothers" onClick={toggleMobileMenu}>Meet The Brothers</Link></li>
                    <li className={location.pathname === '/rush' ? 'active' : ''}><Link to="/rush"
                                                                                        onClick={toggleMobileMenu}>Rush</Link>
                    </li>
                    <li className={location.pathname === '/alumni' ? 'active' : ''}><Link to="/alumni" onClick={toggleMobileMenu}>Alumni</Link>
                    </li>
                </ul>
            </div>

            <div className="login-link">
                <ul>
                    {user ? (
                        <li className="dropdown" onClick={toggleDropdown}>
                            <span className="header-profile" style={{color: 'white', cursor: 'pointer'}}>
                                <span className="header-profile-name">
                                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                                </span>
                                <img src={user.profilePictureUrl} alt="Profile" className="header-profile-picture"/>
                            </span>

                            <div className={`dropdown-menu ${dropdownVisible ? 'open' : ''}`}>
                                <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                                <Link to="/family-tree" className="dropdown-item">Family Tree</Link>
                                <span onClick={handleLogout} className="dropdown-item">Logout</span>
                            </div>
                        </li>
                    ) : (
                        <li className={location.pathname === '/login' ? 'active' : ''}><Link to="/login">Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Header;