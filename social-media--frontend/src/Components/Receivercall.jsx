import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function ReceiverCall() {
    const [socket, setSocket] = useState();
    const videoRef = useRef(null);
    const pcRef = useRef(null); // Use ref to keep track of the RTCPeerConnection
  
    useEffect(() => {
      const newSocket = io('http://localhost:7200');
  
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setSocket(newSocket);
        newSocket.send(JSON.stringify({ type: 'identify-as-receiver' }));
      });
  
      newSocket.on('message', async (e) => {
        const message = JSON.parse(e);
        if (message.type === 'createOffer') {
          try {
            pcRef.current = new RTCPeerConnection();
            pcRef.current.setRemoteDescription(message.sdp);
  
            pcRef.current.onicecandidate = (e) => {
              console.log(e);
              if (e.candidate) {
                newSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: e.candidate }));
              }
            };
  
            pcRef.current.ontrack = handleOnTrack;
  
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            newSocket.send(JSON.stringify({ type: 'createAnswer', sdp: pcRef.current.localDescription }));
          } catch (error) {
            console.error('Error creating answer:', error);
          }
        } else if (message.type === 'iceCandidate') {
          if (pcRef.current) {
            try {
              pcRef.current.addIceCandidate(message.candidate);
            } catch (error) {
              console.error('Error adding ice candidate:', error);
            }
          }
        }
      });
  
      // Cleanup function to close the socket connection when component unmounts
      return () => {
        newSocket.disconnect();
      };
    }, []);
  
    const handleOnTrack = (e) => {
        const video = document.createElement('video');
        // videoRef.current = video; // Assigning the video element to the videoRef
        document.body.appendChild(video);
        console.log('ontrack', e.streams);
      
        try {
          const stream = e.streams[0];
          const tracks = stream.getTracks();
          console.log(tracks);
      
          const videoTracks = tracks.filter(track => track.kind === 'video');
          if (videoTracks.length > 0) {
            const videoStream = new MediaStream();
            videoTracks.forEach(track => {
              videoStream.addTrack(track);
              console.log('videoStrream',videoStream);
              video.srcObject = videoStream;
              video.play();
            });
            // video.play();
          } else {
            console.error('No video track found');
          }
        } catch (error) {
          console.error('Error handling ontrack event:', error);
        }
      };
      
      
  
    return (
      <div>
        {/* <video ref={videoRef} autoPlay playsInline muted></video> */}
      </div>
    );
}