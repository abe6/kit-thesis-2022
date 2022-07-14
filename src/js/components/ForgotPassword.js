import { useRef, useState } from 'react'
import {Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../firebase/auth'

export default function ForgotPassword() {
    const { resetPassword } = useAuth()

    const emailRef = useRef()
  
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
  
    async function handleSubmit(e) {
      e.preventDefault()
  
      try {
        setError('')
        setMessage('')
        setLoading(true)
        await resetPassword(emailRef.current.value)
        setMessage("Check you inbox for password reset instructions.")
      } catch (error) {
        setError(error.message)
      }
  
      setLoading(false)
    }
  
    return (
      <Container fluid className='d-flex align-items-center justify-content-center w-50 h-100'>
        <Container>
          <Card>
            <Card.Body>
              <h2 className='text-center mb-2'>Password Reset</h2>
              {message && <Alert variant='success'>{message}</Alert>}
              {error && <Alert variant='danger'>{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Button className='w-100 mt-2' type="submit" disabled={loading}>Reset Password</Button>
              </Form>
              <div className='w-100 text-center mt-2'>
                  <Link to="/login">Login</Link>
              </div>
            </Card.Body>
          </Card>
          <div className='w-100 text-center mt-2'>
            Need an account? <Link to="/register">Register Now</Link>
          </div>
        </Container>
      </Container>
    )
}
