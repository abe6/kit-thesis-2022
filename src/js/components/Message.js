import { useState, useEffect, useRef } from "react"
import { Card, Button, Alert, Row, Col } from 'react-bootstrap'
import { useAuth } from "../firebase/auth"
import { useFirestore } from "../firebase/firestore"
import SendMessage from "./SendMessage"

export default function Message(props) {
    // How long a message is considered 'new' for, in milliseconds
    const NEW_TIME = 60000 // 1 min

    const sentAt = new Date(props.message.sentAt)

    const { getUserData, removeMessageFrom } = useFirestore()
    const { currentUser } = useAuth()

    const [error, setError] = useState('')
    const [userData, setUserData] = useState({})
    const [sendMessage, setSendMessage] = useState(false)
    const [borderColor, setBorderColor] = useState(((Date.now() - sentAt) < NEW_TIME) ? 'success' : '')

    // Run once to reset the borde color after some time
    useEffect(() => {
        setTimeout(() => setBorderColor(''), NEW_TIME);
      });

    // Runs once to retrieve the user (sender) data
    useEffect(() => {
        getUserData(props.message.sender).then(resp => setUserData(resp.data)).catch( error => setError(error))
    }, [])

    async function onRemove(e){
        e.preventDefault()
        setError('')

        removeMessageFrom(currentUser.uid, props.message).catch(error => setError(error))
    }

    function showSendMessage() { setSendMessage(true) }

    function hideSendMessage(){ setSendMessage(false) }

    return (
        <Card className="m-1" border={borderColor} style={{minWidth:300, minHeight:300}}>
            <Card.Body>
                <Card.Title>From: {userData.displayName || 'No name'}</Card.Title>
                <Card.Subtitle className="text-muted">{sentAt.toLocaleString()}</Card.Subtitle>
                <Card.Text className="mt-2">
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {props.message.text}
                
                </Card.Text>
                
            </Card.Body>
            <Card.Footer className={"border-top border-"+borderColor}>
                <Row className="d-flex align-items-center justify-content-end">
                    <Col md="auto"> <Button size="sm" variant="" onClick={onRemove}>Delete</Button> </Col>
                    <Col md="auto"> 
                        <SendMessage 
                            show={sendMessage} 
                            handleClose={hideSendMessage}
                            handleShow={showSendMessage}
                            name={userData.displayName} 
                            uid={props.message.sender} 
                            btntext="Reply"
                        /> 
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    )
}
