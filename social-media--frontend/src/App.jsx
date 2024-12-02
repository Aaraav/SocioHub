import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Uploadpost from './Components/Uploadpost';
import './App.css';
import Logout from './Components/Logout';
import DP from './Components/DP';
import Editprofile from './Components/Editprofile';
import Reel from './Components/Reel';
import Home from './Components/Home';
import Live from './Components/Live';
import Search from './Components/Search';
import Otherprofile from './Components/Otherprofile';
import Reels from './Components/Reels.jsx';
import { useContext } from 'react';   
import { ViewContext } from './Components/Context/ViewProvider.jsx';
import Followers from './Components/Followers.jsx';
import Following from './Components/Following.jsx';
import Comments from './Components/Comments.jsx';
import Story from './Components/Story.jsx';
import Menuu from './Components/Menuu.jsx';
import Chat from './Components/Chat.jsx';
import Message from './Components/Message.jsx';
import Videocall from './Components/Videocall.jsx';
import Receivercall from './Components/Receivercall.jsx';
import { io } from 'socket.io-client';
function App() {
  const {id,setmyid,myid}=useContext(ViewContext);
  const [socket,setSocket]=useState(null);
  // useEffect(() => {
  //   const socket = io('http://localhost:4000', {
  //     transports: ['websocket']
  //   });    
  //   const id=localStorage.getItem('myid');
  //   setSocket(socket);
    
  //   socket.on('connect', () => {
  //     console.log('socketid', socket.id);
  //     socket.emit('join', id);
      
      
  //   });
  //   socket.on('notification', ({message, senderId}) => {
  //     console.log('message', message);
  //   });
    
  //   socket.on('disconnect', () => {
  //     console.log('socket disconnected');
  //     setSocket(null);
  //   });
  // }, []);
  
  return (
    
    <Router>
    <div className="App">
      <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route path='/profile' element={<Profile/>}/>
        <Route path='/uploadpost' element={<Uploadpost/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='/uploaddp' element={<DP/>}/>
        <Route path='/editprofile' element={<Editprofile/>}/>
        <Route path='/uploadreel' element={<Reel/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/live' element={<Live/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path="/otherprofile/:id" element={<Otherprofile/>}/>
        <Route path="/follower/otherprofile/:id" element={<Otherprofile/>}/>

        <Route path='/reels' element={<Reels/>}/>
        <Route path="/follower/:myid" element={<Followers/>}/>
        <Route path="/following/:myid" element={<Following/>}/>
<Route path='/comments' element={<Comments/>}/>
<Route path='/uploadstory' element={<Story/>}/>
<Route path='/menu' element={<Menuu/>}/>
<Route path="/chat/:id" element={<Chat/>}/>
<Route path='/video/sender' element={<Videocall/>}/>
<Route path='/video/receiver' element={<Receivercall/>}/>
<Route path="/messages" element={<Message/>}/>

      </Routes>
    </div>
  </Router>
  );
}

export default App;
