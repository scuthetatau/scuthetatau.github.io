import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import WhiteTT from '../assets/WhiteTT.png';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    // Listen to the authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const { displayName, email } = currentUser;
                const [firstName, lastName] = displayName ? displayName.split(' ') : [null, null];
                setUser({ firstName, lastName, email });
            } else {
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
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

    // Define what users can see the 'Admin' page in the Header drop down
    const isAdminUser = user && (user.role === 'Admin' || user.role === 'Webmaster' || user.role === 'Scribe');

    return (
        <nav className="header">
            <img src={WhiteTT} alt="Logo" className="logo" onClick={handleIconClick} />
            <div className="nav-links">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li><Link to="/meet-the-brothers">Meet The Brothers</Link></li>
                    {/*<li><Link to="/events">Events</Link></li>*/}
                    <li><Link to="/rush">Rush</Link></li>
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
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Header;