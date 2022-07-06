import { useRef, useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'

export default function Login() {
    const { login } = useAuth()

    const emailRef = useRef()
    const passwordRef = useRef()
  
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
  
    async function handleSubmit(e) {
      e.preventDefault()
  
      try {
        setError('')
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
        navigate("/");
      } catch (error) {
        setError(error.message)
      }
  
      setLoading(false)
    }
  
    return (
      <>
        <Card>
          <Card.Body>
            <h2 className='text-center mb-2'>Log In</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button className='w-100 mt-2' type="submit" disabled={loading}>Log in</Button>
            </Form>
            <div className='w-100 text-center mt-2'>
                <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div className='w-100 text-center mt-2'>
          Need an account? <Link to="/register">Register Now</Link>
        </div>
      </>
    )
}
