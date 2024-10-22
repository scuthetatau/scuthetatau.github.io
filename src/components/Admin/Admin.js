import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUserRole } from './auth';
import { fetchUsers, addUser, updateUser } from './userService';
import { fetchGroups, shuffleGroups as shuffleBroGroups } from './groupService';
import { firestore } from '../../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
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
        profilePictureUrl: ''
    });
    const [editingUser, setEditingUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureEdit, setProfilePictureEdit] = useState(null);
    const [groups, setGroups] = useState([]);
    const [targets, setTargets] = useState([]);
    const navigate = useNavigate();

    // Check for correct permission to access this page (take a look at auth.js for more info)
    useEffect(() => {
        console.log("Setting up role check subscription");
        const unsub = checkUserRole(navigate);
        return () => {
            console.log("Cleaning up role check subscription");
            unsub();
        };
    }, [navigate]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            const usersList = await fetchUsers();
            setUsers(usersList);
        };
        fetchAllUsers();
    }, []);

    useEffect(() => {
        const fetchAllGroups = async () => {
            const groupsList = await fetchGroups();
            setGroups(groupsList);
        };
        fetchAllGroups();
    }, []);

    const handleAddUser = async () => {
        try {
            await addUser(newUser, profilePicture);
            setNewUser({ email: '', firstName: '', lastName: '', class: '', graduationYear: '', family: '', major: '', role: '', points: 0, profilePictureUrl: '' });
            setProfilePicture(null);
            alert('User added successfully');
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
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // BroDates
    const handleCloseEditUser = () => {
        setEditingUser(null);
        setProfilePictureEdit(null);
    };

    const shuffleGroups = async () => {
        const groupsList = await shuffleBroGroups();
        setGroups(groupsList);
    };


    // Spoon Assassins
    const assignTargets = async () => {
        if (!users.length) return;
        const shuffledUsers = [...users];
        for (let i = shuffledUsers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledUsers[i], shuffledUsers[j]] = [shuffledUsers[j], shuffledUsers[i]];
        }
        const targets = shuffledUsers.map((user, index) => ({ // Argument user is the user object, argument index is the index of the user in the shuffledUsers array
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            targetId: shuffledUsers[(index + 1) % shuffledUsers.length].id,
            targetName: `${shuffledUsers[(index + 1) % shuffledUsers.length].firstName} ${shuffledUsers[(index + 1) % shuffledUsers.length].lastName}`
        }));

        await Promise.all(targets.map(target =>
            setDoc(doc(firestore, 'targets', target.userId), target) // Set the target document in Firestore
        ));

        setTargets(targets); // Set the targets state to the targets array
    };

    useEffect(() => {
        const fetchTargets = async () => {
            const targetsSnapshot = await getDocs(collection(firestore, 'targets'));
            const targetsList = targetsSnapshot.docs.map(doc => doc.data());
            setTargets(targetsList); // Set the targets state to the targets array
        };
        fetchTargets(); // Fetch targets from Firestore
    }, [users]);

    return (
        <div className="admin-page">
            <h1>Admin Page</h1>

            {/*Add user*/}
            <div className="admin-add-user">
                <h2>Add New User</h2>
                {/* Render input fields for new user details */}
                <div className="admin-input-group">
                    <label>Profile Picture</label>
                    <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                </div>
                <div className="admin-input-group">
                    <label>Email</label>
                    <input type="text" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" />
                </div>
                <div className="admin-input-group">
                    <label>First Name</label>
                    <input type="text" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} placeholder="First Name" />
                </div>
                <div className="admin-input-group">
                    <label>Last Name</label>
                    <input type="text" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} placeholder="Last Name" />
                </div>
                <div className="admin-input-group">
                    <label>Class</label>
                    <input type="text" value={newUser.class} onChange={(e) => setNewUser({ ...newUser, class: e.target.value })} placeholder="Class" />
                </div>
                <div className="admin-input-group">
                    <label>Graduation Year</label>
                    <input type="text" value={newUser.graduationYear} onChange={(e) => setNewUser({ ...newUser, graduationYear: e.target.value })} placeholder="Graduation Year" />
                </div>
                <div className="admin-input-group">
                    <label>Family</label>
                    <input type="text" value={newUser.family} onChange={(e) => setNewUser({ ...newUser, family: e.target.value })} placeholder="Family" />
                </div>
                <div className="admin-input-group">
                    <label>Major</label>
                    <input type="text" value={newUser.major} onChange={(e) => setNewUser({ ...newUser, major: e.target.value })} placeholder="Major" />
                </div>
                <div className="admin-input-group">
                    <label>Role</label>
                    <input type="text" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} placeholder="Role" />
                </div>
                <div className="admin-input-group">
                    <label>Points</label>
                    <input type="number" value={newUser.points} onChange={(e) => setNewUser({ ...newUser, points: parseInt(e.target.value, 10) })} placeholder="Points" />
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
                            <br/>
                            <span className="user-card-role">{user.role}</span>
                            <br/>
                            {user.profilePictureUrl &&
                                <img src={user.profilePictureUrl} alt={`${user.firstName} ${user.lastName}`} width="50" height="50"/>}
                        </div>
                    </div>
                ))}
            </div>

            {/*Edit user*/}
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
                            <input type="text" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} placeholder="Email" />
                        </div>
                        <div className="admin-input-group">
                            <label>First Name</label>
                            <input type="text" value={editingUser.firstName} onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })} placeholder="First Name" />
                        </div>
                        <div className="admin-input-group">
                            <label>Last Name</label>
                            <input type="text" value={editingUser.lastName} onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })} placeholder="Last Name" />
                        </div>
                        <div className="admin-input-group">
                            <label>Class</label>
                            <input type="text" value={editingUser.class} onChange={(e) => setEditingUser({ ...editingUser, class: e.target.value })} placeholder="Class" />
                        </div>
                        <div className="admin-input-group">
                            <label>Graduation Year</label>
                            <input type="text" value={editingUser.graduationYear} onChange={(e) => setEditingUser({ ...editingUser, graduationYear: e.target.value })} placeholder="Graduation Year" />
                        </div>
                        <div className="admin-input-group">
                            <label>Family</label>
                            <input type="text" value={editingUser.family} onChange={(e) => setEditingUser({ ...editingUser, family: e.target.value })} placeholder="Family" />
                        </div>
                        <div className="admin-input-group">
                            <label>Major</label>
                            <input type="text" value={editingUser.major} onChange={(e) => setEditingUser({ ...editingUser, major: e.target.value })} placeholder="Major" />
                        </div>
                        <div className="admin-input-group">
                            <label>Role</label>
                            <input type="text" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} placeholder="Role" />
                        </div>
                        <div className="admin-input-group">
                            <label>Points</label>
                            <input type="number" value={editingUser.points} onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value, 10) })} placeholder="Points"/>
                        </div>
                        <div className="admin-buttons">
                            <button className="close" onClick={handleCloseEditUser}>Close</button>
                            <button className="update" onClick={handleUpdateUser}>Update User</button>
                        </div>
                    </div>
                </>
            )}

            {/*BroDate Groups*/}
            <div className="brodate-groups">
                <h2>Brodate Groups</h2>
                <div className="buttons-container">
                    <button onClick={shuffleGroups}>Create/Reshuffle Groups</button>
                </div>

                <div className="groups-container">
                    {groups.map((group, index) => (
                        <div key={index} className="group brodate-group">
                            <h3>Group {index + 1}</h3>
                            <ul>
                                {group.members.map(member => (
                                    <li key={member.id}>{member.firstName} {member.lastName}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/*Spoon Assassins*/}
            <div className="targets">
                <h2>Spoon Assassins Targets</h2>
                <div className="buttons-container">
                    <button onClick={assignTargets}>Assign Targets</button>
                </div>
                <div className="targets-container">
                    {targets.map(target => (
                        <div key={target.userId} className="target">
                            <strong>{target.firstName} {target.lastName}</strong> has target: {target.targetName}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;