import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

export const fetchGroups = async () => {
    const groupsSnapshot = await getDocs(collection(firestore, 'brodates'));
    return groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const shuffleGroups = async () => {
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    const userList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const shuffledUsers = userList.sort(() => 0.5 - Math.random());
    const newGroups = [];
    let remainingUsers = shuffledUsers.length;
    let groupSize = 4;

    while (remainingUsers > 0) {
        if (remainingUsers % 5 === 0) {
            groupSize = 5;
        } else if (remainingUsers < 4) {
            groupSize = remainingUsers;
        } else {
            groupSize = 4;
        }
        newGroups.push(shuffledUsers.splice(0, groupSize));
        remainingUsers -= groupSize;
    }
    const brodatesSnapshot = await getDocs(collection(firestore, 'brodates'));
    brodatesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });
    for (const group of newGroups) {
        await addDoc(collection(firestore, 'brodates'), { members: group });
    }
    return fetchGroups();
};