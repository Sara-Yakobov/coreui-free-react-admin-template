import {createSlice} from '@reduxjs/toolkit';

const dialogueSlice = createSlice({
    name: 'dialogue',
    initialState: {
        showModal: false,
        message: '',
        callback: null,
    },
    reducers: {
        showDialogue(state,action){
            state.showModal = true
            state.message = action.payload.message
            state.callback = action.payload.callback
        },
        hideDialogue(state, action) {
            state.showModal = false
            state.message = ''
            state.callback = null
        },
    }}
);

export const dialogueActions = dialogueSlice.actions;

export default dialogueSlice;