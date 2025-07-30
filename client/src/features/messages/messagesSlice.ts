import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Message {
  message: string;
  timestamp: string;
  sender: string;
}

interface MessagesState {
  message: string;
  messages: Message[];
  room: string;
}

 const initialState: MessagesState = {
  message: "",
  messages: [] as Message[],
  room: "",
 }

 const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setRoom: (state, action: PayloadAction<string>) => {
      state.room = action.payload;
    }
  }
 })

export const { setMessage, setMessages, addMessage, setRoom } = messagesSlice.actions;
export default messagesSlice.reducer;
