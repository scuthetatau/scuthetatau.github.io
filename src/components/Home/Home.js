// src/pages/Home.js

import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './Home.css';
import ChapterPhoto from '../assets/ChapterPhoto.jpeg';
import RegentImage from '../assets/regent.jpg';
import CoatArms from '../assets/CoatArms.png';
import JoinBackground from '../assets/LiamSophieSethi.jpeg'; // Background image for the join section

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const title = document.querySelector('.title');
            const maxFontSize = 6; // maximum font size in em
            const minFontSize = 4; // minimum font size in em
            const scrollPos = window.scrollY;
            const newFontSize = minFontSize + (scrollPos / 100);

            title.style.fontSize = `${Math.min(newFontSize, maxFontSize)}em`;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleRushClick = () => {
        navigate('/rush');
    };

    return (
        <div className="home">
            <header className="hero" style={{backgroundImage: `url(${ChapterPhoto})`}}>
                <h1 className="title">THETA TAU</h1>
                <h2 className="subtitle">Upsilon Epsilon Chapter</h2>
            </header>

            <section className="regent-message">
                <h2>MESSAGE FROM THE REGENT</h2>
                <div className="regent-content">
                    <div className="regent-message-text">
                        <p>
                            Hello!
                            <br/><br/>
                            My name is Ryan Kiniris, and I’m currently a junior majoring in Electrical and Computer
                            Engineering in the Eta class at SCU. Theta Tau has been an integral part of my college
                            journey, offering an exceptional community that blends professional growth with lifelong
                            friendships.
                            <br/><br/>
                            Theta Tau stands out as a fraternity where excellence is nurtured in every aspect. Our
                            members are not only dedicated to their academic and professional achievements, but they
                            also bring a vibrant, engaging spirit to everything we do. Being part of such a dynamic
                            group has been incredibly rewarding. The bonds I've formed here are with some of the most
                            genuine and supportive individuals I've ever met, and they’ve helped shape both my personal
                            and academic life in profound ways.
                            <br/><br/>
                            Choosing to join Theta Tau has undeniably been one of the best decisions I've made at SCU.
                            This fraternity has given me countless opportunities for growth, leadership, and building a
                            network of remarkable peers who inspire me every day. The experiences and memories I’ve
                            gained here are irreplaceable, and I am continuously grateful for the sense of belonging and
                            camaraderie that defines our brotherhood.
                            <br/><br/>
                            Thank you for taking the time to get to know us a little better! I hope you’ll consider
                            joining us for our Winter Rush during Week 1. It’s a perfect chance to experience the unique
                            spirit and supportive environment that makes Theta Tau so special.
                            <br/><br/>
                            In H & T,
                            <br/><br/>
                            RYAN KINIRIS
                            <br/>
                            ELECTRICAL AND COMPUTER ENGINEERING, ETA CLASS
                            <br/>
                            JUNIOR | SCU THETA TAU
                        </p>
                    </div>
                    <img src={RegentImage} alt="Regent" className="regent-image"/>
                </div>
            </section>

            <section className="our-pillars">
                <h2>OUR PILLARS</h2>
                <div className="pillars-content">
                    <div className="pillar-card">
                        <div className="pillar-title">BROTHERHOOD</div>
                        <p className="pillar-description">
                            Brotherhood is the bond that ties our members together. We support each other through
                            thick and thin and strive to create a sense of family within the chapter.
                        </p>
                    </div>
                    <div className="pillar-card">
                        <div className="pillar-title">PROFESSIONALISM</div>
                        <p className="pillar-description">
                            Professionalism encompasses our commitment to excellence in our academic and professional
                            endeavors. We strive for success and integrity in all that we do.
                        </p>
                    </div>
                    <div className="pillar-card">
                        <div className="pillar-title">SERVICE</div>
                        <p className="pillar-description">
                            Service is the heart of Theta Tau. We dedicate our time and efforts to giving back to the
                            community and supporting philanthropic causes.
                        </p>
                    </div>
                </div>
            </section>

            <section className="coat-arms">
                <img src={CoatArms} alt="Coat of Arms"/>
            </section>

            <section className="history">
                <h2>HISTORY OF THETA TAU</h2>
                <p>
                    Theta Tau is the largest and foremost Fraternity for Engineers. Since its founding at
                    the University of Minnesota in 1904, Theta Tau has developed and maintained a strong
                    national organization that serves a diverse membership of engineers.
                </p>
            </section>

            <section className="interested-in-joining" style={{backgroundImage: `url(${JoinBackground})`}}>
                <div className="interested-content">
                    <h2>Interested in joining?</h2>
                    <button className="rush-button" onClick={handleRushClick}>Rush</button>
                </div>
            </section>

            {/*<footer className="footer">*/}
            {/*    <p>&copy; {new Date().getFullYear()} Upsilon Epsilon Chapter of Theta Tau. All rights reserved.</p>*/}
            {/*</footer>*/}
        </div>
    );
};

export default Home;