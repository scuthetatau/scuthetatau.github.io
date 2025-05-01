import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import './Header.css';
import WhiteTT from '../assets/WhiteTT.png';
import {auth, firestore, storage} from '../../firebase';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {getDownloadURL, ref} from 'firebase/storage';

const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuthorization = async (email) => {
            const authorizedEmailsRef = doc(firestore, 'authorizedEmails', 'emails_array');
            const authorizedEmailsDoc = await getDoc(authorizedEmailsRef);

            if (!authorizedEmailsDoc.exists()) {
                console.error("Authorization list not found.");
                return false;
            }

            const authorizedEmails = authorizedEmailsDoc.data().email;
            if (!authorizedEmails || !Array.isArray(authorizedEmails) || !authorizedEmails.includes(email)) {
                console.error("Your email is not listed as an authorized email.");
                return false;
            }
            return true;
        };

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const {displayName, email} = currentUser;

                const isAuthorized = await checkAuthorization(email);
                if (!isAuthorized) {
                    setUser(null);
                    return;
                }

                try {
                    const userQuery = doc(firestore, 'users', currentUser.uid);
                    const userSnapshot = await getDoc(userQuery);
                    const userData = userSnapshot.data();
                    let profilePicUrl = userData?.profilePictureUrl;

                    if (profilePicUrl && !profilePicUrl.startsWith('https://lh3.googleusercontent.com/')) { // Profile picture is a Firebase Storage URL
                        try {
                            profilePicUrl = await getDownloadURL(ref(storage, profilePicUrl));
                        } catch (error) {
                            console.error(`Error getting image URL for user ${currentUser.email}:`, error);
                        }
                    }

                    const [firstName, lastName] = displayName ? displayName.split(' ') : [null, null];
                    setUser({
                        firstName,
                        lastName,
                        email,
                        profilePictureUrl: profilePicUrl || currentUser.photoURL
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
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setMobileMenuVisible(!mobileMenuVisible);
    };

    const isAdminUser = user && (user.role === 'Admin' || user.role === 'Webmaster' || user.role === 'Scribe');

    return (
        <nav className="header">
            <img src={WhiteTT} alt="Logo" className="logo" onClick={handleIconClick}/>

            <button className="hamburger-icon" onClick={toggleMobileMenu}>
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
                    {user && (
                        <li className={location.pathname === '/family-tree' ? 'active' : ''}>
                            <Link to="/family-tree" onClick={toggleMobileMenu}>Family Tree</Link>
                        </li>
                    )}
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
                            {dropdownVisible && (
                                <div className="dropdown-menu">
                                    <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                                    {isAdminUser && <Link to="/admin" className="dropdown-item">Admin</Link>}
                                    <span onClick={handleLogout} className="dropdown-item">Logout</span>
                                </div>
                            )}
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