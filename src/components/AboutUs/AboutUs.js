import React, { useEffect, useRef, useState } from "react";
import "./AboutUs.css";
import thetaClass from "../assets/LiamSophieSethi.jpeg";

// Helper to import all images
const importAll = (r) => r.keys().map(r);

// Dynamically import all images from the specified directory
const images = importAll(
    require.context("../assets/rotatingImages", false, /\.(jpg|png|JPG|heic)$/)
);

const AboutUs = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef(null);

    // Detect if the device is mobile
    useEffect(() => {
        const checkIfMobile = () =>
            "ontouchstart" in window || window.innerWidth <= 768;
        setIsMobile(checkIfMobile());
    }, []);

    // Auto-scroll effect when not hovered
    useEffect(() => {
        let interval;
        // On mobile, isHovered will always be false because we won't update it.
        if (!isHovered) {
            interval = setInterval(() => {
                if (scrollRef.current) {
                    // If we reach half the scroll width (i.e. the end of the first set),
                    // jump back by half the width so that the scrolling appears continuous.
                    if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
                        scrollRef.current.scrollLeft =
                            scrollRef.current.scrollLeft - scrollRef.current.scrollWidth / 2;
                    } else {
                        scrollRef.current.scrollLeft += 2;
                    }
                }
            }, 20);
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    // Preserve infinite loop behavior on manual scroll
    const handleScroll = () => {
        const container = scrollRef.current;
        if (container) {
            const halfWidth = container.scrollWidth / 2;
            // If user scrolls into the duplicated second half, jump back to the first half.
            if (container.scrollLeft >= halfWidth) {
                container.scrollLeft = container.scrollLeft - halfWidth;
            }
            // Optionally, if you want to allow infinite backward scrolling:
            else if (container.scrollLeft <= 0) {
                container.scrollLeft = container.scrollLeft + halfWidth;
            }
        }
    };

    return (
        <div>
            <div className="about-us-container">
                {/* Hero Section */}
                <div
                    className="meet-the-brothers-hero"
                    style={{ backgroundImage: `url(${thetaClass})` }}
                >
                    <div className="join-overlay">
                        <h2 className="hero-title">About Us</h2>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="timeline-container">
                    <h2 className="heading">UPSILON EPSILON CHAPTER HISTORY</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <h3 className="timeline-year">1904</h3>
                                <h4 className="timeline-heading">
                                    Inception of National Theta Tau
                                </h4>
                                <p>
                                    Theta Tau was founded as the "Society of Hammer and Tongs" on
                                    October 15, 1904, by four engineering students at the University
                                    of Minnesota. The organization was formed with the goal of
                                    fostering a bond of mutual help and support among its members.
                                    Since its inception, Theta Tau has grown into the nation's
                                    largest and most prestigious professional engineering fraternity,
                                    with over 50,000 members nationally.
                                </p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <h3 className="timeline-year">2016</h3>
                                <h4 className="timeline-heading">
                                    Upsilon Epsilon Chapter Formed as a Colony
                                </h4>
                                <p>
                                    The Upsilon Epsilon Colony of Theta Tau was established at Santa
                                    Clara University, marking the fraternity's introduction to this
                                    community. As a colony, the members demonstrated the values of
                                    brotherhood, professionalism, and service while working to meet
                                    the requirements to become a fully recognized chapter.
                                </p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <h3 className="timeline-year">2020</h3>
                                <h4 className="timeline-heading">
                                    Upsilon Epsilon chapter Theta Tau Become a Chapter
                                </h4>
                                <p>
                                    After years of commitment and growth, the Upsilon Epsilon Colony
                                    achieved official recognition as a chapter of Theta Tau. This
                                    milestone represents a significant achievement as the members
                                    successfully integrated into Theta Tau's national framework while
                                    fostering strong bonds among their peers and the community.
                                </p>
                            </div>
                        </div>
                    </div>
                    <h2 className="heading">WHO WE ARE</h2>
                </div>

                {/* Image Scroller Section */}
                <div
                    className="image-scroller"
                    ref={scrollRef}
                    onScroll={handleScroll}
                    // Attach mouse events only on non-mobile devices
                    {...(!isMobile && {
                        onMouseEnter: () => setIsHovered(true),
                        onMouseLeave: () => setIsHovered(false),
                    })}
                >
                    <div className="scroller-content" style={{ display: "flex", width: "200%" }}>
                        {/* Duplicate the images array to allow for seamless looping */}
                        {[...images, ...images].map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`About us ${index}`}
                                className="scroller-image rounded"
                            />
                        ))}
                    </div>
                </div>

                {/* National History Section */}
                <div className="timeline-container">
                    <div className="history-container">
                        <h2 className="heading">NATIONAL HISTORY</h2>
                        <h3 className="history-heading">Inception of National Theta Tau</h3>
                        <p>
                            Theta Tau was originally founded as the Society of Hammer and Tongs on
                            October 15, 1904 by four engineering students at the University of
                            Minnesota in Minneapolis. Since its founding, Theta Tau has initiated
                            over 50,000 members. Today, Theta Tau is the nation’s oldest, largest,
                            and foremost fraternity for engineers. The support and guidance of Theta
                            Tau’s vast resources and network helps to foster lifelong relationships
                            between brothers that extend into many professional disciplines.
                        </p>
                        <button
                            className="rush-btn"
                            onClick={() => (window.location.href = "https://thetatau.org/")}
                        >
                            LEARN MORE
                        </button>
                        <h3 className="history-heading">Theta Tau Northwestern Region</h3>
                        <p>
                            The Epsilon Chapter belongs to the Northwestern Region of Theta Tau,
                            with 7 active chapters:
                        </p>
                        <ul className="chapters-list">
                            <li>Epsilon Chapter (University of California, Berkeley)</li>
                            <li>Theta Beta Chapter (University of Washington)</li>
                            <li>Lambda Delta Chapter (University of the Pacific)</li>
                            <li>Mu Delta Chapter (University of California, Merced)</li>
                            <li>Rho Delta Chapter (University of Nevada, Reno)</li>
                            <li>Upsilon Epsilon Chapter (Santa Clara University)</li>
                            <li>Omega Epsilon Chapter (San Jose State University)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
