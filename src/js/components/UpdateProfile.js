import { useRef, useState } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { Link,  useNavigate} from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import { useFirestore } from '../firebase/firestore'

export default function UpdateProfile() {
    const { currentUser, changeEmail, changePassword, changeProfile } = useAuth()

    const { updateUserData } = useFirestore()

    const emailRef = useRef()
    const nameRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const inputFile = useRef(null) 
  
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
  
    async function handleUpdate(e) {
      e.preventDefault()
      setError('')
      setLoading(true)
  
      if(passwordRef.current.value !== passwordConfirmRef.current.value){
        return setError('Passwords do not match.')
      }

      const promises = []
      if (inputFile.files) {
        
      }
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
        updateUserData()
        navigate('/')
      }).catch((error) =>{
        setError(error.message)
      }).finally(() => {
        setLoading(false)
      })

    }

    function showFileSelector(e) {
      e.preventDefault()
      setError('')
      try {
        inputFile.current.click();
      } catch (error) {
        setError('')
      }
    }

    function uploadFile(e) {
      e.preventDefault()
      setError('')
      setLoading(true)

      const file = e.target.files[0]
      console.log(file)
      console.log('todo: upload profile pic')

      setLoading(true)
    }
  
    return (
      <Container fluid className='d-flex align-items-center justify-content-center w-50 h-100'>
        <Container className='w-75'>
          <Card>

            <Card.Img src="https://via.placeholder.com/100"/>
            <Card.ImgOverlay> 
              <Form.Control type='file' onChange={uploadFile} ref={inputFile} style={{display: 'none'}}/>
              <Button variant='link' className='w-100 bg-light bg-opacity-50 mb-0 mt-auto' onClick={showFileSelector} disabled={loading}>Upload New Image</Button>
              {error && <Alert variant='danger' className='my-2'>{error}</Alert>}
            </Card.ImgOverlay>

            <Card.Body>
              <h2 className='text-center mb-2'>Update Profile</h2>
              
              <Form onSubmit={handleUpdate}>
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
        </Container>
      </Container>
    )
}
