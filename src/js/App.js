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
import { FirestoreProvider } from './firebase/firestore';
import { StorageProvider } from './firebase/storage';

function App() {

  return (
    <Container fluid="sm" className='d-flex align-items-center justify-content-center vw-100 vh-100 m-auto p-0'>
        <Router>
          <AuthProvider>
            <FirestoreProvider>
              <StorageProvider>
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
              </StorageProvider>
            </FirestoreProvider>
          </AuthProvider>
        </Router>
    </Container>
    
  );
}

export default App;
