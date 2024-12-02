import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
export default function Message() {
    const [data, setData] = useState([]);
    const [users,setusers]=useState([]);
    const myId = localStorage.getItem('myid');
    const navigate=useNavigate();

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        const fetchMessages = async () => {
            const myResponse = await fetch(`http://localhost:4000/chats/${myId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const myData = await myResponse.json();
            setData(myData);
        };

        fetchMessages();
    }, [myId]);

    useEffect(() => {
        if (data.length > 0) {
            const otherUsersIds = data.map(item => {
                if (item.senderId === myId) {
                    return item.receiverId;
                } else {
                    return item.senderId;
                }
            });
            
            const uniqueArray = Array.from(new Set(otherUsersIds));

            const fetchProfiles = async () => {
                const promises = uniqueArray.map(async userId => {
                    const response = await fetch(`http://localhost:2800/user/profile/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });
                    return await response.json();
                });
                const profiles = await Promise.all(promises);
               setusers(profiles);
            };

            fetchProfiles();
          

        }
    }, [data, myId]);

    return (
        <div className="bg-gray-900 text-white min-h-screen py-8 px-4">    
                {/* Render otherUsersIds here */}
                <h1 className="text-3xl text-center mb-8">Chats</h1>
                <hr/>
            <ul>
            {users.map((user, index) => (
                <div className='search-element' key={index}>
                    <div onClick={() => navigate(`/chat/${user._id}`)} className="cursor-pointer flex items-center justify-start py-2 border-b border-gray-700">
                        <span>{user.username}</span>
                    </div>
                </div>
            ))}
            </ul>
            <Footer/>
        </div>
    );
}
