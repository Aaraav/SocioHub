import React, { useContext, useEffect, useState } from 'react';
import { ViewContext } from './Context/ViewProvider';
import { useNavigate,useParams } from 'react-router-dom';

export default function Following() {
    const [data, setData] = useState([]);
    const [followers, setFollowers] = useState([]);
    const { myid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const access_token = localStorage.getItem('access_token');
                if (!access_token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`http://localhost:2800/user/profile/${myid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: access_token,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const userData = await response.json();
                setData(userData.following);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserData();
    }, [myid, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const access_token = localStorage.getItem('access_token');
                if (!access_token) {
                    navigate('/login');
                    return;
                }

                const followersData = await Promise.all(data.map(async (followerId) => {
                    const response = await fetch(`http://localhost:2800/user/profile/${followerId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: access_token,
                        },
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch profile of follower with ID ${followerId}`);
                    }

                    return response.json();
                }));

                setFollowers(followersData);
            } catch (error) {
                console.error('Error fetching followers profiles:', error);
            }
        };

        fetchData();
    }, [data, navigate]);

    return (
        <div className="bg-gray-900 text-white min-h-screen py-12">
        <h1 className="text-3xl text-center mb-8">Followers List</h1>
        <hr/>
        <div className="mx-auto max-w-lg">
            {followers && followers.map((follower, index) => (
                <div key={index} className="border-b border-gray-700 py-4 pl-10">
                    <h1 onClick={(()=>navigate(`/otherprofile/${follower._id}`))} className="text-lg">{follower.username}</h1>
                </div>
            ))}
        </div>
    </div>
);
}