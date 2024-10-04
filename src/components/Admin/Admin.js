import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from '../../firebase';
import './Admin.css';

const Admin = () => {
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
        profilePictureUrl: '' // Add this field
    });
    const [editingUser, setEditingUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null); // New state for file
    const [profilePictureEdit, setProfilePictureEdit] = useState(null); // New state for editing file
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.role !== 'Webmaster') {
                        navigate('/'); // Redirect non-Webmasters to the home page
                    }
                } else {
                    navigate('/'); // Redirect if user document does not exist
                }
            } else {
                navigate('/'); // Redirect not logged in users to the home page
            }
        });

        return () => unsub();
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(firestore, 'users'));
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (profilePicture) {
            const profilePictureRef = ref(storage, `profilePictures/${new Date().getTime()}_${profilePicture.name}`);
            await uploadBytes(profilePictureRef, profilePicture);
            const profilePictureUrl = await getDownloadURL(profilePictureRef);
            newUser.profilePictureUrl = profilePictureUrl;
        }

        try {
            await addDoc(collection(firestore, 'users'), newUser);
            setNewUser({ email: '', firstName: '', lastName: '', class: '', graduationYear: '', family: '', major: '', role: '', points: 0, profilePictureUrl: '' });
            setProfilePicture(null); // Reset the file input
            alert('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;

        if (profilePictureEdit) {
            const profilePictureRef = ref(storage, `profilePictures/${new Date().getTime()}_${profilePictureEdit.name}`);
            await uploadBytes(profilePictureRef, profilePictureEdit);
            const profilePictureUrl = await getDownloadURL(profilePictureRef);
            editingUser.profilePictureUrl = profilePictureUrl;
        }

        const userRef = doc(firestore, 'users', editingUser.id);
        await updateDoc(userRef, editingUser);
        setEditingUser(null);
        setProfilePictureEdit(null); // Reset the file input
        alert('User updated successfully');
    };

    const handleCloseEditUser = () => {
        setEditingUser(null);
        setProfilePictureEdit(null);
    }

    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <div className="admin-add-user">
                <h2>Add New User</h2>
                {/* Add Input for Profile Picture */}
                <div className="admin-input-group">
                    <label>Profile Picture</label>
                    <input
                        type="file"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </div>
                {/* Other input fields unchanged */}
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
                    <button className="add" onClick={handleAddUser}>Add User</button>
                </div>
            </div>

            <h2>Registered Users</h2>
            <div className="admin-user-cards">
                {users.map(user => (
                    <div key={user.id} className="user-card" onClick={() => setEditingUser(user)}>
                        <div className="user-card-info">
                            <span className="user-card-name">{user.firstName} {user.lastName}</span>
                            <span className="user-card-role">{user.role}</span>
                            {user.profilePictureUrl && <img src={user.profilePictureUrl} alt={`${user.firstName} ${user.lastName}`} width="50" height="50" />}
                        </div>
                    </div>
                ))}
            </div>

            {editingUser && (
                <>
                    <div className="admin-edit-user-overlay" onClick={handleCloseEditUser}></div>
                    <div className="admin-edit-user">
                        <h2>Edit User</h2>
                        {/* Add Input for Profile Picture */}
                        <div className="admin-input-group">
                            <label>Profile Picture</label>
                            <input
                                type="file"
                                onChange={(e) => setProfilePictureEdit(e.target.files[0])}
                            />
                        </div>
                        {/* Other input fields unchanged */}
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
                                onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value, 10) })}
                                placeholder="Points"
                            />
                        </div>
                        <div className="admin-buttons">
                            <button className="close" onClick={handleCloseEditUser}>Close</button>
                            <button className="update" onClick={handleUpdateUser}>Update User</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Admin;