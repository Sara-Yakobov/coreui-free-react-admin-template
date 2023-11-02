import {createSlice} from '@reduxjs/toolkit';

const userInfoSlice = createSlice({
        name: 'user',
        initialState: { userInfos: JSON.parse(sessionStorage.getItem('userdata')) || {first_name: "", last_name: "", user_email: "", uuid: "", domain: "", domain_uuid: ""},masquerade:false, location:undefined, route:"/"},
        reducers: {
            reset(state,action){
                sessionStorage.removeItem('userdata')
                state.userInfos = {first_name: "", last_name: "", user_email: "", uuid: "", domain: "", domain_uuid: ""};
            },
            update(state,action) {
                let infos = state.userInfos;
                let data = action.payload;
                sessionStorage.setItem("userdata", JSON.stringify({...infos, ...data}));
                state.userInfos = {...infos, ...data};
            },
            masquerade(state,action){
                let currState = state.masquerade;
                state.masquerade = !currState;
            },
            setLocation(state, action){
                let location = action.location;
                state.location = location;
            },
            setRoute(state, action){
                state.route = action.payload;
            }
        }
    }
);

export const userActions = userInfoSlice.actions;

export default userInfoSlice;