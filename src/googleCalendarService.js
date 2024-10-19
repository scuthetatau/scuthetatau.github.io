import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const CALENDAR_ID = process.env.REACT_APP_GOOGLE_CALENDAR_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export const initClient = () => {
    return new Promise((resolve, reject) => {
        gapi.load('client:auth2', () => {
            gapi.client
                .init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                    scope: SCOPES,
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
};

export const getUpcomingEvents = () => {
    return gapi.client.calendar.events
        .list({
            calendarId: CALENDAR_ID,
            timeMin: new Date().toISOString(),
            maxResults: 2,
            singleEvents: true,
            orderBy: 'startTime',
        })
        .then((response) => response.result.items)
        .catch((error) => {
            console.error('Error fetching events:', error);
            throw error;
        });
};