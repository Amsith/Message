import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, } from 'react-router-dom';
import { setError, setUser } from '../store/userSlice';



const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch();

    // to check the user is login or not
    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated)


    // login Function
    const LoginFunction = async (e: any) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:5001/api/login', {
                email, password
            }, { withCredentials: true })





            const userData = response?.data.user;
            dispatch(setUser(userData));

            const user = response.data.user;
            if (user.userRole === 'admin') {
              navigate('/admin'); // Navigate to admin page if user is an admin
            } else {
              navigate('/das'); // Navigate to home page if user is not an admin
            }

        } catch (error: any) {
            console.log(error)
            // Check if the error response has a message
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message); // Set the server error message
            } else {
                setMessage('An unexpected error occurred. Please try again / Check the serveside'); // Fallback message
            }
            setTimeout(() => {
                setMessage('');
            }, 5000);

            dispatch(setError(error?.response?.data?.message));
            console.log(error);
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/das/')
        }
    }, [isAuthenticated, navigate])



    return (
        <>
            <div className='text-center mt-5'>
                <h2>Message System</h2>
            </div>
            <div className="row mt-5 justify-content-center">
                <div className="col-md-5 col-lg-4 border border-primary border-2 p-4 rounded shadow">
                    <h3 className="text-center mb-4">Login</h3>
                    <form onSubmit={LoginFunction}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" id="email" required onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" id="password" required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </div>
                        <div className='text-center mb-4'>
                            <Link to='http://localhost:5001/auth/google'>  Login by Google</Link>
                        </div>
                        <div className="text-center">
                            <p>Not a member? <Link to="/register" className="text-primary">Register</Link></p>
                        </div>
                    </form>
                    <div>
                        {message && <p className='text-center text-danger'>{message}</p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
