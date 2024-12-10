import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmailVerify = () => {
    const { token } = useParams<{ token: string }>(); // Get the token from the URL
    const [message, setMessage] = useState<string>('Verifying your email...');

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/user/verify/${token}`);
                setMessage(response.data.message);
                console.log(response.data);

            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('Something went wrong. Please try again.');
                }
            }
        };

        if (token) {
            verifyUser();
        }
    }, [token]);

    return (
        <div className="container text-center mt-5">
            <h1>Email Verification</h1>
            <h4>{message}</h4>
        </div>
    );
};

export default EmailVerify;
