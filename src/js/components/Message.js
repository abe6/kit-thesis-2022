import { useState, useEffect } from "react"
import { Card, Button, Alert } from 'react-bootstrap'
import { useFirestore } from "../firebase/firestore"

export default function Message(props) {

    const { getUserData } = useFirestore()

    const [error, setError] = useState('')
    const [userData, setUserData] = useState({})

    // Runs once to retrieve the user (sender) data
    useEffect(() => {
        getUserData(props.message.sender).then(data => setUserData(data)).catch( error => setError(error))
    }, [])

    return (
        <Card className="m-1 w-25">
            <Card.Body>
                <Card.Title>From: {userData.displayName || 'No name'}</Card.Title>
                <Card.Text>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    todo: other message contents <br/> {JSON.stringify(props.message)}
                
                </Card.Text>
                <Button variant="primary">Button todo</Button>
            </Card.Body>
        </Card>
    )
}
