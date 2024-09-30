import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';
import WhiteTT from '../assets/WhiteTT.png'; // Assume the image path is correct

const Header = () => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5001/api/user-info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        throw new Error('Unauthorized');
                    }
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setUser(data);
                })
                .catch(error => {
                    console.error('Failed to fetch user info:', error);
                    navigate('/login');
                });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
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
            <img src={WhiteTT} alt="Logo" className="logo" onClick={handleIconClick}/>
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
                            <span style={{color: 'white', cursor: 'pointer'}}>
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