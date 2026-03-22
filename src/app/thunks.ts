import { createAsyncThunk } from "@reduxjs/toolkit";

export function createAppThunk<Returned, Arg>(
  typePrefix: string,
  payloadCreator: (arg: Arg) => Promise<Returned>,
) {
  return createAsyncThunk<Returned, Arg, { rejectValue: string }>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        return await payloadCreator(arg);
      } catch (error) {
        return rejectWithValue(
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    },
  );
}
