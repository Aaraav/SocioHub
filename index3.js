const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Set up CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Adjust the origin based on your client's URL
    credentials: true // Specify the allowed HTTP methods
};

app.use(cors({
    origin: '*',
    credentials: true
}));

// Enable CORS for Socket.IO
const io = socketio(server, {
    cors: corsOptions,
});

const port = 7200;

let sendersocket=null;
let receiversocket=null;

io.on('connection',(socket)=>{
    console.log('A client connected', socket.id);

    socket.on('message',function message(data){
        const message= JSON.parse(data);

        if(message.type === 'identify-as-sender'){
            console.log('sender-set');
            sendersocket=socket;
        }
        else if(message.type === 'identify-as-receiver'){
            receiversocket=socket;
            console.log('receiver-set');
        }

        else if(message.type==='createOffer'){
            if(!receiversocket){
                console.log('receiver socket not available');
            }
            console.log('offer receiver');
            receiversocket.send(JSON.stringify({type:'createOffer',sdp:message.sdp}));
        }
        else if(message.type==='createAnswer'){
            if(!sendersocket){
                console.log('sender socket not available');
            }
            console.log('answer receiver');
            sendersocket.send(JSON.stringify({type:'createAnswer',sdp:message.sdp}));
        }
        else if(message.type==='iceCandidate'){
            if(socket===sendersocket){
                receiversocket.send(JSON.stringify({type:'iceCandidate',offer:message.candidate}));
            }
            else if(socket===receiversocket){
                sendersocket.send(JSON.stringify({type:'iceCandidate',offer:message.candidate}));
            }
        }
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
