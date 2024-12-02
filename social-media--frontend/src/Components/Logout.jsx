import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
    const navigate=useNavigate();
  useEffect(() => {
    const logoutUser = async () => {
      try {
        const access_token = localStorage.getItem('access_token');

        if (!access_token) {
          console.error('Access token not found in localStorage');
          return;
        }

        const response = await fetch('http://localhost:2800/user/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
            localStorage.removeItem('access_token');
            navigate('/');
          console.log('Logout successful');
          
         
        } else {
          console.error('Logout failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during logout:', error.message);
      }
    };

    logoutUser();
  }, []);

  return (
    <div>
      {/* You can add a loading spinner or a message here if needed */}
      Logging out...
    </div>
  );
};

export default Logout;
