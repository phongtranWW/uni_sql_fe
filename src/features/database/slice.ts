import { initialDatabase } from "@/data/mock_database";
import { createSlice } from "@reduxjs/toolkit";

const databaseSlice = createSlice({
  name: "database",
  initialState: initialDatabase,
  reducers: {},
});

export default databaseSlice.reducer;
