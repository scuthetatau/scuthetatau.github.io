import React from 'react';
import './PointsWidget.css';

const PointsWidget = ({ points }) => {
    return (
        <div className="card">
            <h2>Points</h2>
            <div className="points-info">
                <p>{points} / 2000</p>
            </div>
            <div className="points-bar">
                <div
                    className="points-progress"
                    style={{ width: `${(points / 2000) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default PointsWidget;