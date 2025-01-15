import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../firebase';
import './Admin.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: '',
        firstName: '',
        lastName: '',
        class: '',
        graduationYear: '',
        family: '',
        major: '',
        role: '',
        points: 0,
        profilePictureUrl: ''
    });
    const [editingUser, setEditingUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureEdit, setProfilePictureEdit] = useState(null);

    // Fetch users from Firestore
    const fetchUsers = async () => {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    // Add a new user to Firestore
    const addUser = async (newUser, profilePicture) => {
        if (profilePicture) {
            const profilePictureRef = ref(storage, `profilePictures/${new Date().getTime()}_${profilePicture.name}`);
            await uploadBytes(profilePictureRef, profilePicture);
            newUser.profilePictureUrl = await getDownloadURL(profilePictureRef);
        }
        await addDoc(collection(firestore, 'users'), newUser);
    };

    // Update an existing user in Firestore
    const updateUser = async (editingUser, profilePictureEdit) => {
        if (profilePictureEdit) {
            const profilePictureRef = ref(storage, `profilePictures/${new Date().getTime()}_${profilePictureEdit.name}`);
            await uploadBytes(profilePictureRef, profilePictureEdit);
            editingUser.profilePictureUrl = await getDownloadURL(profilePictureRef);
        }
        const userRef = doc(firestore, 'users', editingUser.id);
        await updateDoc(userRef, editingUser);
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            const usersList = await fetchUsers();
            setUsers(usersList);
        };
        fetchAllUsers();
    }, []);

    const handleAddUser = async () => {
        try {
            await addUser(newUser, profilePicture);
            setNewUser({
                email: '',
                firstName: '',
                lastName: '',
                class: '',
                graduationYear: '',
                family: '',
                major: '',
                role: '',
                points: 0,
                profilePictureUrl: ''
            });
            setProfilePicture(null);
            alert('User added successfully');
            const usersList = await fetchUsers(); // Refresh user list
            setUsers(usersList);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            await updateUser(editingUser, profilePictureEdit);
            setEditingUser(null);
            setProfilePictureEdit(null);
            alert('User updated successfully');
            const usersList = await fetchUsers(); // Refresh user list
            setUsers(usersList);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCloseEditUser = () => {
        setEditingUser(null);
        setProfilePictureEdit(null);
    };

    return (
        <div className="admin-page">
            <h1>User Management</h1>

            {/* Add user section */}
            <div className="admin-add-user">
                <h2>Add New User</h2>
                <div className="admin-input-group">
                    <label>Profile Picture</label>
                    <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                </div>
                <div className="admin-input-group">
                    <label>Email</label>
                    <input
                        type="text"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Email"
                    />
                </div>
                <div className="admin-input-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        placeholder="First Name"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        placeholder="Last Name"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Class</label>
                    <input
                        type="text"
                        value={newUser.class}
                        onChange={(e) => setNewUser({ ...newUser, class: e.target.value })}
                        placeholder="Class"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Graduation Year</label>
                    <input
                        type="text"
                        value={newUser.graduationYear}
                        onChange={(e) => setNewUser({ ...newUser, graduationYear: e.target.value })}
                        placeholder="Graduation Year"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Family</label>
                    <input
                        type="text"
                        value={newUser.family}
                        onChange={(e) => setNewUser({ ...newUser, family: e.target.value })}
                        placeholder="Family"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Major</label>
                    <input
                        type="text"
                        value={newUser.major}
                        onChange={(e) => setNewUser({ ...newUser, major: e.target.value })}
                        placeholder="Major"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Role</label>
                    <input
                        type="text"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        placeholder="Role"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Points</label>
                    <input
                        type="number"
                        value={newUser.points}
                        onChange={(e) => setNewUser({ ...newUser, points: parseInt(e.target.value, 10) })}
                        placeholder="Points"
                    />
                </div>
                <div className="admin-buttons">
                    <button className="add" onClick={handleAddUser}>
                        Add User
                    </button>
                </div>
            </div>

            {/* Display all users */}
            <h2>Registered Users</h2>
            <div className="admin-user-cards">
                {users.map((user) => (
                    <div key={user.id} className="user-card" onClick={() => setEditingUser(user)}>
                        <div className="user-card-info">
                            {user.profilePictureUrl && (
                                <img
                                    src={user.profilePictureUrl}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="user-card-img-small"
                                />
                            )}
                            <div className="user-card-text">
                                <span className="user-card-name">
                                    {user.firstName} {user.lastName}
                                </span>
                                <br />
                                <span className="user-card-role">{user.role}</span>
                                <br />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit user modal */}
            {editingUser && (
                <>
                    <div className="admin-edit-user-overlay" onClick={handleCloseEditUser}></div>
                    <div className="admin-edit-user">
                        <h2>Edit User</h2>
                        <div className="admin-input-group">
                            <label>Profile Picture</label>
                            <input type="file" onChange={(e) => setProfilePictureEdit(e.target.files[0])} />
                        </div>
                        <div className="admin-input-group">
                            <label>Email</label>
                            <input
                                type="text"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                placeholder="Email"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={editingUser.firstName}
                                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                placeholder="First Name"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={editingUser.lastName}
                                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                placeholder="Last Name"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Class</label>
                            <input
                                type="text"
                                value={editingUser.class}
                                onChange={(e) => setEditingUser({ ...editingUser, class: e.target.value })}
                                placeholder="Class"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Graduation Year</label>
                            <input
                                type="text"
                                value={editingUser.graduationYear}
                                onChange={(e) => setEditingUser({ ...editingUser, graduationYear: e.target.value })}
                                placeholder="Graduation Year"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Family</label>
                            <input
                                type="text"
                                value={editingUser.family}
                                onChange={(e) => setEditingUser({ ...editingUser, family: e.target.value })}
                                placeholder="Family"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Major</label>
                            <input
                                type="text"
                                value={editingUser.major}
                                onChange={(e) => setEditingUser({ ...editingUser, major: e.target.value })}
                                placeholder="Major"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Role</label>
                            <input
                                type="text"
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                placeholder="Role"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Points</label>
                            <input
                                type="number"
                                value={editingUser.points}
                                onChange={(e) =>
                                    setEditingUser({ ...editingUser, points: parseInt(e.target.value, 10) })
                                }
                                placeholder="Points"
                            />
                        </div>
                        <div className="admin-buttons">
                            <button className="close" onClick={handleCloseEditUser}>
                                Close
                            </button>
                            <button className="update" onClick={handleUpdateUser}>
                                Update User
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserManagement;