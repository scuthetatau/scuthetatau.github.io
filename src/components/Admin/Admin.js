import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Admin.css';
import { checkUserRole } from './auth'; // Assuming the checkUserRole function is in utils/auth.js

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check user permissions on component mount
        const unsubscribe = checkUserRole(navigate);

        // Cleanup subscription to onAuthStateChanged when component unmounts
        return () => unsubscribe && unsubscribe();
    }, [navigate]);

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <nav className="admin-dashboard">
                <ul>
                    <li>
                        <button className="rush-btn"><Link to="/admin/user-management">User Management</Link></button>
                    </li>
                    <li>
                        <button className="rush-btn"><Link to="/admin/bro-dates">Bro Dates</Link></button>
                    </li>
                    <li>
                        <button className="rush-btn"><Link to="/scribe-editor">Scribe Editor</Link></button>
                    </li>
                    <li>
                        <button className="rush-btn"><Link to="/admin/spoon-assassins">Spoon Assassins</Link></button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Admin;