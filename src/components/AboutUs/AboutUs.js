// src/pages/AboutUs.js

import React from 'react';
import './AboutUs.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import ZetaClass from '../assets/ZetaClass.png'; // Import the image

const events = [
    { date: '1904-10-15', title: 'Founding of Theta Tau', description: 'Theta Tau was founded at the University of Minnesota.' },
    { date: '1920', title: 'Expansion', description: 'Theta Tau began to expand to multiple universities across the United States.' },
    { date: '1960', title: 'Continued Growth', description: 'Theta Tau continued to grow and develop, establishing chapters nationwide.' },
    { date: '2020', title: 'Chapter at Santa Clara University', description: 'The Upsilon Epsilon Chapter of Theta Tau was established at Santa Clara University.' },
];

const AboutUs = () => {
    return (
        <div className="about-us">
            <header className="hero" style={{backgroundImage: `url(${ZetaClass})`}}>
                <h1 className="title">ABOUT THETA TAU</h1>
                <h2 className="subtitle">UPSILON EPSILON CHAPTER</h2>
            </header>

            <section className="history">
                <h2>Our History</h2>
                <p>Theta Tau is the nation's largest and oldest professional co-ed engineering fraternity. Our
                    fraternity was founded on October 15, 1904, at the University of Minnesota.</p>
                <p>Throughout the years, Theta Tau has grown significantly. The fraternity started expanding to other
                    universities in 1920 and continued to grow stronger over the decades. In 2023, the Upsilon Epsilon
                    Chapter of Theta Tau was established at Santa Clara University, providing a community for students
                    driven by engineering excellence and camaraderie.</p>
            </section>

            <section className="interactive-timeline">
                <h2>Our Timeline</h2>
                <VerticalTimeline>
                    {events.map((event, idx) => (
                        <VerticalTimelineElement
                            key={idx}
                            date={event.date}
                            iconStyle={{background: 'rgb(189,29,29)', color: '#fff'}}
                            icon={<i className="fas fa-history"></i>}
                        >
                            <h3 className="vertical-timeline-element-title">{event.title}</h3>
                            <p>{event.description}</p>
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
            </section>

            <section className="mission">
                <h2>The Theta Tau Mission</h2>
                <p>Founded at the University of Minnesota in 1904, Theta Tau is the nation's oldest and foremost
                    Fraternity for Engineers. Over 30,000 have been initiated over the years. With emphasis on quality
                    and a strong fraternal bond, the fraternity has chapters only at ABET accredited schools. Theta Tau
                    carefully follows a program in the selection and development of its members that stresses the
                    importance of high professional ethics and exemplary practices.
                </p>
                <p>Within each chapter, the Fraternity stimulates professional activity and social compatibility;
                    provides a framework for group participation in campus, community, engineering, and fraternity
                    affairs; and promotes lasting friendships - a lifetime of brotherhood in an engineering environment.
                    Through national conferences and conventions, there is an annual opportunity to associate with
                    fraternity brothers (students and alumni) from chapters across the nation.
                </p>
                <p>We are always looking for motivated, ambitious, and energetic engineering students that are
                    interested in building friendships, improving their professional lives, and becoming the strong
                    foundation upon which the fraternity is built. Are you the person we are looking for?
                </p>
                <p>Learn more about Theta Tau as a larger organization.</p>
            </section>

        </div>
    );
};

export default AboutUs;