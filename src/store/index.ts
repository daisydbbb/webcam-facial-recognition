import { configureStore } from '@reduxjs/toolkit';
import webcamReducer from './webcamSlice';
import facesReducer from './facesSlice';

// redux store
export const store = configureStore({
  reducer: {
    webcam: webcamReducer,
    faces: facesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
