import { useState, useEffect } from "react"
import { Card, Button, Alert, ButtonGroup, Row, Col } from 'react-bootstrap'
import { useAuth } from "../firebase/auth"
import { useFirestore } from "../firebase/firestore"
import SendMessage from "./SendMessage"

export default function Message(props) {

    const { getUserData, removeMessageFrom } = useFirestore()
    const { currentUser } = useAuth()

    const [error, setError] = useState('')
    const [userData, setUserData] = useState({})

    // Runs once to retrieve the user (sender) data
    useEffect(() => {
        getUserData(props.message.sender).then(data => setUserData(data)).catch( error => setError(error))
    }, [])

    const sentAt = new Date(props.message.sentAt).toLocaleString()

    async function onRemove(e){
        e.preventDefault()
        setError('')


        removeMessageFrom(currentUser.uid, props.message).catch(error => setError(error))
    }

    return (
        <Card className="m-1 mb-3 w-25" border="dark">
            <Card.Body>
                <Card.Title>From: {userData.displayName || 'No name'}</Card.Title>
                <Card.Subtitle className="text-muted">{sentAt}</Card.Subtitle>
                <Card.Text>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    todo: other message contents <br/> {JSON.stringify(props.message)}
                
                </Card.Text>
                
            </Card.Body>
            <Card.Footer>
                <Row className="d-flex align-items-center justify-content-end">
                    <Col md="auto"> <SendMessage name={userData.displayName} uid={props.message.sender} btntext="Reply"/> </Col>
                    <Col md="auto"> <Button size="sm" variant="primary" onClick={onRemove}>Delete</Button> </Col>
                </Row>
            </Card.Footer>
        </Card>
    )
}
