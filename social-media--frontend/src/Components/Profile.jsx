import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ViewContext } from './Context/ViewProvider';
import Comments from './Comments';

export default function Profile() {
  const [data, setData] = useState(null);
  const [post, setPost] = useState([]);
  const [reel, setReel] = useState([]);
  const [postVisible, setPostVisible] = useState(true);
  const [reelVisible, setReelVisible] = useState(false);
  const [addVisibility, setAddVisibility] = useState(false);
  const { setmyid, myid, setcomments, comments, x, setx } = useContext(ViewContext);
  const navigate = useNavigate();
  const dp = localStorage.getItem('dp');
  const dpImage = useSelector(state => state.dp.image);
  const [commentsVisible, setCommentsVisible] = useState([]);

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
            Authorization: access_token,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setData(userData);
        setmyid(userData._id);
        localStorage.setItem('myid', userData._id);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchImages = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:2800/user/getpost', {
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
      } catch (error) {
        console.error('Error fetching user images:', error);
      }
    };

    const fetchReel = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:2800/user/getreel', {
          method: 'GET',
          headers: {
            Authorization: access_token,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user reel');
        }

        const reelData = await response.json();
        setReel(reelData);
        console.log('reelData',reelData);
      } catch (error) {
        console.error('Error fetching user reel:', error);
      }
    };

    if(reelVisible==true){
      setPostVisible(false);
    }

    fetchReel();
    fetchUserData();
    fetchImages();
  }, []);

  const handleLike = async (id) => {
    setcomments(id);
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

    } catch (err) {
      console.log(err);
    }
  };

  const linkDpForm = () => {
    navigate('/uploaddp');
  };

  const visibility = () => {
    setReelVisible(true);
    setPostVisible(false);

   
  };

  const toggleComments = (index) => {
    setCommentsVisible((prev) => {
      const updatedCommentsVisible = [...prev];
      updatedCommentsVisible[index] = !updatedCommentsVisible[index];
      return updatedCommentsVisible;
    });
  };

  const makeProfilePublic = async (id) => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(`http://localhost:2800/user/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token,
        },
        body: JSON.stringify({ status: true }), // Include the status in the request body
  
        credentials: 'include',
      });
  
      if (response.ok) {
        // Handle success
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error making profile public:', error);
    }
  };
  
  const makeProfilePrivate = async (id) => {
    try {
      const access_token = localStorage.getItem('access_token');
      if (!access_token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(`http://localhost:2800/user/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token,
        },
        body: JSON.stringify({ status: false }), // Include the status in the request body
  
        credentials: 'include',
      });
  
      if (response.ok) {
        // Handle success
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error making profile private:', error);
    }
  };
  
  

  return (
    <div className="bg-gray-900 text-white sm:min-h-screen">
      <nav className='flex justify-between items-center px-6 py-4'>
        <h1 className='text-xl font-semibold'>{data && data.username}</h1>
        <ul className="flex gap-6">
          <li onClick={() => navigate('/home')}>Home</li>
          <li className="relative">
            <span onClick={() => setAddVisibility(x => !x)}>Add</span>
            {addVisibility &&
              <ul className='absolute top-full left-0 bg-gray-800 text-white rounded shadow-md py-2'>
                <li onClick={() => navigate('/uploadpost')}>Post</li>
                <li onClick={() => navigate('/uploadreel')}>Reel</li>
                <li onClick={() => navigate('/uploadstory')}>Story</li>
                <li onClick={() => navigate('/live')}>Live</li>
              </ul>
            }
          </li>
          <li><button onClick={() => navigate('/menu')}>Menu</button></li>
          <li onClick={() => makeProfilePublic(data._id)}>Public</li>
          <li onClick={() => makeProfilePrivate(data._id)}>Private</li>
        </ul>
      </nav>
      <hr className="border-gray-700" />

      <div className='flex justify-center items-center mt-4'>
        <div className='w-32 h-32 overflow-hidden rounded-full'>
          {dp && <img className='w-full h-full object-cover cursor-pointer' onClick={linkDpForm} src={`http://localhost:2800${dp}`} alt="Profile" />}
          {!dp && dpImage && <img className='w-full h-full object-cover' src={dpImage} alt="Profile" />}
        </div>
      </div>

      <div id='followers' className='flex  mt-[80px] ml-[25%]'>
        <div className='text-center mr-7'>
          <h4>{post.length}<br />Posts</h4>
        </div>
        <div className='text-center mr-7'>
          <h4 onClick={() => navigate(`/follower/${myid}`)}>{data && data.followers ? data.followers.length : 0}<br />Followers</h4>
        </div>
        <div className='text-center'>
          <h4 onClick={() => navigate(`/following/${myid}`)}>{data && data.following ? data.following.length : 0}<br />Following</h4>
        </div>
      </div>

      <div className='flex justify-center mt-[80px]'>
        <div>
          <button onClick={() => navigate('/editprofile')} className='bg-gray-800 text-white px-4 py-2 rounded-md mr-4'>Edit Profile</button>
        </div>
        <div>
          <button className='bg-gray-800 text-white px-4 py-2 rounded-md'>Share Profile</button>
        </div>
      </div>

      <ul className='flex justify-center mt-6'>
        <li onClick={() => {setPostVisible(true); setReelVisible(false);}} className={`cursor-pointer ${postVisible ? 'font-semibold text-red-800' : 'text-gray-400'}`}>Posts</li>
        <li onClick={visibility} className={`ml-6 cursor-pointer ${reelVisible ? 'font-semibold text-red-800' : 'text-gray-400'}`}>Reels</li>
      </ul>

      <div id='post-div' className='grid grid-cols-3 gap-4 mt-6 mx-4'>
        {postVisible && post.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.cloudinaryUrl}
              alt="Image"
              className='w-full h-auto object-cover cursor-pointer rounded-md'
              onClick={() => handleLike(image._id)}
            />
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
          </div>
        ))}

        {reelVisible && reel.map((reelItem, index) => (
          <div key={index} className='relative'>
            <video
              id='video'
              controls
              src={reelItem.cloudinaryUrl}
              className='w-full h-auto object-cover cursor-pointer rounded-md'
            />
            {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
              <Comments imageId={reelItem._id} />
            </div> */}
          </div>
        ))}
      </div>

      {/* Comments Popup */}
      {commentsVisible.map((isVisible, index) => (
        isVisible && (
          <div key={index} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg w-1/2 max-h-3/4 overflow-y-auto">
              <button className="absolute top-4 right-4 text-white" onClick={() => toggleComments(index)}>Close</button>
              <Comments imageId={post[index]._id} />
            </div>
          </div>
        )
      ))}
    </div>
  );
}
