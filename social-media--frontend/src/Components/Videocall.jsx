import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Videocall() {
    const [socket, setSocket] = useState();
    const [localStream, setLocalStream] = useState();

    useEffect(() => {
        const newSocket = io('http://localhost:7200');

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setSocket(newSocket);
            newSocket.send(JSON.stringify({ type: 'identify-as-sender' }));
        });

        // Cleanup function to close the socket connection when component unmounts
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('message', async (e) => {
                try {
                    const pc = new RTCPeerConnection();

                    const data = JSON.parse(e);
                    if (data.type === 'createAnswer') {
                        await pc.setRemoteDescription(data.sdp);
                    } else if (data.type === 'iceCandidate') {
                        await pc.addIceCandidate(data.candidate);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            });
        }
    }, [socket]);

    async function startsendingvideo() {
        try {
            const pc = new RTCPeerConnection();

            pc.onnegotiationneeded = async () => {
                console.log('onnegotiationneeded');
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    console.log('Sending offer:', pc.localDescription);
                    socket.send(JSON.stringify({ type: 'createOffer', sdp: pc.localDescription }));
                } catch (error) {
                    console.error('Error creating offer:', error);
                }
            };

            pc.onicecandidate = (e) => {
                console.log('onicecandidate', e);
                if (e.candidate) {
                    console.log('Sending ICE candidate:', e.candidate);
                    socket.send(JSON.stringify({ type: 'iceCandidate', candidate: e.candidate }));
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log('Received stream:', stream);
            setLocalStream(stream);
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
        } catch (error) {
            console.error('Error starting video:', error);
        }
    }

    return (
        <div>
            {/* Your component JSX */}
            {localStream && (
                <video autoPlay playsInline ref={(video) => {
                    if (video) {
                        video.srcObject = localStream;
                    }
                }} />
            )}
            <button onClick={startsendingvideo}>Send Video</button>
        </div>
    );
}
