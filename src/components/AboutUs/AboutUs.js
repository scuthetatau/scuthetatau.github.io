import React, { useState, useEffect } from 'react';
import './AboutUs.css'; // Import the CSS file
import backgroundImage from '../assets/ThetaClassInitiation.png'; // Update with the correct path to your image
import chapterImage from '../assets/CoatArms.png';
import RotatingImageWidget from "./RotatingImageWidget"; // Update with the correct path to your image

const AboutUs = () => {
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

    const RotatingImagesWidget = ({ images }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 10000); // Switch every 10 seconds

            return () => clearInterval(interval);
        }, [images.length]);

        return (
            <div className="rotating-image-container">
                {images.length > 0 ? (
                    <img
                        src={images[currentIndex]}
                        alt={`Rotating Image ${currentIndex + 1}`}
                        className="rotating-image"
                    />
                ) : (
                    <p>No images available</p>
                )}
            </div>
        );
    };

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
                    <h1 className="aboutus-hero-title">About Us</h1>
                    <h2 className="aboutus-subtitle">UPSILON EPSILON CHAPTER</h2>
                </div>
            </div>

            <div style={{display: "flex", alignItems: "flex-start", padding: "2rem", backgroundColor: "white"}}>
                <div style={{flex: "1", paddingRight: "2rem"}}>
                    <img
                        src={chapterImage}
                        alt="Theta Tau Chapter"
                        style={{width: "100%", height: "auto", borderRadius: "10px"}}
                    />
                </div>
                <div style={{flex: "2"}}>
                    <div>
                        <h2 className="subheading" style={{color: "darkred", fontWeight: "bold"}}>Our History</h2>
                        <p style={{fontSize: "1.2rem", lineHeight: "1.5"}}>
                            Founded at the University of Minnesota in 1904, Theta Tau is the nation’s oldest and
                            foremost Fraternity for Engineers. Over 30,000 have been initiated over the years. With
                            emphasis on quality and a strong fraternal bond, the fraternity has chapters only at ABET
                            accredited schools.
                            Theta Tau carefully follows a program in the selection and development of its members that
                            stresses the importance of high professional ethics and exemplary practices.
                        </p>
                        <p style={{fontSize: "1.2rem", lineHeight: "1.5", marginTop: "1rem"}}>
                            Within each chapter, the Fraternity stimulates professional activity and social
                            compatibility; provides a framework for group participation in campus, community,
                            engineering, and fraternity affairs; and promotes lasting friendships - a lifetime of
                            brotherhood in an engineering environment.
                            Through national conferences and conventions, there is an annual opportunity to associate
                            with fraternity brothers (students and alumni) from chapters across the nation. We are
                            always looking for motivated, ambitious, and energetic engineering students that are
                            interested in building friendships, improving their professional lives, and becoming the
                            strong foundation upon which the fraternity is built. Are you the person we are looking for?
                        </p>
                    </div>
                    <div style={{marginTop: "2rem"}}>
                        {/*<h2 className="subheading" style={{ color: "darkred", fontWeight: "bold" }}>Our Chapter</h2>*/}
                        {/*<p style={{ fontSize: "1.2rem", lineHeight: "1.5" }}>*/}
                        {/*    /!*TODO Update this text*!/*/}
                        {/*    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor amet orci semper; nascetur vel turpis eros fames. Inceptos nam elementum feugiat vel nullam. Sit velit sollicitudin viverra ligula quisque torquent himenaeos sit...*/}
                        {/*</p>*/}
                    </div>
                </div>
            </div>

            <div style={{marginTop: "2rem"}}>
                {/*<h2 className="subheading" style={{color: "darkred", fontWeight: "bold"}}>Gallery</h2>*/}
                <RotatingImageWidget/>
            </div>
        </div>
    );
};

export default AboutUs;