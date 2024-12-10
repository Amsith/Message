import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';



const Register = () => {
    const navigate = useNavigate()
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')



    const registerFunction = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.post('http://localhost:5001/api/user/register', {
                username,
                email,
                password
            });
            setLoading(false)
            setMessage('Verifiaction Link send your Email..')
            setTimeout(() => {
                navigate('/');
            }, 4000);
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message); // Set the server error message
            } else {
                setMessage('An unexpected error occurred. Please try again.'); // Fallback message
            }
            setLoading(false)
            setTimeout(() => {
                setMessage('');
            }, 5000);
        }
    }



    return (
        <>
            <div className="row mt-5 justify-content-center">
                <div className="col-md-5 col-lg-4 border border-primary border-2 p-4 rounded shadow">
                    <h3 className="text-center mb-4">Register</h3>
                    <form onSubmit={registerFunction}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" name="username" id="name" required onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" id="email" required onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" id="password" required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </div>
                        <div className="text-center">
                            <p>Already a member? <Link to="/" className="text-primary">Login</Link></p>
                        </div>
                        <div>
                            {message && <p className='text-danger text-center'>{message}</p>}
                        </div>
                        {/* Bootstrap Loading Spinner  */}
                        {loading && (
                            <div className="text-center my-3">
                                <Spinner variant="danger" animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        )}


                    </form>
                </div>
            </div>
        </>
    )
}

export default Register