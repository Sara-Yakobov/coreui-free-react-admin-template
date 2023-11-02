import {combineReducers, configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import dialogueMiddleware from './middleware';
import authSlice from "./auth";
import userSlice from "./user";
import dialogueSlice from './dialogue';


const combinedReducer = combineReducers({
    auth: authSlice.reducer,
    user: userSlice.reducer,
    dialogue: dialogueSlice.reducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/logout') {
        sessionStorage.clear();
        state = undefined;
    }
    return combinedReducer(state, action);
};
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(dialogueMiddleware),
});
export default store;