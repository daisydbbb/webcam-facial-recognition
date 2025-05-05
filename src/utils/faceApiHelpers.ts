import * as faceapi from 'face-api.js';

export async function loadModels() {
  const MODEL_URL = '/models';

  try {
    console.log('Loading face detection models...');

    await Promise.all([
      // face detection model
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      // face landmark model for accurate face detection
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      // age and gender model
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    ]);

    console.log('Face detection models loaded successfully');
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw error;
  }
}
