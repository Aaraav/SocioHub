import { createSlice } from "@reduxjs/toolkit";

export const dpslice = createSlice({
  name: 'dp',
  initialState: {
    // Define your initial state here
    // For example:
    image: null,
   
  },
  reducers: {
   
    uploadImageSuccess(state, action) {
      
      state.image = action.payload;
    },
   
  }
});

export const {  uploadImageSuccess } = dpslice.actions;

export default dpslice.reducer;
