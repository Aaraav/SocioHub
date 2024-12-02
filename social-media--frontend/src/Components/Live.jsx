import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from './Footer';

export default function Live() {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const navigate = useNavigate();

    const handleStartCaptureClick = () => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: 'video/webm'
        });
        mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorderRef.current.start();
    };

    const handleDataAvailable = ({ data }) => {
        if (data.size > 0) {
            setRecordedChunks(prev => prev.concat(data));
        }
    };

    const handleStopCaptureClick = () => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    };

    const handleDownload = () => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: 'video/webm'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = 'react-webcam-stream-capture.webm';
            a.click();
            window.URL.revokeObjectURL(url);
            alert('Now you can post that live as the reel');
            setRecordedChunks([]);
            navigate('/profile');
        }
    };

    return (
        <div className='bg-gray-900 min-h-screen'>
        <div className="bg-gray-900 text-white h-[90vh]  flex flex-col items-center justify-center">
            <Webcam audio={true} id='live-video' ref={webcamRef} />
            {capturing ? (
                <button onClick={handleStopCaptureClick} className="my-4 px-4 py-2 bg-red-600 text-white rounded-md">Stop Capture</button>
            ) : (
                <button onClick={handleStartCaptureClick} className="my-4 px-4 py-2 bg-green-600 text-white rounded-md">Start Capture</button>
            )}
            {recordedChunks.length > 0 && (
                <button onClick={handleDownload} className="my-4 px-4 py-2 bg-blue-600 text-white rounded-md">Download</button>
            )}
            <Footer />
        </div>
        </div>
    );
}
