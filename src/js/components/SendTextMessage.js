import { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Alert } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useFirestore } from '../firebase/firestore';

export default function SendTextMessage(props) {

    const { state } = useLocation()
    const { uid } = state

    const [error, setError] = useState('')
    const [userData, setUserData] = useState('')

    const { getUserData } = useFirestore()

    // Runs once to retrieve the userdata
    useEffect(() => {
        getUserData(uid).then(resp => setUserData(resp.data)).catch( error => setError(error))
    }, [])
    
    return (
        <Container fluid className='w-100 h-100 mt-5 p-0'>
        {error && <Alert variant='danger'>{error}</Alert>}

            <Row>
                <Col md='auto'>
                    <Image src='https://via.placeholder.com/400x700?text=Camera+Preview'/>

                    <div className='w-100 text-center mt-2'>
                        <Link to="/">Cancel</Link>
                    </div>
                </Col>
                <Col>
                    <h2 className='text-center mb-2'>Send a message to {userData.displayName ?? "User"}</h2>
                </Col>
            </Row>

        </Container>
    )
}
