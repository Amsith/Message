import React, { useEffect, useRef, useState } from 'react';
import profile from '../../pic/profile.png';
import '../view/chatDashBoard.css';
import { useDispatch } from 'react-redux';
import { messageFail } from '../store/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5001', { withCredentials: true } as any);


const ChatDashboard = () => {

  const [message, setMessage] = useState<string>('');
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [getMessage, setGetMessage] = useState<any[]>([]); // State to store the chat messages

  const [paramsUser, setParamsUser] = useState<any>({});
// for scroll bar
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5001/api/message/${id}`,
        { message },
        { withCredentials: true }
      );
      console.log(response.data);
      // Emit message to Socket.IO server
      socket.emit('sendMessage', response.data.newMessage);

      setMessage('');



    } catch (error) {
      // Typecast error as AxiosError to access its properties
      const axiosError = error as any; // Cast as `any` if you're unsure
      const errorResponse = axiosError?.response?.data.message;

      // Dispatch error message if it exists
      if (errorResponse === 'Please login to access') {
        dispatch(messageFail(errorResponse));
        navigate('/')
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };


  // fetching messages and param user to sho the name
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/message/${id}`, {
          withCredentials: true,
        });
        setGetMessage(response.data.messages); // Store retrieved messages
        setParamsUser(response.data.paramsUser); // Store retrieved messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for incoming messages using Socket.IO
    socket.on('receiveMessage', (newMessage: any) => {
      setGetMessage((prevMessages) => [...prevMessages, newMessage]); // Append new message
    });

    // Cleanup on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, [id]); // Re-fetch messages when chatWithId changes

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [getMessage]);

  return (
    <div className="chat-dashboard-container">
      {/* Profile Header */}
      <div className="header border-bottom d-flex align-items-center p-3">
        <img src={profile} alt="User Profile" className="profile-img" />
        <h5 className="ms-3">{paramsUser.username}</h5>
      </div>

      {/* Messages Section */}
      <div className="messages-container p-3">
        {getMessage.map((message, index) => (
          <div
            key={index}
            className={`message ${message.senderID === id ? 'receiver-message' : 'sender-message ms-auto'}`}
          >
            <p className="message-text">{message.message}</p>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
        ))}
          {/* Invisible div to scroll to bottom */}
          <div ref={messagesEndRef} />
      </div>


      <form onSubmit={sendMessage}>
        <div className="message-input-container p-2 d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit' disabled={message === ''} className="btn btn-primary">Send</button>
        </div>
      </form>
    </div>
  );
};

export default ChatDashboard;


