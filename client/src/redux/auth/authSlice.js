import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentData: null,
    loading: false,
    error: false,
    permission : false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        getOtpStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        getOtpSuccess: (state, action) => {
            state.loading = false,
                state.currentData = action.payload,
                state.error = false,
                state.permission = true
        },
        getOtpFailure: (state, action) => {
            state.loading = false, 
            state.error = action.payload,
            state.permission = false
        },
        verifyOtpStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        verifyOtpSuccess: (state, action) => {
            state.loading = false,
                state.currentData = action.payload,
                state.error = false,
                state.permission = true
        },
        verifyOtpFailure: (state, action) => {
            state.loading = false,
            state.error = action.payload,
            state.permission = false
        },
        resetPasswordStart: (state) => {
            state.loading = true;
            state.error = false;
        },
        resetPasswordSuccess: (state, action) => {
            state.loading = false,
                state.currentData = action.payload,
                state.error = false,
                state.permission = true
        },
        resetPasswordFailure: (state, action) => {
            state.loading = false,
            state.error = action.payload,
            state.permission = false
        }
    },
});

export const { getOtpStart, getOtpSuccess, getOtpFailure, resetPasswordFailure, resetPasswordStart, resetPasswordSuccess, verifyOtpFailure, verifyOtpStart, verifyOtpSuccess } = authSlice.actions;

export default authSlice.reducer;