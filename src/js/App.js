import React from 'react';
import { Container } from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './firebase/auth';
import PrivateRoute from './components/PrivateRoute'
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import UpdateProfile from './components/UpdateProfile';

function App() {

  return (
    <Container 
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: "100vh"}}
    >
      <div className='w-100' style={{maxWidth: "400px"}}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Private routes */}
              <Route exact path="/" element={
                <PrivateRoute>
                  <Dashboard/> 
                </PrivateRoute>
              }/>
              <Route path="/update-profile" element={
                <PrivateRoute>
                  <UpdateProfile/>
                </PrivateRoute>
              }/>

              {/* Public routes */}
              <Route path="/register" element={<Register/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
    
  );
}

export default App;
