import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Admin.css';
import {checkUserRole, getUserPermissions} from './auth';
import {auth} from '../../firebase';

const Admin = () => {
    const navigate = useNavigate();
    const [userPermissions, setUserPermissions] = useState([]);

    useEffect(() => {
        // Check user permissions on component mount
        const unsubscribe = checkUserRole(navigate);
        
        // Get user's permissions
        const fetchUserPermissions = async () => {
            const user = auth.currentUser;
            if (user) {
                const permissions = await getUserPermissions(user);
                setUserPermissions(permissions);
            }
        };
        
        fetchUserPermissions();

        // Cleanup subscription to onAuthStateChanged when component unmounts
        return () => unsubscribe && unsubscribe();
    }, [navigate]);

    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <nav className="admin-dashboard">
                <ul>
                    {hasPermission('user-management') && (
                        <li>
                            <button className="rush-btn"><Link to="/admin/user-management">User Management</Link></button>
                        </li>
                    )}
                    {hasPermission('bro-dates') && (
                        <li>
                            <button className="rush-btn"><Link to="/admin/bro-dates">Bro Dates</Link></button>
                        </li>
                    )}
                    {hasPermission('scribe-editor') && (
                        <li>
                            <button className="rush-btn"><Link to="/scribe-editor">Scribe Editor</Link></button>
                        </li>
                    )}
                    {hasPermission('spoon-assassins') && (
                        <li>
                            <button className="rush-btn"><Link to="/admin/spoon-assassins">Spoon Assassins</Link></button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Admin;