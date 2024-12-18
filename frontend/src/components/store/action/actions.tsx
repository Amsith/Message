import { Dispatch } from 'redux';
import axios from 'axios';
import { loadUserRequest, loadUserSuccess, loadUserFail } from '../userSlice'; // Adjust the import path



// Thunk action to get user data
export const GetUser = () => async (dispatch: Dispatch) => {
  dispatch(loadUserRequest());
  try {
    const response = await axios.get('http://localhost:5001/api/logedin/user', {
      withCredentials: true
    });
    
    // Assuming response.data.user contains the user data
    dispatch(loadUserSuccess(response.data.user));
  } catch (error) {
    dispatch(loadUserFail('Failed to load user')); // Or use a more descriptive message based on error
  }
};


export default GetUser