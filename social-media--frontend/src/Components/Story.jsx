import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Story() {
  const [files, setFiles] = useState([]);
  const [captions, setCaptions] = useState([]);
  const navigate = useNavigate();
  const access_token = localStorage.getItem('access_token');

  if (!access_token) {
    navigate('/login');
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const postImage = async (e) => {
    e.preventDefault();
    const access_token = localStorage.getItem('access_token');
    
    if (!access_token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
      formData.append('captions', captions[index] || '');
    });
    
    try {
      const response = await fetch('http://localhost:2800/user/uploadstory', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: access_token,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
      
      const data = await response.json();
      navigate('/home');
      console.log('Files uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <form encType="multipart/form-data" onSubmit={postImage} className="flex flex-col items-center">
        <input type="file" name="files" onChange={handleFileChange} multiple className="my-4 px-2 py-1 border border-gray-600 rounded-md" />
        <button type="submit" className="my-4 px-4 py-2 bg-gray-800 text-white rounded-md">Post</button>
      </form>
    </div>
  );
}
