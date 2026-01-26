import { db } from '../_lib/firebaseAdmin';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { role } = req.query;

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    try {
        // Convert role to Title Case or exact match based on how they are stored
        // e.g. "regent" -> "Regent"
        const formattedRole = role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

        const snapshot = await db.collection('users')
            .where('role', '==', formattedRole)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ error: `No users found with role: ${formattedRole}` });
        }

        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                class: data.class,
                profilePictureUrl: data.profilePictureUrl,
                linkedinUrl: data.linkedinUrl
            };
        });

        res.status(200).json(users);
    } catch (error) {
        console.error(`Error fetching users for role ${role}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
