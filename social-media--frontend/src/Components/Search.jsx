import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { setUserId } from '../store/features/userSlice';
import { useNavigate } from 'react-router-dom';
import { ViewContext } from './Context/ViewProvider';
import Footer from './Footer';

export default function Search() {
    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState([]);
    const [dp, setDp] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setid } = useContext(ViewContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const access_token = localStorage.getItem('access_token');
                const response = await fetch(`http://localhost:2800/user/searchuser/${searchInput}`, {
                    method: 'GET',
                    headers: {
                        Authorization: access_token
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const userData = await response.json();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [searchInput]);

    const seeId = (id) => {
        setid(id);
        navigate(`/otherprofile/${id}`);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen py-8 px-4">
            <input 
                type='text' 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)} 
                placeholder='Search User'
                className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            {/* Render the fetched users */}
            {users.map((user, index) => (
                <div className='search-element' key={index}>
                    <div onClick={() => seeId(user._id)} className="cursor-pointer flex items-center justify-start py-2 border-b border-gray-700">
                        <span>
                            {/* Display user profile picture if available */}
                            {user.picture && <img id='search-dp' src={`http://localhost:2800${user.picture}`} alt='User DP' className="w-10 h-10 rounded-full mr-4" />}
                        </span>
                        <span>{user.username}</span>
                    </div>
                </div>
            ))}
            <Footer />
        </div>
    );
}
