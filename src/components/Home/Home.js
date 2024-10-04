import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import backgroundImage from '../assets/HomePage_Hero.png'; // Replace with the correct image path
import regentImage from '../assets/regent.jpg'; // Replace with the correct image path
import thetaClass from '../assets/ThetaClassInitiation.png'; // Import the image here

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
                    <h1 className="title">THETA TAU</h1>
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

            <div className="regent-section">
                <h1 className="regent-title">A Message from the Regent</h1>
                <div className="regent-content">
                    <img src={regentImage} alt="Ryan Kiniris" className="regent-image"/>
                    <div className="regent-text">
                        <p>
                            Hello!<br/><br/>
                            My name is Ryan Kiniris, and I'm currently a junior majoring in Electrical and Computer
                            Engineering in the Eta class at SCU. Theta Tau has been an integral part of my college
                            journey, offering an exceptional community that blends professional growth with lifelong
                            friendships.<br/><br/>
                            Theta Tau stands out as a fraternity where excellence is nurtured in every aspect. Our
                            members are not only dedicated to their academic and professional achievements, but they
                            also bring a vibrant, engaging spirit to everything we do. Being part of such a dynamic
                            group has been incredibly rewarding. The bonds I've formed here are with some of the most
                            genuine and supportive individuals I've ever met, and they’ve helped shape both my personal
                            and academic life in profound ways.<br/><br/>
                            Choosing to join Theta Tau has undeniably been one of the best decisions I've made at SCU.
                            This fraternity has given me countless opportunities for growth, leadership, and building a
                            network of remarkable peers who inspire me every day. The experiences and memories I've
                            gained here are irreplaceable, and I am continuously grateful for the sense of belonging and
                            camaraderie that defines our brotherhood.<br/><br/>
                            Thank you for taking the time to get to know us a little better! I hope you'll consider
                            joining us for our Winter Rush during Week 1. It’s a perfect chance to experience the unique
                            spirit and supportive environment that makes Theta Tau so special.<br/><br/>
                            In H & T,<br/><br/>
                            RYAN KINIRIS<br/>
                            ELECTRICAL AND COMPUTER ENGINEERING, ETA CLASS<br/>
                            JUNIOR | SCU THETA TAU
                        </p>
                        <p className="regent-signature">Ryan Kiniris | Regent</p>
                    </div>
                </div>
            </div>

            <div className="core-pillars-section">
                <div className="pillars-header">
                    <hr className="divider-line"/>
                    <h1 className="regent-title">Our Core Pillars</h1>
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

            <div className="join-section" style={{backgroundImage: `url(${thetaClass})`}}>
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