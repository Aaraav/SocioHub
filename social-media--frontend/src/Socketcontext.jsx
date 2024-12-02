// SocketContext.js
import { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      transports: ['websocket']
    });
    setSocket(newSocket);
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };