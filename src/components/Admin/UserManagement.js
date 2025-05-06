import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../firebase';
import './Admin.css';

const UserManagement = () => {
    // Available roles for the dropdown
    const availableRoles = [
        "Regent",
        "Vice Regent",
        "Treasurer",
        "Scribe",
        "Corresponding Secretary",
        "Brotherhood Chair",
        "Service Chair",
        "Professional Development Chair",
        "Recruitment Chair",
        "Special Events Chair",
        "Engineering Outreach Chair",
        "Academic Chair",
        "Fundraising Chair",
        "Marshall",
        "Social Media Chair",
        "Webmaster",
        "PNME Chair",
        "Historian",
        "Mediation Chair",
        "DEI Chair"
    ];
    
    const availableFamilies = [
        "Filthy Fam",
        "Presibobante Guys",
        "Engh Gang",
        "Clout Fam"
    ];
    
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
        profilePictureUrl: '',
        bigId: '',
        linkedinUrl: ''
    });
    const [editingUser, setEditingUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureEdit, setProfilePictureEdit] = useState(null);
    const [availableBigs, setAvailableBigs] = useState([]);

    const [alumni, setAlumni] = useState([]);
    const [editingAlumni, setEditingAlumni] = useState(null);
    const [newAlumni, setNewAlumni] = useState({
        firstName: '',
        lastName: '',
        graduationYear: '',
        major: '',
        profilePictureUrl: '',
        bigId: '',
        dropped: false,
        family: '',
        linkedinUrl: ''
    });
    const [alumniProfilePicture, setAlumniProfilePicture] = useState(null);
    const [alumniProfilePictureEdit, setAlumniProfilePictureEdit] = useState(null);

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
            newUser.profilePictureUrl = await getDownloadURL(profilePictureRef); // Store the full URL
        }
        await addDoc(collection(firestore, 'users'), newUser); // Firestore handles document ID
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

    // Fetch alumni from Firestore
    const fetchAlumni = async () => {
        const alumniSnapshot = await getDocs(collection(firestore, 'alumni'));
        return alumniSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    // Add a new alumni to Firestore
    const addAlumni = async (newAlumni, alumniProfilePicture) => {
        if (alumniProfilePicture) {
            const profilePictureRef = ref(
                storage,
                `alumniProfilePictures/${new Date().getTime()}_${alumniProfilePicture.name}`
            );
            await uploadBytes(profilePictureRef, alumniProfilePicture);
            newAlumni.profilePictureUrl = await getDownloadURL(profilePictureRef);
        }
        await addDoc(collection(firestore, 'alumni'), newAlumni);
    };

    // Update an existing alumni in Firestore
    const updateAlumni = async (editingAlumni, alumniProfilePictureEdit) => {
        if (alumniProfilePictureEdit) {
            const profilePictureRef = ref(
                storage,
                `alumniProfilePictures/${new Date().getTime()}_${alumniProfilePictureEdit.name}`
            );
            await uploadBytes(profilePictureRef, alumniProfilePictureEdit);
            editingAlumni.profilePictureUrl = await getDownloadURL(profilePictureRef);
        }
        const alumniRef = doc(firestore, 'alumni', editingAlumni.id);
        await updateDoc(alumniRef, editingAlumni);
    };

    // Add this function to fetch available bigs
    const fetchAvailableBigs = async () => {
        const [usersSnapshot, alumniSnapshot] = await Promise.all([
            getDocs(collection(firestore, 'users')),
            getDocs(collection(firestore, 'alumni'))
        ]);
        
        const usersData = usersSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            isAlumni: false 
        }));
        
        const alumniData = alumniSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            isAlumni: true 
        }));

        setAvailableBigs([...usersData, ...alumniData]);
    };

    useEffect(() => {
        const fetchAllData = async () => {
            const usersList = await fetchUsers();
            const alumniList = await fetchAlumni();
            setUsers(usersList);
            setAlumni(alumniList);
        };
        fetchAllData();
        fetchAvailableBigs();
    }, []);

    const handleAddAlumni = async () => {
        try {
            // Validate LinkedIn URL if provided
            if (newAlumni.linkedinUrl && !newAlumni.linkedinUrl.startsWith('https://www.linkedin.com/in/')) {
                alert('LinkedIn URL must start with https://www.linkedin.com/in/');
                return;
            }
            await addAlumni(newAlumni, alumniProfilePicture);
            setNewAlumni({
                firstName: '',
                lastName: '',
                graduationYear: '',
                major: '',
                profilePictureUrl: '',
                bigId: '',
                dropped: false,
                family: '',
                linkedinUrl: ''
            });
            setAlumniProfilePicture(null);
            alert('Alumni added successfully');
            const alumniList = await fetchAlumni();
            setAlumni(alumniList);
        } catch (error) {
            console.error('Error adding alumni:', error);
        }
    };

    const handleUpdateAlumni = async () => {
        if (!editingAlumni) return;
        try {
            // Validate LinkedIn URL if provided
            if (editingAlumni.linkedinUrl && !editingAlumni.linkedinUrl.startsWith('https://www.linkedin.com/in/')) {
                alert('LinkedIn URL must start with https://www.linkedin.com/in/');
                return;
            }
            await updateAlumni(editingAlumni, alumniProfilePictureEdit);
            setEditingAlumni(null);
            setAlumniProfilePictureEdit(null);
            alert('Alumni updated successfully');
            const alumniList = await fetchAlumni();
            setAlumni(alumniList);
        } catch (error) {
            console.error('Error updating alumni:', error);
        }
    };

    const handleCloseEditAlumni = () => {
        setEditingAlumni(null);
        setAlumniProfilePictureEdit(null);
    };


    const handleAddUser = async () => {
        try {
            // Validate LinkedIn URL if provided
            if (newUser.linkedinUrl && !newUser.linkedinUrl.startsWith('https://www.linkedin.com/in/')) {
                alert('LinkedIn URL must start with https://www.linkedin.com/in/');
                return;
            }
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
                profilePictureUrl: '',
                bigId: '',
                linkedinUrl: ''
            });
            setProfilePicture(null);
            alert('User added successfully');
            const usersList = await fetchUsers();
            setUsers(usersList);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            // Validate LinkedIn URL if provided
            if (editingUser.linkedinUrl && !editingUser.linkedinUrl.startsWith('https://www.linkedin.com/in/')) {
                alert('LinkedIn URL must start with https://www.linkedin.com/in/');
                return;
            }
            await updateUser(editingUser, profilePictureEdit);
            setEditingUser(null);
            setProfilePictureEdit(null);
            alert('User updated successfully');
            const usersList = await fetchUsers();
            setUsers(usersList);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const convertToAlumni = async () => {
        if (!editingUser) return;
        
        // Add confirmation prompt
        const confirmed = window.confirm(
            `Are you sure you want to convert ${editingUser.firstName} ${editingUser.lastName} to alumni? This action cannot be undone.`
        );
        
        if (!confirmed) return;
        
        try {
            // Create alumni object from user data
            const alumniData = {
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                graduationYear: editingUser.graduationYear,
                major: editingUser.major,
                profilePictureUrl: editingUser.profilePictureUrl,
                bigId: editingUser.bigId,
                dropped: false
            };

            // Add to alumni collection
            await addAlumni(alumniData, null); // null for profile picture since we're reusing the URL

            // Delete from users collection
            const userRef = doc(firestore, 'users', editingUser.id);
            await deleteDoc(userRef);

            // Update state
            setEditingUser(null);
            setProfilePictureEdit(null);
            alert('User converted to alumni successfully');
            
            // Refresh both lists
            const [usersList, alumniList] = await Promise.all([
                fetchUsers(),
                fetchAlumni()
            ]);
            setUsers(usersList);
            setAlumni(alumniList);
        } catch (error) {
            console.error('Error converting user to alumni:', error);
            alert('Error converting user to alumni');
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
                    <select
                        value={newUser.family}
                        onChange={(e) => setNewUser({ ...newUser, family: e.target.value })}
                    >
                        <option value="">Select a Family</option>
                        {availableFamilies.map((family, index) => (
                            <option key={index} value={family}>
                                {family}
                            </option>
                        ))}
                    </select>
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
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="">No Role</option>
                        {availableRoles.map((role, index) => (
                            <option key={index} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
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
                <div className="admin-input-group">
                    <label>LinkedIn URL</label>
                    <input
                        type="text"
                        value={newUser.linkedinUrl}
                        onChange={(e) => setNewUser({ ...newUser, linkedinUrl: e.target.value })}
                        placeholder="https://www.linkedin.com/in/username"
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
                            <select
                                value={editingUser.family}
                                onChange={(e) => setEditingUser({ ...editingUser, family: e.target.value })}
                            >
                                <option value="">Select a Family</option>
                                {availableFamilies.map((family, index) => (
                                    <option key={index} value={family}>
                                        {family}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-input-group">
                            <label>Big Brother:</label>
                            <select
                                value={editingUser.bigId || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, bigId: e.target.value })}
                                className="admin-select"
                            >
                                <option value="">Select a Big Brother</option>
                                {availableBigs
                                    .filter(member => member.id !== editingUser.id) // Don't allow self-selection
                                    .map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.firstName} {member.lastName}
                                            {member.isAlumni ? ' (Alumni)' : ''}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="admin-input-group">
                            <label>Role</label>
                            <select
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                            >
                                <option value="">No Role</option>
                                {availableRoles.map((role, index) => (
                                    <option key={index} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
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
                        <div className="admin-input-group">
                            <label>LinkedIn URL</label>
                            <input
                                type="text"
                                value={editingUser.linkedinUrl || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, linkedinUrl: e.target.value })}
                                placeholder="https://www.linkedin.com/in/username"
                            />
                        </div>
                        <div className="admin-buttons">
                            <button className="close" onClick={handleCloseEditUser}>
                                Close
                            </button>
                            <button className="convert" onClick={convertToAlumni}>
                                Convert to Alumni
                            </button>
                            <button className="update" onClick={handleUpdateUser}>
                                Update User
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="admin-add-user">
                <h2>Add New Alumni</h2>
                <div className="admin-input-group">
                    <label>Profile Picture</label>
                    <input type="file" onChange={(e) => setAlumniProfilePicture(e.target.files[0])} />
                </div>
                <div className="admin-input-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={newAlumni.firstName}
                        onChange={(e) => setNewAlumni({ ...newAlumni, firstName: e.target.value })}
                        placeholder="First Name"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={newAlumni.lastName}
                        onChange={(e) => setNewAlumni({ ...newAlumni, lastName: e.target.value })}
                        placeholder="Last Name"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Graduation Year</label>
                    <input
                        type="text"
                        value={newAlumni.graduationYear}
                        onChange={(e) => setNewAlumni({ ...newAlumni, graduationYear: e.target.value })}
                        placeholder="Graduation Year"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Major</label>
                    <input
                        type="text"
                        value={newAlumni.major}
                        onChange={(e) => setNewAlumni({ ...newAlumni, major: e.target.value })}
                        placeholder="Major"
                    />
                </div>
                <div className="admin-input-group">
                    <label>Family</label>
                    <select
                        value={newAlumni.family}
                        onChange={(e) => setNewAlumni({ ...newAlumni, family: e.target.value })}
                    >
                        <option value="">Select a Family</option>
                        {availableFamilies.map((family, index) => (
                            <option key={index} value={family}>
                                {family}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="admin-input-group">
                    <label>Dropped</label>
                    <input
                        type="checkbox"
                        checked={newAlumni.dropped}
                        onChange={(e) => setNewAlumni({ ...newAlumni, dropped: e.target.checked })}
                    />
                </div>
                <div className="admin-input-group">
                    <label>Big Brother:</label>
                    <select
                        value={newAlumni.bigId || ''}
                        onChange={(e) => setNewAlumni({ ...newAlumni, bigId: e.target.value })}
                        className="admin-select"
                    >
                        <option value="">Select a Big Brother</option>
                        {availableBigs.map(member => (
                            <option key={member.id} value={member.id}>
                                {member.firstName} {member.lastName}
                                {member.isAlumni ? ' (Alumni)' : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="admin-input-group">
                    <label>LinkedIn URL:</label>
                    <input
                        type="text"
                        value={newAlumni.linkedinUrl || ''}
                        onChange={(e) => setNewAlumni({ ...newAlumni, linkedinUrl: e.target.value })}
                        placeholder="https://www.linkedin.com/in/username"
                    />
                </div>
                <div className="admin-buttons">
                    <button className="add" onClick={handleAddAlumni}>
                        Add Alumni
                    </button>
                </div>
            </div>

            {/* Display all alumni */}
            <h2>Alumni</h2>
            <div className="admin-user-cards">
                {alumni.map((alum) => (
                    <div key={alum.id} className="user-card" onClick={() => setEditingAlumni(alum)}>
                        <div className="user-card-info">
                            {alum.profilePictureUrl && (
                                <img
                                    src={alum.profilePictureUrl}
                                    alt={`${alum.firstName} ${alum.lastName}`}
                                    className="user-card-img-small"
                                />
                            )}
                            <div className="user-card-text">
                                <span className="user-card-name">
                                    {alum.firstName} {alum.lastName}
                                </span>
                                <br />
                                <span className="user-card-role">{alum.graduationYear}</span>
                                <br />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit alumni modal */}
            {editingAlumni && (
                <>
                    <div className="admin-edit-user-overlay" onClick={handleCloseEditAlumni}></div>
                    <div className="admin-edit-user">
                        <h2>Edit Alumni</h2>
                        <div className="admin-input-group">
                            <label>Profile Picture</label>
                            <input type="file" onChange={(e) => setAlumniProfilePictureEdit(e.target.files[0])} />
                        </div>
                        <div className="admin-input-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={editingAlumni.firstName}
                                onChange={(e) =>
                                    setEditingAlumni({ ...editingAlumni, firstName: e.target.value })
                                }
                                placeholder="First Name"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={editingAlumni.lastName}
                                onChange={(e) =>
                                    setEditingAlumni({ ...editingAlumni, lastName: e.target.value })
                                }
                                placeholder="Last Name"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Graduation Year</label>
                            <input
                                type="text"
                                value={editingAlumni.graduationYear}
                                onChange={(e) =>
                                    setEditingAlumni({ ...editingAlumni, graduationYear: e.target.value })
                                }
                                placeholder="Graduation Year"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Major</label>
                            <input
                                type="text"
                                value={editingAlumni.major}
                                onChange={(e) => setEditingAlumni({ ...editingAlumni, major: e.target.value })}
                                placeholder="Major"
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Family</label>
                            <select
                                value={editingAlumni.family}
                                onChange={(e) => setEditingAlumni({ ...editingAlumni, family: e.target.value })}
                            >
                                <option value="">Select a Family</option>
                                {availableFamilies.map((family, index) => (
                                    <option key={index} value={family}>
                                        {family}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-input-group">
                            <label>Dropped</label>
                            <input
                                type="checkbox"
                                checked={editingAlumni.dropped}
                                onChange={(e) => setEditingAlumni({ ...editingAlumni, dropped: e.target.checked })}
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>Big Brother:</label>
                            <select
                                value={editingAlumni.bigId || ''}
                                onChange={(e) => setEditingAlumni({ ...editingAlumni, bigId: e.target.value })}
                                className="admin-select"
                            >
                                <option value="">Select a Big Brother</option>
                                {availableBigs
                                    .filter(member => member.id !== editingAlumni.id) // Don't allow self-selection
                                    .map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.firstName} {member.lastName}
                                            {member.isAlumni ? ' (Alumni)' : ''}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="admin-input-group">
                            <label>LinkedIn URL:</label>
                            <input
                                type="text"
                                value={editingAlumni.linkedinUrl || ''}
                                onChange={(e) => setEditingAlumni({ ...editingAlumni, linkedinUrl: e.target.value })}
                                placeholder="https://www.linkedin.com/in/username"
                            />
                        </div>
                        <div className="admin-buttons">
                            <button className="close" onClick={handleCloseEditAlumni}>
                                Close
                            </button>
                            <button className="update" onClick={handleUpdateAlumni}>
                                Update Alumni
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserManagement;