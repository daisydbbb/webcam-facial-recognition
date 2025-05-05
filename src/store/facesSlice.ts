import { createSlice } from "@reduxjs/toolkit";

type FaceData = {
  id: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  age?: number;
  gender?: string;
}

type FacesState = {
  faces: FaceData[];
}

const initialState: FacesState = {
  faces: [],
};

const facesSlice = createSlice({
  name: "faces",
  initialState,
  reducers: {
    setFaces: (state, action) => {
      state.faces = action.payload;
    },
    clearFaces: (state) => {
      state.faces = [];
    },
  },
});

export const { setFaces, clearFaces } = facesSlice.actions;
export default facesSlice.reducer;

