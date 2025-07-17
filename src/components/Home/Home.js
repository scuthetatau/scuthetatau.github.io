import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import backgroundImage from '../assets/HomePage_Hero.png'; // Replace with the correct image path
import regentImage from '../assets/regent.jpeg'; // Replace with the correct image path
// import thetaClass from '../assets/ThetaClassInitiation.png'; // Import the image here
import ChapterPhoto from '../assets/ChapterPhoto.jpeg'; // Import the image here

const Home = () => {
    return (
        <>
            <div
                className="hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh',
                    position: 'relative',
                }}
            >
                <div className="content">
                    <h3 className="subheading">Santa Clara University</h3>
                    <h1 className="BIG-title">THETA TAU</h1>
                    <h2 className="chapter">Upsilon Epsilon Chapter</h2>
                    <p className="description">Co-Ed Professional Engineering Fraternity</p>
                    <button
                        className="rush-btn"
                        onClick={() => window.location.href = '/rush'}
                    >
                        RUSH
                    </button>
                </div>
            </div>

            {/*<div className="rush-highlight-section">*/}
            {/*    <div className="rush-highlight-content">*/}
            {/*        <h2 className="rush-highlight-title">Rush Week is Here!</h2>*/}
            {/*        <p className="rush-highlight-text">*/}
            {/*            Don’t miss out on this exciting opportunity to join Theta Tau! Fill out*/}
            {/*            the RSVP form and be part of our amazing community.*/}
            {/*        </p>*/}
            {/*        <button*/}
            {/*            className="rush-btn"*/}
            {/*            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSddcxPgVoKzHPi-s0sfoEvfPr_J_Sv56HLCq_o7NDAX7dwWiA/viewform', '_blank')}*/}
            {/*        >*/}
            {/*            RSVP NOW*/}
            {/*        </button>*/}

            {/*        <button*/}
            {/*            className="rush-btn"*/}
            {/*            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSetXOreUJqcYHXZJtVaqlhIKE7ek57W74BiVqrCNjX_5ZM58g/viewform?usp=sf_link', '_blank')}*/}
            {/*        >*/}
            {/*            APPLICATION FORM*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="regent-section">
                <h1 className="heading">A Message from the Regent</h1>
                <div className="regent-content">
                    <img src={regentImage} alt="Ryan Kiniris" className="regent-image"/>
                    <div className="regent-text">
                        <p>
                            Hi!<br/><br/>
                            My name is Xander Fruin, and I'm currently a senior at SCU majoring in Mechanical Engineering with a minor in Aerospace Engineering, part of the Theta class. Theta Tau has been integral to my college journey, where I’ve been able to grow professionally and meet some of my closest friends. In my free time, I enjoy spirited driving, hiking, photography, and videography.<br/><br/>

                            Theta Tau stands out as a fraternity where excellence is nurtured in every aspect. Our members are not only dedicated to their academic and professional achievements, but they also bring a vibrant, engaging spirit to everything we do. Being part of such a dynamic group has been incredibly rewarding. The bonds I've formed here are with some of the most genuine and supportive individuals I've ever met, and they’ve helped shape both my personal and academic life in profound ways.<br/><br/>

                            Choosing to join Theta Tau has undeniably been one of the best decisions I've made at SCU. This fraternity has given me countless opportunities for growth, leadership, and building a network of remarkable peers who inspire me every day. The experiences and memories I've gained here are irreplaceable, and I am continuously grateful for the sense of belonging and camaraderie that defines our brotherhood.<br/><br/>

                            Thank you for taking the time to get to know us a little better, and if you ever see me around campus, feel free to say hi! I hope you'll consider joining us for our Winter Rush during Week 1. It’s a perfect chance to experience the unique spirit and supportive environment that makes Theta Tau so special.<br/><br/>

                            In H & T,<br/><br/>
                            XANDER FRUIN<br/>
                            MECHANICAL & AEROSPACE ENGINEERING, THETA CLASS<br/>
                            SENIOR | SCU THETA TAU
                        </p>
                        <p className="regent-signature">Xander Fruin | Regent</p>
                    </div>
                </div>
            </div>

            <div className="core-pillars-section">
                <div className="pillars-header">
                    <hr className="divider-line"/>
                    <h1 className="heading">Our Core Pillars</h1>
                </div>

                <div className="pillars-content">
                    <div className="pillar">
                        <h3 className="pillar-title">Brotherhood</h3>
                        <p className="pillar-description">
                            We forge lifelong bonds of fraternal friendship, a journey that develops and delivers a
                            network of lasting personal and professional relationships. We foster an inviting, safe, and
                            social environment in which our members become lifelong friends.
                        </p>
                    </div>

                    <div className="pillar">
                        <h3 className="pillar-title">Professional Development</h3>
                        <p className="pillar-description">
                            We develop and nurture engineers with strong communication, problem-solving, collaboration,
                            and leadership skills that we demonstrate in our profession, our community, and in our
                            lives.
                        </p>
                    </div>

                    <div className="pillar">
                        <h3 className="pillar-title">Service</h3>
                        <p className="pillar-description">
                            We are known for our service to our college, university, and the larger community. Our
                            service projects create a unifying environment for learning and personal growth for our
                            members.
                        </p>
                    </div>
                </div>
            </div>

            <div className="join-section" style={{backgroundImage: `url(${ChapterPhoto})`}}>
                <div className="join-overlay">
                    <h2 className="join-title">Interested in Joining?</h2>
                    <button
                        className="rush-btn"
                        onClick={() => window.location.href = '/rush'}
                    >
                        RUSH
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;