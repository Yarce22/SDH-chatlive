import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  isOpen: boolean,
  chatOpen: boolean
}

 const initialState: MenuState = {
  isOpen: false,
  chatOpen: false
 }

 const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setOpenMenu: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setOpenChat: (state, action: PayloadAction<boolean>) => {
      state.chatOpen = action.payload;
    }
  }
 })

export const { setOpenMenu, setOpenChat } = menuSlice.actions;
export default menuSlice.reducer;
