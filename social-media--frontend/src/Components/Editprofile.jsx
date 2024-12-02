import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userdata, setUserData] = useState(null); // Initialize userdata state to null
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const access_token = localStorage.getItem('access_token');
        
                if (!access_token) {
                    navigate('/login');
                    return;
                }
        
                const response = await fetch('http://localhost:2800/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${access_token}`,
                    },
                    credentials: 'include',
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
        
                const userData = await response.json();
                setUserData(userData);
                setFullname(userData.fullname || ''); // Initialize fullname with userdata.fullname or empty string if null
                setUsername(userData.username || ''); // Initialize username with userdata.username or empty string if null
                setEmail(userData.email || ''); // Initialize email with userdata.email or empty string if null
                // Initialize password with an empty string as it's not recommended to fetch passwords from the backend
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserData();
    }, [navigate]);

    const senddata = async (e) => {
        e.preventDefault();
        const access_token = localStorage.getItem('access_token');

        try {
            const response = await fetch('http://localhost:2800/user/editProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${access_token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullname,
                    username,
                    email
                })
            });

            if (response.ok) {
                navigate('/profile');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div>
            <h1>Registration Form</h1>
            <form onSubmit={senddata}>
                {fullname && 
                    <input
                        id='text'
                        type='text'
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                }
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                />
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                />
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}
