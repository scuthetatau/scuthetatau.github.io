import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import WhiteTT from '../assets/WhiteTT.png';
import { auth, firestore } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const { email } = currentUser;

                try {
                    const authorizedEmailsRef = doc(firestore, 'authorizedEmails', 'emails_array');
                    const authorizedEmailsDoc = await getDoc(authorizedEmailsRef);

                    if (authorizedEmailsDoc.exists() && authorizedEmailsDoc.data().emails.includes(email)) {
                        const { displayName } = currentUser;
                        const [firstName, lastName] = displayName ? displayName.split(' ') : [null, null];
                        setUser({ firstName, lastName, email });
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Failed to check authorization:", error);
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
            <img src={WhiteTT} alt="Logo" className="logo" onClick={handleIconClick} />

            <button className="hamburger-icon" onClick={toggleMobileMenu}>
                ☰
            </button>

            <div className={`nav-links ${mobileMenuVisible ? 'visible' : ''}`}>
                <ul>
                    <li className={location.pathname === '/' ? 'active' : ''}><Link to="/" onClick={toggleMobileMenu}>Home</Link></li>
                    <li className={location.pathname === '/about-us' ? 'active' : ''}><Link to="/about-us" onClick={toggleMobileMenu}>About Us</Link></li>
                    <li className={location.pathname === '/meet-the-brothers' ? 'active' : ''}><Link to="/meet-the-brothers" onClick={toggleMobileMenu}>Meet The Brothers</Link></li>
                    <li className={location.pathname === '/rush' ? 'active' : ''}><Link to="/rush" onClick={toggleMobileMenu}>Rush</Link></li>
                </ul>
            </div>

            <div className="login-link">
                <ul>
                    {user ? (
                        <li className="dropdown" onClick={toggleDropdown}>
                            <span style={{ color: 'white', cursor: 'pointer' }}>
                                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
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
                        <li className={location.pathname === '/login' ? 'active' : ''}><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Header;