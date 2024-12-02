import React, { useEffect, useState } from 'react';
import Footer from './Footer';

export default function Reels() {
  const [reel, setReel] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = localStorage.getItem('access_token');

        if (!access_token) {
          return;
        }

        const response = await fetch('http://localhost:2800/user/getallreel', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: access_token
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reel data');
        }

        const reelData = await response.json();
        setReel(reelData);

        const userIds = reelData.map(item => item.user);
        fetchUserProfiles(userIds, access_token);
      } catch (error) {
        console.error('Error fetching data:', error);
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

    fetchData();
  }, []);

  return (
    <div>
      { reel && reel.map((item, index) => (
        <div key={index} id='reels-div'>
          <div>{userData[item.user] && userData[item.user].username}</div>
          <video className='video' muted controls src={item.cloudinaryUrl} />
        </div>
      ))}
      <Footer />
    </div>
  );
}
