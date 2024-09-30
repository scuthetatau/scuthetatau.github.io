import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUsers.css';

const EditUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateInfo, setUpdateInfo] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUsers(token);
        }
    }, []);

    const fetchUsers = async (token) => {
        try {
            const response = await axios.get('http://localhost:5001/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const usersData = response.data;
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = users.filter(user =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        uploadProfilePic(selectedUser.email, file);
    };

    const uploadProfilePic = async (email, file) => {
        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5001/api/upload-profile-pic/${email}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfilePic(response.data.profilePic);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUpdateInfo(user);
        setShowEditPopup(true);
        setProfilePic(user.profilePic || '');
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedUser = {
                ...selectedUser,
                ...updateInfo,
                profilePic,
                major: updateInfo.major
            };

            await axios.put('http://localhost:5001/api/admin-update-user', updatedUser, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setIsSuccess(true);
            setError('');
            fetchUsers(token);
            setShowEditPopup(false);
        } catch (error) {
            setIsSuccess(false);
            setError('Failed to update user details');
            console.error('Error updating user details:', error);
        }
    };

    return (
        <div>
            <h2>Edit Users</h2>
            <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />
            <div className="users-grid">
                {filteredUsers.map(user => (
                    <div className="user-card" key={user.email} onClick={() => handleEditUser(user)}>
                        {user.profilePic && (
                            <img
                                src={`http://localhost:5001/${user.profilePic}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="profile-pic"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                        <div className="user-info">
                            <h2>{user.firstName} {user.lastName}</h2>
                            <p>{user.email}</p>
                            <p>{user.role}</p>
                        </div>
                    </div>
                ))}
            </div>
            {showEditPopup && (
                <>
                    <div className="overlay" onClick={() => setShowEditPopup(false)}></div>
                    <div className="edit-popup">
                        <form onSubmit={handleUpdateUser}>
                            <div className="form-group-group">
                                <div className="form-group">
                                    <label>First Name:
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={updateInfo.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Last Name:
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={updateInfo.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="form-group-group">
                                <div className="form-group">
                                    <label>Email:
                                        <input
                                            type="email"
                                            name="email"
                                            value={selectedUser.email}
                                            readOnly
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Graduation Year:
                                        <input
                                            type="text"
                                            name="graduationYear"
                                            value={updateInfo.graduationYear}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="form-group-group">
                                <div className="form-group">
                                    <label>Family:
                                        <input
                                            type="text"
                                            name="family"
                                            value={updateInfo.family}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Class:
                                        <input
                                            type="text"
                                            name="class"
                                            value={updateInfo.class}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="form-group-group">
                                <div className="form-group">
                                    <label>Major:
                                        <input
                                            type="text"
                                            name="major"
                                            value={updateInfo.major}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Role:
                                        <input
                                            type="text"
                                            name="role"
                                            value={updateInfo.role}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="form-group-group">
                                <div className="form-group">
                                    <label>Points:
                                        <input
                                            type="number"
                                            name="points"
                                            value={updateInfo.points}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Profile Picture:
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            {isSuccess && <p className="success-message">User details updated successfully!</p>}
                            {error && <p className="error-message">{error}</p>}
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowEditPopup(false)}>Close</button>
                                <button type="submit">Update User</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default EditUsers;