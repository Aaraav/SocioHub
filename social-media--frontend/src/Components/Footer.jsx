import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-0 w-full bg-gray-800 text-white">
            <div className=" py-2 px-4">
                <ul className="flex justify-between">
                    <li onClick={() => navigate('/home')}>Home</li>
                    <li onClick={() => navigate('/search')}>Search</li>
                    <li onClick={() => navigate('/uploadpost')}>Add</li>
                    <li onClick={() => navigate('/reels')}>Reels</li>
                    <li onClick={() => navigate('/profile')}>Profile</li>
                </ul>
            </div>
        </div>
    );
}
