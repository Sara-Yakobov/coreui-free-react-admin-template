import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
        name: 'auth',
        initialState: { isLoggedIn:JSON.parse(sessionStorage.getItem('isLoggedIn'))||false },
        reducers: {
            login(state) {
                sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
                state.isLoggedIn = true;
            },
            logout(state) {
                sessionStorage.setItem("isLoggedIn", JSON.stringify(false));
                state.isLoggedIn = false;
            },
        }
    }
);

export const authActions = authSlice.actions;

export function logoutUser(state) {
    state.isLoggedIn = false;
}

export default authSlice;