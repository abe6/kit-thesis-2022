import { Alert, Container, Dropdown, Stack, Image } from 'react-bootstrap'
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
        <Container fluid className='w-100 h-100 p-0'>

            <Stack direction='horizontal' className='mt-2 mb-1'>
                <h1 className='ms-auto ps-5'>{title}</h1>

                <Dropdown className='ms-auto'>
                    <Dropdown.Toggle as={Image} src='https://via.placeholder.com/50' roundedCircle />

                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/update-profile"> Update profile </Dropdown.Item>
                        <Dropdown.Item as='button' onClick={handleLogout}> Log Out </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </Stack>

            {error && <Alert variant='danger'>{error}</Alert>}

            <MessagesList/>

            <FriendsList/>

        </Container>
    )
}
