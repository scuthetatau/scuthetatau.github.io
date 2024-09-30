import React from 'react';
import './Admin.css';
import EditUsers from './widgets/EditUsers';
import BroDateGroups from './widgets/BroDateGroups';

const Admin = () => {
    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <BroDateGroups />
            <EditUsers />
        </div>
    );
};

export default Admin;