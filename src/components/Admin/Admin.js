import React from 'react';
import {Link} from 'react-router-dom';
import './Admin.css';

const Admin = () => {
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