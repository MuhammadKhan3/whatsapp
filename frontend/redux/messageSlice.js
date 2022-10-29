import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',authorize:'',messages:[],lmessage:[],peerid:null
}
export const messageSlice = createSlice({
  name: 'messageSlice',
  initialState,
  reducers: {
    setPeerid:(state,action)=>{
      state.peerid=action.payload;
    },
    setmessage:(state,action)=>{
      state.message=action.payload;
    },
    setmessages:(state,action)=>{
      state.messages=action.payload;
    },
    setmessagesend:(state,action)=>{
      
      state.messages.push(action.payload);
    },
    setlmessage:(state,action)=>{
      state.lmessage=action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const message_action = messageSlice.actions

export default messageSlice.reducer;