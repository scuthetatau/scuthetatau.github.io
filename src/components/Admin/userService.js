import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../firebase';

export const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUser = async (newUser, profilePicture) => {
    if (profilePicture) {
        const profilePictureRef = ref(storage, `profilePictures/${new Date().getTime()}_${profilePicture.name}`);
        await uploadBytes(profilePictureRef, profilePicture);
        newUser.profilePictureUrl = await getDownloadURL(profilePictureRef);
    }
    await addDoc(collection(firestore, 'users'), newUser);
};

export const updateUser = async (editingUser, profilePictureEdit) => {
    if (profilePictureEdit) {
        const profilePictureRef = ref(storage, `profilePictures/${new Date().getTime()}_${profilePictureEdit.name}`);
        await uploadBytes(profilePictureRef, profilePictureEdit);
        editingUser.profilePictureUrl = await getDownloadURL(profilePictureRef);
    }
    const userRef = doc(firestore, 'users', editingUser.id);
    await updateDoc(userRef, editingUser);
};