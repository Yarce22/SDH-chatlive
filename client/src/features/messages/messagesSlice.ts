import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MessagesState {
  message: string;
  messages: string[];
  room: string;
}

 const initialState: MessagesState = {
  message: "",
  messages: [],
  room: "",
 }

 const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setMessages: (state, action: PayloadAction<string[]>) => {
      state.messages = action.payload;
    },
    setRoom: (state, action: PayloadAction<string>) => {
      state.room = action.payload;
    }
  }
 })

export const { setMessage, setMessages, setRoom } = messagesSlice.actions;
export default messagesSlice.reducer;
