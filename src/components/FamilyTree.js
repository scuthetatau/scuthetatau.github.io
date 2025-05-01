import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import genericProfile from './assets/WhiteTT.png';
import './FamilyTree.css';

const FamilyTree = () => {
    const [users, setUsers] = useState([]);
    const [alumni, setAlumni] = useState([]);
    const [treeData, setTreeData] = useState(null);

    useEffect(() => {
        fetchAllMembers();
    }, []);

    const fetchAllMembers = async () => {
        // Fetch current users
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isAlumni: false
        }));
        setUsers(usersData);

        // Fetch alumni
        const alumniSnapshot = await getDocs(collection(firestore, 'alumni'));
        const alumniData = alumniSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isAlumni: true
        }));
        setAlumni(alumniData);

        // Combine and build tree
        buildTree([...usersData, ...alumniData]);
    };

    const buildTree = (allMembers) => {
        const memberMap = new Map(allMembers.map(member => [member.id, member]));
        const roots = allMembers.filter(member => !member.bigId);
        
        const buildNode = (memberId) => {
            const member = memberMap.get(memberId);
            if (!member) return null;

            const node = {
                name: `${member.firstName} ${member.lastName}`,
                attributes: {
                    class: member.class || member.graduationYear || 'Unknown',
                    isAlumni: member.isAlumni
                },
                profilePicture: member.profilePictureUrl || genericProfile
            };

            // Find all littles (both current members and alumni)
            const littles = allMembers.filter(m => m.bigId === memberId);
            if (littles.length > 0) {
                node.children = littles.map(little => buildNode(little.id));
            }

            return node;
        };

        const tree = {
            name: 'Theta Tau Family Tree',
            children: roots.map(root => buildNode(root.id))
        };

        setTreeData(tree);
    };

    const CustomNode = ({ nodeDatum, toggleNode }) => {
        const className = nodeDatum?.attributes?.class || 'Unknown';
        const profilePicture = nodeDatum?.profilePicture || genericProfile;
        const name = nodeDatum?.name || 'Unknown';
        const isAlumni = nodeDatum?.attributes?.isAlumni;

        return (
            <g onClick={toggleNode} className={`node ${isAlumni ? 'alumni' : ''}`}>
                <circle r={30} fill={isAlumni ? '#252525' : '#881616'} />
                <circle r={25} fill="none" stroke={isAlumni ? '#252525' : '#881616'} strokeWidth="2" />
                <image
                    href={profilePicture}
                    x="-25"
                    y="-25"
                    width="50"
                    height="50"
                    className="profile-image"
                />
                <text
                    dy="45"
                    textAnchor="middle"
                    className="name"
                    style={{ 
                        fontSize: '14px',
                        fill: '#252525',
                        fontFamily: 'Mohave, sans-serif'
                    }}
                >
                    {name}
                </text>
                <text
                    dy="60"
                    textAnchor="middle"
                    className="class"
                    style={{ 
                        fontSize: '12px',
                        fill: '#666',
                        fontFamily: 'Mohave, sans-serif'
                    }}
                >
                    {className}
                </text>
            </g>
        );
    };

    return (
        <div className="family-tree-container">
            <h2>Family Tree</h2>
            {treeData && (
                <div style={{ width: '100%', height: '800px' }}>
                    <Tree 
                        data={treeData} 
                        orientation="vertical"
                        pathFunc="step"
                        translate={{ x: 500, y: 50 }}
                        nodeSize={{ x: 200, y: 150 }}
                        renderCustomNodeElement={CustomNode}
                    />
                </div>
            )}
        </div>
    );
};

export default FamilyTree; 