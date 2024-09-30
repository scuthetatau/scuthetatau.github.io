// src/pages/Events.js

import React from 'react';
import './Events.css';
import RetreatImage from '../assets/Retreat2024.jpeg';
import BigLittleRevealImage from '../assets/BigLittleReveal.JPG';
import ServiceEventImage from '../assets/ServiceEvent.JPG';
import BeachEventImage from '../assets/Bonfire.jpeg';

const Events = () => {
    return (
        <div className="events">
            <header className="events-hero" style={{backgroundImage: `url(${RetreatImage})`}}>
                <h1 className="events-title">THETA TAU EVENTS</h1>
            </header>

            <section className="event-section">
                <div className="event-content">
                    <div className="event-text">
                        <h2>Retreat</h2>
                        <p>Join us for our annual retreat where brothers bond and plan for the year ahead.</p>
                    </div>
                    <img src={RetreatImage} alt="Retreat" className="event-image"/>
                </div>
            </section>

            <section className="event-section">
                <div className="event-content reverse">
                    <div className="event-text">
                        <h2>Big Little Reveal</h2>
                        <p>One of the most anticipated events, where new members are paired with their big brothers.</p>
                    </div>
                    <img src={BigLittleRevealImage} alt="Big Little Reveal" className="event-image"/>
                </div>
            </section>

            <section className="event-section">
                <div className="event-content">
                    <div className="event-text">
                        <h2>Service Event</h2>
                        <p>Giving back to the community through a variety of service projects and outreach events.</p>
                    </div>
                    <img src={ServiceEventImage} alt="Service Event" className="event-image"/>
                </div>
            </section>

            <section className="event-section">
                <div className="event-content reverse">
                    <div className="event-text">
                        <h2>Beach Events</h2>
                        <p>Enjoying the sun and sand with brothers, partaking in beach games and bonfires.</p>
                    </div>
                    <img src={BeachEventImage} alt="Beach Events" className="event-image"/>
                </div>
            </section>
        </div>
    );
};

export default Events;