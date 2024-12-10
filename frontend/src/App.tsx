import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/view/Home';
import Admin from './components/view/Admin';
import EmailVerify from './components/emailVerify/EmailVerify';





function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user/verify/:token' element={<EmailVerify />} />
          
          <Route path='/home' element={<Home />} />
          <Route path='/admin' element={<Admin />} />



        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
