import './App.css';
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Admin from './components/view/Admin';
import EmailVerify from './components/emailVerify/EmailVerify';
import { useEffect } from 'react';
import store from './components/store/store';
import GetUser from './components/store/action/actions';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Dashboard from './components/view/Dashboard';


function App() {

  useEffect(() => {
    store.dispatch(GetUser())
  }, [])





  return (
    <>

      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user/verify/:token' element={<EmailVerify />} />
          {/* Protected Routes */}
          <Route path="/das/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </BrowserRouter >

    </>
  );
}

export default App;
