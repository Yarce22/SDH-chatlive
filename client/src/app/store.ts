import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice";
import messagesReducer from "../features/messages/messagesSlice";
import menuReducer from "../features/UI/menuSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messagesReducer,
    menu: menuReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
