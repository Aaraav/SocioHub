import React, { useContext, useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { ViewContext } from './Context/ViewProvider';
import Footer from './Footer';
import Comments from './Comments';

export default function Otherprofile() {
  const [data, setData] = useState(null);
  const [post, setPost] = useState([]);
  const [reel, setReel] = useState([]);
  const [postVisible, setPostVisible] = useState(true);
  const [reelVisible, setReelVisible] = useState(false);
  const [addVisibility, setAddVisibility] = useState(false);
  const [following, setFollowing] = useState([]);
  const [f,setf]=useState([]);
  const [pic,setpic]=useState('');
  const [status,setstatus]=useState('');
  const [dp,setdp]=useState('');
  const [commentsVisible, setCommentsVisible] = useState([]);


  const navigate = useNavigate();
  const {id}=useParams();
  // const { id } = useContext(ViewContext);
const myid=localStorage.getItem('myid');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:2800/user/profile/${id}`, {
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
        console.log(userData);
        setFollowing(userData.followers);
        setpic(userData.picture);
        setstatus(userData.profilestatus);
       
       console.log(status);

      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:2800/user/getpost/${id}`, {
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
        console.log(imageData);
      } catch (error) {
        console.error('Error fetching user images:', error);
      }
    };

    const fetchReel = async () => {
      try {
        const access_token = localStorage.getItem('access_token');

        const response = await fetch(`http://localhost:2800/user/getreel/${id}`, {
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
      } catch (error) {
        console.error('Error fetching user reel:', error);
      }
    };

    const getdp=async()=>{
      const access_token = localStorage.getItem('access_token');

      const response=await fetch(`http://localhost:2800/user/dp/${id}/${pic}`,{
        method:'GET',
        headers:{
          Authorization:access_token
        },
        credentials:'include'
      })
      const dataa=await response.json();
      console.log(dataa);
      setdp(dataa);
      
console.log(dp[0].image);      
      
    }
    console.log(following);

    getdp();

    fetchReel();
    fetchImages();
  }, [id, navigate]);

  const followUser = async (id) => {
    try {
      const access_token = localStorage.getItem('access_token');


      if (data.followers.includes(myid)) {
        console.log('You are already following this user');
      } else {
        const response = await fetch(`http://localhost:2800/user/follow/${id}`, {
          method: 'POST',
          headers: {
            Authorization: access_token,
          },
          credentials: 'include',
        });
      
        if (!response.ok) {
          throw new Error('Failed to follow user');
        }
      
        const responseData = await response.json();
        setFollowing([...following, id]);
        console.log('Successfully followed user:', responseData);
      }
      
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async (id) => {
    try {
      const access_token = localStorage.getItem('access_token');
  
      if (!following.includes(myid)) {
        return console.log('You cannot unfollow this user');
      }
  
      const response = await fetch(`http://localhost:2800/user/unfollow/${id}`, {
        method: 'POST',
        headers: {
          Authorization: access_token,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
  
      // Update state after successful unfollow
      setFollowing(prevFollowing => {
        const updatedFollowing = prevFollowing.filter(userId => userId!== id);
        return [...updatedFollowing];
      });
  
      // setData(prevData => {
      //   const updatedFollowers = prevData.followers.filter(followerId => followerId !== id);
      //   return {...prevData, followers: updatedFollowers};
      // });
  
      console.log('Successfully unfollowed user');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  
  
  
  

  const visibility = () => {
    setReelVisible(true);
    setPostVisible(false);
  };

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
        // Parse likes to an integer before incrementing
        setPost(prevPosts =>
          prevPosts.map(post =>
            post._id === id ? { ...post, likes: post.likes } : post
            )
        );
      } else {
        throw new Error('Failed to like post');
      }
                  window.location.reload();

    } catch (error) {
      console.error('Error liking post:', error);
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
    <div className="bg-gray-900 text-white min-h-[100vh] h-auto">

    <div>
    <nav className='flex justify-between items-center px-6 py-4'>
        <h1 className='text-xl font-semibold'>{data && data.username}</h1>
        {/* <ul className="flex gap-6">
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
        </ul> */}
      </nav>
      
      <hr />

      <div className='flex justify-center items-center mt-4'>
    <div className='w-32 h-32 overflow-hidden rounded-full'>
        {dp && dp.length > 0 && dp[0].image ? (
            <img id='profilepic' src={`http://localhost:2800${dp[0].image}`} alt='Profile' />
        ) : (
            <img id='profilepic' src='default_profile_picture.jpg' alt='Default Profile' />
        )}
    </div>
</div>



      <div id='followers' className='flex  mt-[80px] ml-[25%]'>
        <div className='text-center mr-7'>
          <h4>{post.length}<br />Posts</h4>
        </div>
        <div className='text-center mr-7'>
        <h4 onClick={(following.includes(myid)) ? () => navigate(`/follower/${id}`) : null}>
  {following.length}<br />Followers
</h4>
        </div>
        <div className='text-center'>
        <h4 onClick={(following.includes(myid)) ? () => navigate(`/following/${id}`) : null}>
                      {data && data.following ? data.following.length : 0}<br />Following</h4>
        </div>
      </div>


      <div className='flex justify-center mt-[80px]'>
        <div>
      {following.includes(myid) ? (
    <button className='bg-gray-800 text-white px-4 py-2 rounded-md'  onClick={() => {unfollowUser(data._id); window.location.reload();}}>Unfollow</button>
  ) : (
    <button className='bg-gray-800 text-white px-4 py-2 rounded-md'  onClick={() => {followUser(data._id); window.location.reload();}}>Follow</button>
  )}

  </div>
       

     
  
  <button 
  onClick={()=>
    navigate(`/chat/${id}`)
    // alert('this feature currently under process')
}>message</button>
      </div>



      {/* {data && data.profilestatus && <> */}

     

      <ul className='tags'>
        <li onClick={() => setPostVisible(true)}>POSTS</li>
        <li onClick={visibility}>REELS</li>
      </ul>
     
      {(status===true || following.includes(myid)) && (
      
      <div id='post-div' className='grid grid-cols-3 gap-4 mt-6 mx-4'>
    
  {postVisible && post.map((image, index) => (

    <div key={index} className="relative">
      {/* Check if status is false and the user is not a follower */}
      {(status === false && !following.includes(myid)) && (
        <p>This user can't see this post because they are not a follower.</p>
      )}
      {/* Check if status is true or the user is a follower */}
     
        <>
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
        </>
     
    </div>
  ))}

        {reelVisible && reel.map((reelItem, index) => (
          <div key={index} className='relative'>
            <video
              id='video'
              controls
              src={`http://localhost:2800${reelItem.reel}`}
              className='w-full h-auto object-cover cursor-pointer rounded-md'
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
              <Comments imageId={reelItem._id} />
            </div>
          </div>
        ))}
      </div>

)}

      {/* Comments Popup */}
      {commentsVisible.map((isVisible, index) => (
        isVisible && (
          <div key={index} className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg w-1/2 max-h-3/4 overflow-y-auto text-white">
              <button className="absolute top-4 right-4 text-white" onClick={() => toggleComments(index)}>Close</button>
              <Comments imageId={post[index]._id} />
            </div>
          </div>
        )
      ))}
    
  
      <Footer />
    
      </div>
    
    
    </div>



  );
}