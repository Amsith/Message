import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';




const Home = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>('');
  const [getMessage, setGetMessage] = useState<any[]>([]);

  // Send message function
  const sendMessage = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5001/api/message',
        { message },
        { withCredentials: true }
      );
      console.log(response.data);
      setMessage('');
      retriveMessage(); // Fetch messages again after sending
    } catch (error) {
      console.log(error);
    }
  };

  // Retrieve messages function
  const retriveMessage = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/message',
        { withCredentials: true }
      );
      // Ensure that the response structure contains the 'messages' field
      setGetMessage(response.data.messages); // Set the array of messages

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retriveMessage();
  }, []);

  // Logout function
  const logOut = (e: any) => {
    e.preventDefault();
    axios
      .post('http://localhost:5001/api/logout',{}, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="text-center">Messages</h2>
            <div className="card p-3 shadow">
              <button onClick={logOut} className="btn btn-danger mb-4 w-25 ms-auto ">
                Logout
              </button>
              <div className="message-container">
                <div className="messages mb-3 text-end pe-3" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                  {getMessage.map((msg, index) => (
                    <div key={index} >
                      <p>{msg.message}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
