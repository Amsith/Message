import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import HomeDashboard from './HomeDashboard'
import profile from '../../pic/profile.png'
import logo from '../../pic/logo.webp'
import './dashLeft.css'
import { IoSearch } from "react-icons/io5";
import axios from 'axios'
import ChatDashboard from './ChatDashboard'
import { useDispatch, useSelector } from 'react-redux'
import { logoutFail, logoutSuccess } from '../store/userSlice'

interface User {
    _id: any
    id: number; // Use the correct type based on your data, e.g., string if `id` is a string
    username: string;
    profileImage?: string; // Optional property if some users don't have profile images
}

const Dashboard = () => {


    const [users, setUsers] = useState<User[]>([]); // State to store the list of users
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.user.user);
    // Fetch users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/all/user', { withCredentials: true }); // API call to get all users
                setUsers(response.data.users); // Update state with fetched users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    console.log(users)


    // Logout function
    const logOut = (e: any) => {
        e.preventDefault();

        axios.post('http://localhost:5001/api/logout', {}, { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                dispatch(logoutSuccess())
                navigate('/');
            })


            .catch((error) => {
                console.error('Logout error:', error);
                const errorMessage = error.response?.data?.message;
                dispatch(logoutFail(errorMessage));
            });
    };

    return (
        <>
            <div className="dash row d-flex m-5 p-1 shadow-lg col-11 border border-primary">
                {/* Left Sidebar */}
                <div className="dash-left col-3 border-end">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center py-1 px-2 border-bottom">
                        <div className="me-3 logo">
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className="fw-bold text-primary">User: {user.username}</div>
                        <div className="ms-auto fs-4 text-secondary">:</div>
                    </div>

                    {/* Search Bar */}
                    <div className="d-flex align-items-center border rounded px-2 mb-2 bg-white">
                        <input
                            type="text"
                            className="form-control border-0 outline-none focus-ring focus-ring-light"
                            placeholder="Search"
                        />
                        <IoSearch className="fs-4 text-muted" />
                    </div>

                    <div className="chat-user-div">
                        {users.map((user, index) => (
                            <Link
                                key={index}
                                to={`/das/${user._id}`} // Generate a unique route for each user (e.g., /chat/1, /chat/2)
                                className="text-decoration-none text-dark" // Optional: remove default link styling
                            >
                                <div className="d-flex align-items-center my-1 border rounded p-2 chat-user">
                                    <div className="profile-container">
                                        <img
                                            src={user.profileImage || profile} // Use user's profile image or fallback
                                            alt={`${user.username}'s Profile`}
                                            className="profile-img"
                                        />
                                    </div>
                                    <div className="ms-3 fw-bold">{user.username}</div>
                                </div>
                            </Link>
                        ))}
                    </div>





                    {/* Sign Out Button */}
                    <button onClick={logOut} className="btn btn-primary w-100 ">Sign Out</button>
                </div>


                <div className='right col-9 '>
                    <Routes>
                        <Route path='/' element={<HomeDashboard />} />
                        <Route path='/:id' element={<ChatDashboard />} />
                    </Routes>
                </div>
            </div >


        </>
    )
}

export default Dashboard