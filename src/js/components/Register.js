import React from 'react'
import { useRef, useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../firebase/auth'

export default function Register() {
  const { register, currentUser } = useAuth()

  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError('Passwords do not match.')
    }

    try {
      setError('')
      setLoading(true)
      await register(emailRef.current.value, passwordRef.current.value)
    } catch (error) {
      //setError(JSON.stringify(error.message))
      setError(error.message)
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-2'>Sign Up</h2>
          {currentUser && currentUser.email}
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
            <Form.Group id="passwordConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button className='w-100 mt-2' type="submit" disabled={loading}>Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Already have an account? Log in
      </div>
    </>
  )
}
