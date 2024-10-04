// #file:App.js
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home/Home';
import AboutUs from './components/AboutUs/AboutUs';
import MeetTheBrothers from './components/MeetTheBrothers/MeetTheBrothers';
import Events from './components/Events/Events';
import Rush from './components/Rush/Rush';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import Admin from './components/Admin/Admin';

function App() {
    return (
        <Router>
            <div>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about-us" element={<AboutUs/>}/>
                    <Route path="/meet-the-brothers" element={<MeetTheBrothers/>}/>
                    <Route path="/events" element={<Events/>}/>
                    <Route path="/rush" element={<Rush/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                </Routes>
            </div>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Upsilon Epsilon Chapter of Theta Tau. All rights reserved.</p>
            </footer>
        </Router>
    );
}

export default App;