import React, {useState} from 'react';
import './Dashboard.css';
import BroDateWidget from './widgets/BroDateWidget';
import WelcomeWidget from './widgets/WelcomeWidget';
import PointsWidget from './widgets/PointsWidget';

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        graduationYear: '',
        family: '',
        class: '',
        role: '',
        profilePic: '',
        points: 0,
        email: '',
        major: ''
    });

    const [updateInfo, setUpdateInfo] = useState({
        firstName: '',
        lastName: '',
        graduationYear: '',
        family: '',
        class: '',
        role: '',
        points: 0,
        profilePic: '',
        major: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [broDateGroups, setBroDateGroups] = useState([]);

    return (
        <div className="dashboard-container">
            <WelcomeWidget
                userDetails={userDetails}
                setShowEditProfile={setShowEditProfile}
                showEditProfile={showEditProfile}
                setUserDetails={setUserDetails}
                setUpdateInfo={setUpdateInfo}
                setSelectedFile={setSelectedFile}
                setIsSuccess={setIsSuccess}
                setError={setError}
                setBroDateGroups={setBroDateGroups}
                updateInfo={updateInfo}
                isSuccess={isSuccess}
                error={error}
                selectedFile={selectedFile}
            />
            <div className="right-widget">
                <PointsWidget points={userDetails.points}/>
                <div className="card">
                    <BroDateWidget groups={broDateGroups}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;