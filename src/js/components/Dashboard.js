import { Button, Alert, Container } from 'react-bootstrap'
import { useState } from 'react'
import { useAuth } from '../firebase/auth'
import { Link, useNavigate} from 'react-router-dom'
import FriendsList from './FriendsList'
import MessagesList from './MessagesList'

export default function Dashboard() {

    const [error, setError] = useState('')
    const { logout, currentUser } = useAuth()

    const navigate = useNavigate()

    async function handleLogout(){
        setError('')

        try {
            await logout()
            navigate('/login')
        } catch (error) {
            setError(error.message)
        }
    }

    const title = (currentUser.displayName) ? `Welcome, ${currentUser.displayName}` : 'Dashboard'
    
    return (
        <Container fluid className='w-100 h-100 mt-3 mb-2 mx-0 px-0'>

            <h1 className='text-center mb-2'>{title}</h1>

            {error && <Alert variant='danger'>{error}</Alert>}

            <MessagesList/>

            <FriendsList/>

            <Link to="/update-profile" className='btn btn-primary w-100 mt-3'>Update profile</Link>
                
            <div className='w-100 text-center mt-2'>
                <Button variant='link' onClick={handleLogout}>Log Out</Button>
            </div>

        </Container>
    )
}
