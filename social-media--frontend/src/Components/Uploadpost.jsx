import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

export default function Uploadpost() {
  const [post, setPost] = useState([]);
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
      const response = await fetch('http://localhost:2800/user/upload', {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `${access_token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully.');
        setPost(data);
        navigate('/profile');
      } else {
        console.error('Error uploading image.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <form className="flex flex-col items-center justify-center h-full" encType="multipart/form-data" onSubmit={postImage}>
        <input className="my-4 px-2 py-1 border border-gray-600 rounded-md" type="file" name="file" />
        <input className="my-4 px-2 py-1 border border-gray-600 rounded-md" type="text" name="caption" placeholder="Caption" />
        <button className="my-4 px-4 py-2 bg-gray-800 text-white rounded-md" type="submit">Post</button>
      </form>

      <ul className="mt-8">
        {post && Array.isArray(post) &&
          post.map((item, index) => (
            <li key={index}>{item.image}</li>
          ))
        }
      </ul>
      <Footer />
    </div>
  );
}
