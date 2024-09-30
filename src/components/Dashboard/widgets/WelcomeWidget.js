import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WelcomeWidget.css';

const WelcomeWidget = ({
                           userDetails,
                           setShowEditProfile,
                           showEditProfile,
                           setUserDetails,
                           setUpdateInfo,
                           setSelectedFile,
                           setIsSuccess,
                           setError,
                           setBroDateGroups,
                           updateInfo,
                           isSuccess,
                           error,
                           selectedFile
                       }) => {
    const fetchUserDetails = async (token) => {
        try {
            const response = await axios.get('http://localhost:5001/api/user-info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const userData = response.data;
            setUserDetails(userData);
            setUpdateInfo({
                firstName: userData.firstName,
                lastName: userData.lastName,
                graduationYear: userData.graduationYear || '',
                family: userData.family || '',
                class: userData.class || '',
                role: userData.role || '',
                profilePic: userData.profilePic,
                points: userData.points || 0,
                major: userData.major || ''
            });
            localStorage.setItem('firstName', userData.firstName);
            localStorage.setItem('email', userData.email);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpdateProfilePicture = async () => {
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('profilePic', selectedFile);
                const email = userDetails.email;
                const token = localStorage.getItem('token');
                await axios.post(`http://localhost:5001/api/upload-profile-pic/${email}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                fetchUserDetails(token);
            } catch (error) {
                setIsSuccess(false);
                setError('Failed to upload profile picture');
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            const updatedUserInfo = {
                email,
                firstName: updateInfo.firstName,
                lastName: updateInfo.lastName,
                graduationYear: updateInfo.graduationYear,
                family: updateInfo.family,
                class: updateInfo.class,
                role: userDetails.role,
                points: userDetails.points,
                profilePic: userDetails.profilePic,
                major: updateInfo.major
            };

            await axios.put('http://localhost:5001/api/update-user', updatedUserInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (selectedFile) {
                await handleUpdateProfilePicture();
            }

            fetchUserDetails(token);
            setIsSuccess(true);
        } catch (error) {
            setIsSuccess(false);
            setError('Failed to update profile');
            console.error('Error updating user profile:', error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            window.history.replaceState({}, document.title, "/dashboard");
            fetchUserDetails(token);
        } else {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                fetchUserDetails(savedToken);
            }
        }
    }, []);

    return (
        <div className="left-widget">
            {userDetails.profilePic && (
                <div className="dashboard_profile-picture">
                    <img
                        src={`http://localhost:5001/${userDetails.profilePic}`}
                        alt="Profile"
                    />
                </div>
            )}
            <h1>Welcome, {userDetails.firstName}!</h1>
            <p>Graduation Year: {userDetails.graduationYear}</p>
            <p>Family: {userDetails.family}</p>
            <p>Class: {userDetails.class}</p>
            {userDetails.role && <p>Role: {userDetails.role}</p>}
            <p>Major: {userDetails.major}</p>
            <button onClick={() => setShowEditProfile(true)}>Edit Profile</button>
            {showEditProfile && (
                <>
                    <div className="overlay" onClick={() => setShowEditProfile(false)}></div>
                    <div className="edit-popup">
                        <form onSubmit={handleUpdate}>
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
                                <label>Upload Profile Picture:
                                    <input type="file" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowEditProfile(false)}>Close</button>
                                <button type="submit">Update Profile</button>
                            </div>
                            {isSuccess && <p className="success-message">Profile updated successfully!</p>}
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default WelcomeWidget;