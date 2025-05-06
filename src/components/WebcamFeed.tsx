import React, { useRef, useEffect, useCallback, useState } from 'react';
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
  const dispatch = useDispatch();
  const isWebcamOn = useSelector((state: RootState) => state.webcam.isActive);
  const faces = useSelector((state: RootState) => state.faces.faces);
  const [isLoading, setIsLoading] = useState(true);

  // Load models when component mounts
  useEffect(() => {
    const initializeModels = async () => {
      try {
        await loadModels();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
        setIsLoading(false);
      }
    };
    initializeModels();
  }, []);

  // Process each frame for face detection
  const processFrame = useCallback(async () => {
    if (!webcamRef.current?.video || !isWebcamOn) {
      dispatch(clearFaces());
      return;
    }

    const video = webcamRef.current.video as HTMLVideoElement;
    if (!video.videoWidth || !video.videoHeight) {
      console.log('Video dimensions are not ready yet');
      return;
    }

    try {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withAgeAndGender();

      if (!detections || detections.length === 0) {
        dispatch(clearFaces());
        return;
      }

      const facesData = detections.map((detection, idx) => ({
        id: `${idx}`,
        boundingBox: {
          x: Math.round(detection.detection.box.x),
          y: Math.round(detection.detection.box.y),
          width: detection.detection.box.width,
          height: detection.detection.box.height,
        },
        age: Math.round(detection.age),
        gender: detection.gender,
      }));

      dispatch(setFaces(facesData));

    } catch (error) {
      console.error('Error processing frame:', error);
      dispatch(clearFaces());
    }
  }, [dispatch, isWebcamOn]);

  // Run detection loop when webcam is on
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isWebcamOn) {
      intervalId = setInterval(() => {
        processFrame();
      }, 300); // Run every 300ms
    } else {
      dispatch(clearFaces());
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      dispatch(clearFaces());
    };
  }, [isWebcamOn, processFrame, dispatch]);

  const handleStart = () => {
    dispatch(startWebcam());
  };

  const handleStop = () => {
    dispatch(stopWebcam());
    dispatch(clearFaces());
  };

  return (
    <div className="container px-3 py-4">
      <h2 className="text-center mb-4">📸 Webcam Feed</h2>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : isWebcamOn ? (
        <div className="webcam-container position-relative mx-auto" style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
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
          className="mx-auto d-flex align-items-center justify-content-center"
          style={{
            width: '100%',
            maxWidth: '600px',
            height: '400px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '2px dashed #dee2e6',
            transition: 'all 0.3s ease'
          }}
        >
          <p className="text-muted mb-0">Webcam Stopped 🚫</p>
        </div>
      )}

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button
          className="btn btn-primary px-4 py-2"
          onClick={handleStart}
          disabled={isWebcamOn}
          style={{
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            minWidth: '120px'
          }}
        >
          Start Webcam
        </button>
        <button
          className="btn btn-danger px-4 py-2"
          onClick={handleStop}
          disabled={!isWebcamOn}
          style={{
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            minWidth: '120px'
          }}
        >
          Stop Webcam
        </button>
      </div>
    </div>
  );
};

export default WebcamFeed;





// Draw detections on canvas
// if (canvasRef.current) {
//   const canvas = canvasRef.current;
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   const displaySize = { width: video.videoWidth, height: video.videoHeight };
//   const resizedDetections = faceapi.resizeResults(detections, displaySize);

//   const ctx = canvas.getContext('2d');
//   if (ctx) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     faceapi.draw.drawDetections(canvas, resizedDetections);
//     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//   }
// }
