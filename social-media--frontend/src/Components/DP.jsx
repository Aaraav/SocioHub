import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadImageSuccess } from '../store/features/dpslice';
import Footer from './Footer';

export default function DP() {
  const [dp, setDp] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      navigate('/login');
      return;
    }

    const fetchDp = async () => {
      try {
        const response = await fetch('http://localhost:2800/user/getdp', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${access_token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile pictures');
        }

        const data = await response.json();
        setDp(data); // Set the entire data array received from the API

      } catch (error) {
        console.error('Error fetching profile pictures:', error);
        // You might want to handle the error here (e.g., show an error message)
      }
    };

    fetchDp();
  }, [navigate]);

  const postImage = async (event) => {
    event.preventDefault();
    
    const access_token = localStorage.getItem('access_token');
    const form = new FormData(event.target);
    
    try {
      const response = await fetch('http://localhost:2800/user/uploaddp', {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `${access_token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully.');
        dispatch(uploadImageSuccess(data));
        localStorage.setItem('dp', data.image);
        navigate('/profile');
      } else {
        console.error('Error uploading image.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const setdp=(id)=>{

    const selectedImage = dp.find(image => image._id === id);
    console.log(selectedImage);
    dispatch(uploadImageSuccess(selectedImage));
    localStorage.setItem('dp', selectedImage.image);
    navigate('/profile');
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <form encType="multipart/form-data" onSubmit={postImage}>
        <input type="file" name="file" className="bg-gray-700 text-white p-2 rounded-md" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">Post</button>
      </form>

      <h1 className="text-xl font-semibold mt-4 mb-2">Select last Uploaded Pictures</h1>

      <div className="grid grid-cols-3 gap-4">
        {dp && dp.map((item, index) => (
          <div key={index} onClick={()=>setdp(item._id)} className="cursor-pointer">
            <img className="w-full h-auto rounded-md shadow-md" src={`http://localhost:2800${item.image}`} alt={`Profile ${index + 1}`} />
          </div>
        ))}
      </div>

      <Footer/>
    </div>
  );
}
