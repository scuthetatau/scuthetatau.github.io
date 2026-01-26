import { getDb } from './_lib/firebaseAdmin';

const executiveBoardRoles = ['Regent', 'Vice Regent', 'Scribe', 'Treasurer', 'Corresponding Secretary'];

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = getDb();
        const snapshot = await db.collection('users').where('role', '!=', '').get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                class: data.class,
                profilePictureUrl: data.profilePictureUrl
            };
        });

        const executiveBoard = users.filter(user => executiveBoardRoles.includes(user.role))
            .sort((a, b) => executiveBoardRoles.indexOf(a.role) - executiveBoardRoles.indexOf(b.role));

        const otherLeadership = users.filter(user => !executiveBoardRoles.includes(user.role) && user.role)
            .sort((a, b) => a.lastName.localeCompare(b.lastName));

        res.status(200).json({
            executiveBoard,
            otherLeadership
        });
    } catch (error) {
        console.error('Error fetching leadership:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
