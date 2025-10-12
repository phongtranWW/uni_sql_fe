import { createSlice } from "@reduxjs/toolkit";

export interface ViewState {
  showSider: boolean;
}

const initialState: ViewState = {
  showSider: true,
};

export const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    toggleSider: (state) => {
      state.showSider = !state.showSider;
    },
  },
});

export const { toggleSider } = viewSlice.actions;

export default viewSlice.reducer;
