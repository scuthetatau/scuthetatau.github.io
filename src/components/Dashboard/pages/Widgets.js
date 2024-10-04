import React, { useEffect, useState } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import axios from 'axios';

const Widgets = ({ user }) => {
    const [nextEvent, setNextEvent] = useState(null);
    const calendarId = 'scu.edu_lp25g1bf8lk73r0nvrkalgm140@group.calendar.google.com';
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual Google API key

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&orderBy=startTime&timeMin=${new Date().toISOString()}`
                );
                const events = response.data.items;
                if (events.length > 0) {
                    setNextEvent(events[0]);
                }
            } catch (error) {
                console.error('Error fetching events from Google Calendar:', error);
            }
        };

        fetchNextEvent();
    }, [calendarId, apiKey]);

    const maxPoints = 2000;
    const currentPoints = user ? user.points : 0;

    return (
        <div className="widget-container">
            {/* Points Widget */}
            <div className="widget">
                <h3>Your Points</h3>
                <ReactSpeedometer
                    maxValue={maxPoints}
                    value={currentPoints}
                    needleColor="white"
                    startColor="darkred"
                    endColor="darkred"
                    segments={5}
                    currentValueText={`${currentPoints} Points`}
                />
            </div>

            {/* Upcoming Event Widget */}
            <div className="widget upcoming-event-widget">
                <h3>Upcoming Event</h3>
                {nextEvent ? (
                    <div>
                        <p>{nextEvent.summary}</p>
                        <p>{new Date(nextEvent.start.dateTime).toLocaleString()}</p>
                    </div>
                ) : (
                    <p>No upcoming events.</p>
                )}
            </div>

            {/* Placeholder Widgets */}
            <div className="widget placeholder-widget">
                <h3>Placeholder Widget 1</h3>
            </div>
            <div className="widget placeholder-widget">
                <h3>Placeholder Widget 2</h3>
            </div>
        </div>
    );
};

export default Widgets;
