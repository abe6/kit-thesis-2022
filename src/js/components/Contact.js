import { useState, useEffect } from "react"
import { Card, Button, Alert } from 'react-bootstrap'
import { useFirestore } from "../firebase/firestore"

export default function Contact(props) {
    const { getUserData } = useFirestore()

    const [error, setError] = useState('')
    const [userData, setUserData] = useState({})

    useEffect(() => {
        getUserData(props.uid).then(data => setUserData(data)).catch( error => setError(error))
    }, [])
    
    return (
        <Card className="m-1 w-25">
            <Card.Img variant="top" src="https://via.placeholder.com/150" />
            <Card.Body>
                <Card.Title>{userData.displayName || 'No name'}</Card.Title>
                <Card.Text>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    todo: photo && {props.uid} && JSON.stringify(userData)
                
                </Card.Text>
                <Button variant="primary">Button todo</Button>
            </Card.Body>
        </Card>
    )
}
