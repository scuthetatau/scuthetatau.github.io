import { getDb } from './_lib/firebaseAdmin';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = getDb();
        const snapshot = await db.collection('users').orderBy('lastName').get();
        const brothers = snapshot.docs.map(doc => {
            const data = doc.data();
            // Only return public information
            return {
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                class: data.class,
                major: data.major,
                graduationYear: data.graduationYear,
                profilePictureUrl: data.profilePictureUrl,
                linkedinUrl: data.linkedinUrl
            };
        });

        res.status(200).json(brothers);
    } catch (error) {
        console.error('Error fetching brothers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
