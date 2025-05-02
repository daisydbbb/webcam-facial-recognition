import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamFeed: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);

  const handleStart = () => {
    setIsWebcamOn(true);
  };

  const handleStop = () => {
    setIsWebcamOn(false);
  };

  return (
    <div className="container">
      <h2> 📸 Webcam Feed</h2>
      {isWebcamOn ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%', maxWidth: '600px' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            height: '400px',
            backgroundColor: '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Webcam is off 🚫
        </div>
      )}

      <div className="mt-3">
        <button className="btn btn-primary" onClick={handleStart} disabled={isWebcamOn}>
          Start Webcam
        </button>
        <button className="btn btn-danger mx-2" onClick={handleStop} disabled={!isWebcamOn}>
          Stop Webcam
        </button>
      </div>

    </div>
  );
};

export default WebcamFeed;
