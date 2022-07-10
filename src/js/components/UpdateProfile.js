import { useRef, useState } from 'react'
import {Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import { useFirestore } from '../firebase/firestore'

export default function UpdateProfile() {
    const { currentUser, changeEmail, changePassword, changeProfile } = useAuth()

    const { updateUserData } = useFirestore()

    const emailRef = useRef()
    const nameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
  
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
  
    function handleSubmit(e) {
      e.preventDefault()
  
      if(passwordRef.current.value !== passwordConfirmRef.current.value){
        return setError('Passwords do not match.')
      }
      
      setError('')
      setLoading(true)

      const promises = []
      if (emailRef.current.value !== currentUser.email) {
        promises.push(changeEmail(emailRef.current.value))
      }
      if (passwordRef.current.value) {
        promises.push(changePassword(passwordRef.current.value))
      }
      if (nameRef.current.value !== currentUser.displayName) {
        // Todo: profile images
        promises.push(changeProfile(nameRef.current.value, null))
      }

      Promise.all(promises).then(() => {
        updateUserData(currentUser)
        navigate('/')
      }).catch((error) =>{
        setError(error.message)
      }).finally(() => {
        setLoading(false)
      })

    }
  
    return (
      <>
        <Card>
          <Card.Body>
            <h2 className='text-center mb-2'>Update Profile</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
              </Form.Group>
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="input" ref={nameRef} defaultValue={currentUser.displayName}/>
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} placeholder='Leave blank to keep the same'/>
              </Form.Group>
              <Form.Group id="passwordConfirm">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} placeholder='Leave blank to keep the same'/>
              </Form.Group>
              <Button className='w-100 mt-2' type="submit" disabled={loading}>Update</Button>
            </Form>
          </Card.Body>
        </Card>
        <div className='w-100 text-center mt-2'>
          <Link to="/">Cancel</Link>
        </div>
      </>
    )
}
