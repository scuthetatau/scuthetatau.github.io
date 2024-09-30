// src/pages/Rush.js

import React, { useEffect, useState } from 'react';
import './Rush.css';
import ZetaClassImage from '../assets/ZetaClass.png';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Rush = () => {
    const calculateTimeLeft = () => {
        const targetDate = new Date("2025-01-01T00:00:00");
        const now = new Date();
        const difference = targetDate - now;
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    const faqs = [
        {
            question: "What is Theta Tau?",
            answer: "Theta Tau is a co-ed professional engineering fraternity."
        },
        {
            question: "How can I join Theta Tau?",
            answer: "Come out to our mixer events throughout fall quarter and rush during Winter 2024."
        },
        {
            question: "What is Rush?",
            answer: "Rush is the 2 week period of events set up in order for us to meet prospective members."
        },
        {
            question: "Why should I join Theta Tau?",
            answer: "By joining Theta Tau, you will be able to meet other engineers in different majors."
        },
        {
            question: "Who can join Theta Tau?",
            answer: "Any undergraduate with a major of Engineering (COEN, MECH, ELEN, BIOE, CENG, WDE."
        },
        {
            question: "What is pledging? How much of a time commitment is the pledging process?",
            answer: "If you receive a bid to pledge our fraternity, you will then be involved in a 6-week pledging process."
        },
        {
            question: "How much of a time commitment is being an active brother?",
            answer: "As an active brother, you are expected to come to weekly chapter meetings and participate in the wide variety of events."
        },
        {
            question: "Wait, I have more questions!",
            answer: "No problem, email 'mbeltran2@scu.edu' if you have any questions you need answered."
        }
    ];

    return (
        <div className="rush">
            <div className="rush-hero" style={{backgroundImage: `url(${ZetaClassImage})`}}>
                <h1 className="title">WINTER RUSH 2025</h1>
            </div>
            <div className="countdown-section">
                <h2 className="countdown-title">Countdown to Rush</h2>
                <div className="countdown">
                    {Object.keys(timeLeft).length ? (
                        Object.keys(timeLeft).map((interval) => (
                            <div key={interval} className="countdown-element">
                                {timeLeft[interval]} {interval}
                            </div>
                        ))
                    ) : (
                        <span>Time's up!</span>
                    )}
                </div>
            </div>
            {/*<div className="week-calendar">*/}
            {/*    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (*/}
            {/*        <div key={index} className="day-card">*/}
            {/*            <h3>{day}</h3>*/}
            {/*            <p>Add info here</p>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/* FAQ Section */}
            <div className="faq-section">
                <h1>Frequently Asked Questions</h1>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item" onClick={() => toggleQuestion(index)}>
                        <div className="faq-question">
                            {faq.question}
                        </div>
                        <TransitionGroup>
                            {expandedQuestion === index && (
                                <CSSTransition
                                    key="answer"
                                    timeout={300}
                                    classNames="faq-answer"
                                >
                                    <div className="faq-answer">
                                        {faq.answer}
                                    </div>
                                </CSSTransition>
                            )}
                        </TransitionGroup>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rush;