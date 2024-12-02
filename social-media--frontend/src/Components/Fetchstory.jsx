import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // Import your Modal component

export default function Fetchstory() {
  const [data, setData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:2800/user/fetchstory', {
          method: 'GET',
          headers: {
            Authorization: access_token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }

        const { story, usersfollowing } = await response.json();
        setData({ story, usersfollowing });
        console.log(story); // Assuming the response contains an array of story objects with a 'story' field

      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = (images) => {
    setSelectedImages(images);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling on the Y-axis
  };

  const closeModal = () => {
    setSelectedImages([]);
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Allow scrolling on the Y-axis
  };

  const renderStories = () => {
    if (!data || !data.usersfollowing || !data.story) {
      return null; // Return null if data is not available yet
    }
  
    return data.usersfollowing
      .filter(user => data.story.some(story => story.user === user._id)) // Filter out users without stories
      .map((user, userIndex) => (
        <div key={userIndex} style={{ marginLeft: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '40px' }}>
          <h2 style={{ textAlign: 'center', marginLeft: '10px' }}>{user.username}</h2>
          <div style={{ position: 'relative', width: '100px', height: '100px' }} onClick={() => openModal(data.story.filter((story) => story.user === user._id).map((story) => `http://localhost:2800${story.story}`))}>
            {data.story
              .filter((story) => story.user === user._id)
              .map((story, index) => (
                <img
                  key={index}
                  src={`http://localhost:2800${story.cloudinaryUrl}`}
                  alt={`Story ${story._id}`}
                  style={{ position: 'absolute', top: `0px`, width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0px' }} />
              ))}
          </div>
        </div>
      ));
  };
  
  return (
    <div style={{ display: 'flex' }}>
      {renderStories()}
      {showModal && <Modal images={selectedImages} onClose={closeModal} />}
    </div>
  );
}
