import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';

export default function Homeposts() {
  const [post, setPost] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState([]);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:2800/user/allposts', {
          method: 'GET',
          headers: {
            Authorization: access_token,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user images');
        }

        const imageData = await response.json();
        setPost(imageData.images);
        setCommentsVisible(new Array(imageData.images.length).fill(false));

        // Extract user IDs from the fetched posts
        const userIds = imageData.images.map(item => item.user);

        // Fetch user profile data for each user
        fetchUserProfiles(userIds, access_token);
      } catch (error) {
        console.error('Error fetching user images:', error);
      }
    };

    const fetchUserProfiles = async (userIds, access_token) => {
      try {
        const userPromises = userIds.map(async (userId) => {
          const response = await fetch(`http://localhost:2800/user/profile/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: access_token
            },
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch user profile for user ${userId}`);
          }

          const userData = await response.json();
          return userData;
        });

        const userDataList = await Promise.all(userPromises);
        const userDataMap = Object.fromEntries(userDataList.map(user => [user._id, user]));
        setUserData(userDataMap);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };

    fetchImages();
  }, []);

  

  const handleLike = async (id) => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:2800/user/like/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const updatedImage = await response.json();
        setPost(prevPosts =>
          prevPosts.map(post =>
            post._id === id ? { ...post, likes: post.likes } : post
          )
        );
      }
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleComments = (index) => {
    setCommentsVisible((prev) => {
      const updatedCommentsVisible = [...prev];
      updatedCommentsVisible[index] = !updatedCommentsVisible[index];
      return updatedCommentsVisible;
    });
  };

  return (
    <div className="bg-gray-900 text-white sm:min-h-screen">
      <div id='post-div' className='grid grid-cols-3 gap-4 mt-6 mx-4'>
        {post.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.cloudinaryUrl}
              alt="Image"
              className='w-full h-auto object-cover cursor-pointer rounded-md'
              onClick={() => handleLike(image._id)}
            />
            <div className="text-white absolute bottom-16">
              {userData[image.user] && userData[image.user].username}
            </div>
            <div className="absolute top-0 right-0 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white hover:text-red-500 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => handleLike(image._id)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
              <p className="text-white text-sm">Likes: {image.likes}</p>
              <button
                className="text-white text-sm focus:outline-none"
                onClick={() => toggleComments(index)}
              >
                {commentsVisible[index] ? "Hide Comments" : "Show Comments"}
              </button>
            </div>

            {/* Render Comments component if comments are visible */}
            {commentsVisible[index] && (
               <div key={index} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
               <div className="bg-gray-800 p-4 rounded-lg w-1/2 max-h-3/4 overflow-y-auto">
                 <button className="absolute top-4 right-4 text-white" onClick={() => toggleComments(index)}>Close</button>
                 <Comments imageId={post[index]._id} />
               </div>
             </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
