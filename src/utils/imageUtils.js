import { storage } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';

const GOOGLE_PHOTO_PREFIX = 'https://lh3.googleusercontent.com/';
const profileUrlCache = new Map();

/**
 * Gets the profile picture URL, using a cache to minimize Firebase Storage calls.
 * @param {string} storagePath - The path in Firebase Storage (or a full URL).
 * @param {string} fallbackUrl - The fallback URL to use if fetching fails or no storagePath is provided.
 * @returns {Promise<string>} The profile picture URL.
 */
export const getProfilePictureUrl = async (storagePath, fallbackUrl) => {
    if (!storagePath) {
        return fallbackUrl;
    }

    // Return cached URL if available
    if (profileUrlCache.has(storagePath)) {
        return profileUrlCache.get(storagePath);
    }

    let profilePicUrl = storagePath;

    if (profilePicUrl && !profilePicUrl.startsWith(GOOGLE_PHOTO_PREFIX)) {
        try {
            const fileRef = ref(storage, profilePicUrl);
            profilePicUrl = await getDownloadURL(fileRef);
            // Cache for future use
            profileUrlCache.set(storagePath, profilePicUrl);
        } catch (error) {
            console.error(`Error getting profile picture URL for path ${storagePath}:`, error);
            profilePicUrl = fallbackUrl;
        }
    } else if (!profilePicUrl) {
        profilePicUrl = fallbackUrl;
    }

    return profilePicUrl;
};
