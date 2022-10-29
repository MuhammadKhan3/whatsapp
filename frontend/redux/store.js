import { configureStore } from '@reduxjs/toolkit'
import messageSlice from './messageSlice'

export const store = configureStore({
  reducer: {messageSlice:messageSlice},
})