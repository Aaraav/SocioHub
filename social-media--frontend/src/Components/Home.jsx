import React,{useEffect,useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Fetchstory from './Fetchstory';
import Homeposts from './Homeposts';
import { io } from 'socket.io-client';
import { SocketContext } from '../Socketcontext';
export default function Home() {
    const socket = useContext(SocketContext);

    const navigate = useNavigate();
    // const [socket,setSocket]=useState(null);
    useEffect(() => {
        // const socket = io('http://localhost:4000', {
        //   transports: ['websocket']
        // });    
        const myid=localStorage.getItem('myid');
        // setSocket(socket);
        
        if(socket){
        socket.on('connect', () => {
          console.log('socketid', socket.id);
          socket.emit('setUserId', myid);
          
        });
        
        // socket.on('notification', ({message,senderid}) => {
        //     alert(message);
        //   });
        
        socket.on('disconnect', () => {
          console.log('socket disconnected');
        //   setSocket(null);
        });}
      }, []);
    return (
        <div className="bg-gray-900 text-white sm:min-h-screen"> {/* Apply background color here */}
            <nav className='home-nav'>
                {/* <img src='../assets/instagram.png'/> */}
                <h1>SocioHub</h1>
                <ul className='homenav-list'>
                    <li>notification</li>
                    <li onClick={()=>navigate('/messages')}>message</li>
                </ul>
            </nav>
            <hr style={{ marginTop: '3%' }} />

            <Fetchstory />
            <hr style={{ marginTop: '3%' }} />

            {/* <div className='footer'>
                <ul>
                    <li onClick={() => navigate('/home')}>Home</li>
                    <li onClick={() => navigate('/search')}>Search</li>
                    <li onClick={() => navigate('/uploadpost')}>Add</li>
                    <li onClick={() => navigate('/reels')}>Reels</li>
                    <li onClick={() => navigate('/profile')}>profile</li>
                </ul>
            </div> */}
            <Homeposts />

            <Footer />
        </div>
    );
}
