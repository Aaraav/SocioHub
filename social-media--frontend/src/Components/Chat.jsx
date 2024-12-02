import React, { useEffect, useState, useRef,useContext } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Footer from './Footer'
import { SocketContext } from '../Socketcontext';

export default function Chat() {
    const socket = useContext(SocketContext);

    const [message, setMessage] = useState('');
     const [sockett, setSocket] = useState(null);
    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const myId = localStorage.getItem('myid');
    const { id } = useParams();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        const fetchMessages = async () => {
            const myResponse = await fetch(`http://localhost:4000/chats/${myId}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const myData = await myResponse.json();
            setSentMessages(myData[0].message);

            const userResponse = await fetch(`http://localhost:4000/chats/${id}/${myId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const userData = await userResponse.json();
            setReceivedMessages(userData[0].message);
        }
        console.log(receivedMessages);

        fetchMessages();
    }, [myId, id]);

    // useEffect(() => {
    //     const newSocket = io('http://localhost:4000');
    //     setSocket(newSocket);

    //     return () => {
    //         if (newSocket) {
    //             newSocket.disconnect();
    //         }
    //     };
    // }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                socket.emit('setUserId', id);
            });

            socket.on('receiveMessage', (message) => {
                window.location.reload();

                if (message.senderId === id) {
                    setReceivedMessages(prev => [...prev, message.message]);
                                } else {
                    setSentMessages(prev => [...prev, message.message]);
                }
            });
           

            return () => {
                socket.off('connect');
                socket.off('receiveMessage');
            };
        }
    }, [socket, id]);

    useEffect(() => {
        if (socket) {
            if (myId) {
                socket.emit('join', myId);
            }
        }
    }, [socket, myId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [sentMessages, receivedMessages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (socket) {
            socket.emit('message', { message, userId: id, senderId: myId });
        }

        setSentMessages(prev => [...prev, message]);
        setMessage('');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <div className="flex-1 overflow-y-auto px-4 py-6">
                {sentMessages.map((msg, index) => (
                    <div key={`sent-${index}`} className="flex justify-end mb-2">
                        <div className="bg-green-500 text-white py-2 px-4 rounded-lg max-w-[75%]">
                            <h1>{msg}</h1>
                        </div>
                    </div>
                ))}

{receivedMessages.map((msg, index) => (
  <div key={`received-${index}`} className="flex mb-2">
    <div className="bg-gray-300 py-2 px-4 rounded-lg max-w-[75%]">
    <h1>{msg}</h1>
    </div>
  </div>
))}
                <div ref={messagesEndRef}></div>
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300 flex-shrink-0">
                <input
                    type='text'
                    placeholder='Type a message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <button type='submit' className="ml-4 px-6 py-2 rounded-lg bg-blue-500 text-white">Send</button>
            </form>
            <Footer/>
        </div>
    );
}
