import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userdata, setdata] = useState('');
const navigate=useNavigate();
  

  const senddata = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch("http://localhost:2800/user/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          fullname: fullname,
          username: username,
          email: email,
          password: password,
        }),
      });
      navigate('/');


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      

      const data = await response.json();
      setdata(data);
    } catch (error) {
      console.error('Error sending data:', error);
      
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
    <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl text-center font-bold mb-8">Registration Form</h1>
      <form onSubmit={senddata}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="fullname">
            Fullname
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            id="fullname"
            type="text"
            placeholder="Fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
