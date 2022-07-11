import { Card, Button, Alert } from 'react-bootstrap'
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
        <>
            <Card>
                <Card.Body>
                    <h2 className='text-center mb-2'>{title}</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <strong>Email: </strong>{currentUser.email} 
                    <MessagesList/>
                    <FriendsList/>
                    <Link to="/update-profile" className='btn btn-primary w-100 mt-3'>Update profile</Link>
                </Card.Body>
            </Card>
            <div className='w-100 text-center mt-2'>
                <Button variant='link' onClick={handleLogout}>Log Out</Button>
            </div>
        </>
    )
}
