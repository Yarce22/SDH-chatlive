import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  myUsername: string;
  receiverUser: string;
  usersConnected: string[];
};

const initialState: UserState = {
  myUsername: document.cookie.split("=")[1] || "",
  receiverUser: "",
  usersConnected: []
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.myUsername = action.payload;
    },
    setReceiverUser: (state, action: PayloadAction<string>) => {
      state.receiverUser = action.payload;
    },
    setUsersConnected: (state, action: PayloadAction<string[]>) => {
      state.usersConnected = action.payload;
    }
  }
});

export const { setUser, setReceiverUser, setUsersConnected } = userSlice.actions;
export default userSlice.reducer;