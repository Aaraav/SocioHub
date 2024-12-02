import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reel() {
  const [reel, setReel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      navigate('/login');
    }
  }, []);

  const postImage = async (event) => {
    event.preventDefault();
    const access_token = localStorage.getItem('access_token');
    const form = new FormData(event.target);
    try {
      const response = await fetch('http://localhost:2800/user/uploadreel', {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `${access_token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reel uploaded successfully.');
        setReel(data);
        navigate('/profile');
      } else {
        console.error('Error uploading reel.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <form className="flex flex-col items-center" encType="multipart/form-data" onSubmit={postImage}>
        <input className="my-4 px-2 py-1 border border-gray-600 rounded-md" type="file" name="file" />
        <input className="my-4 px-2 py-1 border border-gray-600 rounded-md" type="text" name="caption" placeholder="Caption" />
        <button className="my-4 px-4 py-2 bg-gray-800 text-white rounded-md" type="submit">Post</button>
      </form>
    </div>
  );
}
