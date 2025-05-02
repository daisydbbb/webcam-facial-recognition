import { configureStore } from '@reduxjs/toolkit';
// We will add slices later

// redux store
export const store = configureStore({
  reducer: {
    // webcam: webcamReducer,
    // faces: facesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
