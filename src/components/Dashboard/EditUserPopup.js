import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase';
import '../Admin/Admin.css'; // Reusing Admin.css for the popup styling

const EditUserPopup = ({ user, onClose }) => {
    const [updatedUser, setUpdatedUser] = useState(user);
    const [profilePictureEdit, setProfilePictureEdit] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        // Validate LinkedIn URL before saving
        if (updatedUser.linkedinUrl && !updatedUser.linkedinUrl.startsWith('https://www.linkedin.com/in/')) {
            alert('LinkedIn URL must start with https://www.linkedin.com/in/');
            return;
        }

        if (profilePictureEdit) {
            const profilePictureRef = ref(storage, `profilePictures/${new Date().getTime()}_${profilePictureEdit.name}`);
            await uploadBytes(profilePictureRef, profilePictureEdit);
            updatedUser.profilePictureUrl = await getDownloadURL(profilePictureRef);
        }

        const userRef = doc(firestore, 'users', updatedUser.id);
        await updateDoc(userRef, updatedUser);
        onClose(); // Close the popup after saving
    };

    return (
        <div className="admin-edit-user-overlay">
            <div className="admin-edit-user">
                <h2>Edit User Profile</h2>
                <div className="admin-input-group">
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        onChange={(e) => setProfilePictureEdit(e.target.files[0])}
                    />
                </div>
                <div className="admin-input-group">
                    <label>First Name:</label>
                    <input
                        name="firstName"
                        value={updatedUser.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="admin-input-group">
                    <label>Last Name:</label>
                    <input
                        name="lastName"
                        value={updatedUser.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="admin-input-group">
                    <label>Major:</label>
                    <input
                        name="major"
                        value={updatedUser.major}
                        onChange={handleChange}
                    />
                </div>
                <div className="admin-input-group">
                    <label>Class:</label>
                    <input
                        name="class"
                        value={updatedUser.class}
                        onChange={handleChange}
                    />
                </div>
                <div className="admin-input-group">
                    <label>Graduation Year:</label>
                    <input
                        name="graduationYear"
                        value={updatedUser.graduationYear}
                        onChange={handleChange}
                    />
                </div>
                <div className="admin-input-group">
                    <label>Family:</label>
                    <select
                        name="family"
                        value={updatedUser.family}
                        onChange={handleChange}
                    >
                        <option value="Filthy Fam">Filthy Fam</option>
                        <option value="Presibobante Guys">Presibobante Guys</option>
                        <option value="Engh Gang">Engh Gang</option>
                        <option value="Clout Fam">Clout Fam</option>
                    </select>
                </div>
                <div className="admin-input-group">
                    <label>LinkedIn URL:</label>
                    <input
                        name="linkedinUrl"
                        value={updatedUser.linkedinUrl || ''}
                        onChange={handleChange}
                        placeholder="https://www.linkedin.com/in/username"
                    />
                </div>
                <div className="admin-buttons">
                    <button className="close" onClick={onClose}>Cancel</button>
                    <button className="update" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditUserPopup;