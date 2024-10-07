import React, { useState, useEffect } from 'react';
import './Rush.css'; // Import the CSS file
import backgroundImage from '../assets/ThetaClassInitiation.png'; // Update with the correct path to your image

const Rush = () => {
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const countdownDate = new Date('Jan 1, 2025 00:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = countdownDate - now;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="rush-container">
            <div
                className="hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '91.7vh',
                    // position: 'relative',
                }}
            >
                <div className="content">
                    <h1 className="rush-hero-title">Winter Rush 2025</h1>
                    <h2 className="rush-subtitle">Countdown to Rush</h2>
                    <div className="rush-countdown">
                        <span>{timeLeft.days} days</span> |
                        <span>{timeLeft.hours} hours</span> |
                        <span>{timeLeft.minutes} minutes</span> |
                        <span>{timeLeft.seconds} seconds</span>
                    </div>
                    <button
                        className="interest-btn"
                        onClick={() => window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSftXGQoQa-2I0ANqTsVRYeHeK1s9qK0a8mWzjULW8zO0f9kEQ/viewform?usp=sf_link'}
                    >
                        INTEREST FORM
                    </button>
                </div>
            </div>

            <div className="rush-section">
                <div className="rush-title">What is Rush?</div>
                <p className="rush-description">
                Rush is a series of events designed to introduce potential new members to the fraternity. During
                    Rush,
                    you will have the opportunity to meet current fraternity members, learn about our values, and get a
                    sense of what life in Theta Tau is like. It's a great way to find out if our brotherhood is the
                    right
                    fit for you, and for us to get to know you better as well.
                </p>

                <div className="rush-timeline">
                    <div className="rush-header">Rush 2025</div>

                    <div className="rush-event">
                        <div className="rush-date">January 10<br/>7:00 PM</div>
                        <div className="rush-details">
                            <div className="rush-event-title">Theta Tau Info Night</div>
                            <div className="rush-event-location">Daly 207</div>
                            <div className="rush-event-desc">Learn about what Theta Tau has to offer.</div>
                        </div>
                    </div>

                    <div className="rush-event">
                        <div className="rush-date">January 11<br/>7:00 PM</div>
                        <div className="rush-details">
                            <div className="rush-event-title">Meet the Actives</div>
                            <div className="rush-event-location">Vari 129</div>
                            <div className="rush-event-desc">Chat with actives blah blah.</div>
                        </div>
                    </div>

                    <div className="rush-event">
                        <div className="rush-date">January 12<br/>5:30 PM</div>
                        <div className="rush-details">
                            <div className="rush-event-title">Innovation Night</div>
                            <div className="rush-event-location">Locatelli</div>
                            <div className="rush-event-desc">Engage with peers and show skills, etc.</div>
                        </div>
                    </div>

                    <div className="rush-event">
                        <div className="rush-date">January 17 - 23<br/>TBD</div>
                        <div className="rush-details">
                            <div className="rush-event-title">Coffee Chats</div>
                            <div className="rush-event-location">TBD</div>
                            <div className="rush-event-desc">Invite Only</div>
                        </div>
                    </div>
                </div>

                <hr className="divider-line"/>

            </div>
        </div>
    );
};

export default Rush;