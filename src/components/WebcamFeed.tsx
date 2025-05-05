import React, { useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { startWebcam, stopWebcam } from '../store/webcamSlice';
import { setFaces, clearFaces } from '../store/facesSlice';
import * as faceapi from 'face-api.js';
import { loadModels } from '../utils/faceApiHelpers';
import FaceOverlay from './FaceOverlay';

const WebcamFeed: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const isWebcamOn = useSelector((state: RootState) => state.webcam.isActive);
  const faces = useSelector((state: RootState) => state.faces.faces);

  // Load models when component mounts
  useEffect(() => {
    loadModels();
  }, []);

  // Process each frame for face detection
  const processFrame = useCallback(async () => {
    if (webcamRef.current?.video && isWebcamOn) {
      const video = webcamRef.current.video as HTMLVideoElement;
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withAgeAndGender();

      // console.log('Detections:', detections);
      const facesData = detections.map((detection, idx) => ({
        id: `${idx}`,
        boundingBox: {
          x: detection.detection.box.x,
          y: detection.detection.box.y,
          width: detection.detection.box.width,
          height: detection.detection.box.height,
        },
        age: Math.round(detection.age),
        gender: detection.gender,
      }));

      dispatch(setFaces(facesData));

      // Draw detections on canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      }
    }
  }, [dispatch, isWebcamOn]);



  // Run detection loop when webcam is on
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isWebcamOn) {
      intervalId = setInterval(() => {
        processFrame();
      }, 100); // Run every 100ms
    } else {
      dispatch(clearFaces());
    }

    return () => clearInterval(intervalId);
  }, [isWebcamOn, processFrame, dispatch]);

  // Handlers
  const handleStart = () => {
    dispatch(startWebcam());
  };

  const handleStop = () => {
    dispatch(stopWebcam());
    dispatch(clearFaces());
  };

  return (
    <div className="container">
    <h2> 📸 Webcam Feed</h2>

    {isWebcamOn ? (
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%', maxWidth: '600px' }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            maxWidth: '600px',
          }}
        />
        {faces.map((face) => (
            <FaceOverlay
              key={face.id}
              boundingBox={face.boundingBox}
              age={face.age}
              gender={face.gender}
            />
          ))}
      </div>
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
        Webcam Stopped 🚫
      </div>
    )}

    <div className='mt-3'>
      <button className="btn btn-primary" onClick={handleStart} disabled={isWebcamOn}>
        Start Webcam
      </button>
      <button className="btn btn-danger mx-2" onClick={handleStop} disabled={!isWebcamOn} style={{ marginLeft: '1rem' }}>
        Stop Webcam
      </button>
    </div>
  </div>
  );
};

export default WebcamFeed;
