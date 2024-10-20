import React, { useState, useEffect } from 'react';
import './RotatingImageWidget.css'; // Import the CSS file for styling

const RotatingImageWidget = () => {
    // Dynamically import all images from the 'assets/images' directory
    const importAll = (requireContext) => requireContext.keys().map(requireContext);
    const images = importAll(require.context('../assets/rotatingImages', false, /\.(png|jpe?g|JPG|svg)$/));
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Set up an interval to switch images every 10 seconds
        const interval = setInterval(() => {
            nextImage();
        }, 10000); // 10000 milliseconds = 10 seconds

        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="rotating-image-container">
            <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="rotating-image"
            />
            <button className="prev-button" onClick={prevImage} aria-label="Previous Image">
                &#10094;
            </button>
            <button className="next-button" onClick={nextImage} aria-label="Next Image">
                &#10095;
            </button>
        </div>
    );
};

export default RotatingImageWidget;
