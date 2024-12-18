import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for the user
interface UserState {
    user: any | null; // Initially, there is no user logged in
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;  // You need to include this in the state
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,  // Initially, the user is not authenticated
};

// Create a slice for the user
const userSlice = createSlice({
    name: 'user',
    initialState,  // Use the initialState variable instead of hardcoding
    reducers: {
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false; // Correctly set isAuthenticated to true
            console.log("redux data:", state.user);
            console.log("Isauthenticate from:", state.isAuthenticated)
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isAuthenticated = false;
            state.loading = false;
        },
        loadUserRequest: (state) => {
            state.user = null; // Clear any existing user data
            state.isAuthenticated = false; // User is not authenticated during the request
            state.loading = true; // Set loading to true
        },
        loadUserSuccess: (state, action: PayloadAction<any>) => {
            state.user = action.payload; // Set the user data from the payload
            state.isAuthenticated = true; // Mark the user as authenticated
            state.loading = false; // Stop the loading state
        },
        loadUserFail: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload; // Store the error message in the state
            state.user = null; // Clear any user data
            state.isAuthenticated = false; // Mark as not authenticated
            state.loading = false; // Stop the loading state
        }, 
        logoutSuccess: (state) => {
            state.user = null; // Clear the user data on logout
            state.isAuthenticated = false; // Set isAuthenticated to false on logout
        },
        logoutFail: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload; // Store the error message
            state.isAuthenticated = true;
        },
        messageFail: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload; // Store the error message
            state.user = null;
            state.isAuthenticated = false;
        },

    },
});

export const { setUser, setError, logoutSuccess,logoutFail,loadUserRequest,loadUserSuccess, loadUserFail,messageFail} = userSlice.actions;

export default userSlice.reducer;
