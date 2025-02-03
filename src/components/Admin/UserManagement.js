import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { firestore, storage } from '../../firebase';
import './Admin.css';
import { checkUserRole } from './auth'; // Assuming auth utility contains checkUserRole

const UserManagement = () => {
    const navigate = useNavigate(); // Initialize navigate function
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

    const [alumni, setAlumni] = useState([]);
    const [editingAlumni, setEditingAlumni] = useState(null);
    const [newAlumni, setNewAlumni] = useState({
        firstName: '',
        lastName: '',
        graduationYear: '',
        major: '',
        profilePictureUrl: '',
    });
    const [alumniProfilePicture, setAlumniProfilePicture] = useState(null);
    const [alumniProfilePictureEdit, setAlumniProfilePictureEdit] = useState(null);

    // Verify user role on load
    useEffect(() => {
        const unsubscribe = checkUserRole(navigate); // Invoke role check with navigation
        return () => unsubscribe && unsubscribe();  // Ensure cleanup of listener
    }, [navigate]);

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

    useEffect(() => {
        const fetchAllData = async () => {
            const usersList = await fetchUsers();
            const alumniList = await fetchAlumni();
            setUsers(usersList);
            setAlumni(alumniList);
        };
        fetchAllData();
    }, []);

    return (
        <div className="admin-page">
            <h1>User Management</h1>
            {/* Remaining UI and user management functionality */}
        </div>
    );
};

export default UserManagement;