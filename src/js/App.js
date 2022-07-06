import React from 'react';
import { Container } from 'react-bootstrap';
import Register from './components/Register';
import { AuthProvider } from './firebase/auth';

function App() {

  return (
    <AuthProvider>
      <Container 
        className='d-flex align-items-center justify-content-center'
        style={{ minHeight: "100vh"}}
      >
        <div className='w-100' style={{maxWidth: "400px"}}>
          < Register />
        </div>
      </Container>
    </AuthProvider>
    
  );
}

export default App;
