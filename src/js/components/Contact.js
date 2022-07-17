import { useState, useEffect } from "react"
import { Card, Alert } from 'react-bootstrap'
import { useFirestore } from "../firebase/firestore"
import SendMessage from "./SendMessage"

export default function Contact(props) {
    const { getUserData } = useFirestore()

    const [error, setError] = useState('')
    const [userData, setUserData] = useState({})
    const [sendMessage, setSendMessage] = useState(false)

    // Runs once to retrieve the user (contacts) data
    useEffect(() => {
        getUserData(props.uid).then(resp => setUserData(resp.data)).catch( error => setError(error))
    }, [])
    
    function showSendMessage(e) {
        e.preventDefault()
        setSendMessage(true)
    }

    function hideSendMessage(){ setSendMessage(false) }

    return (
        <Card className="m-1 mb-3" style={{ cursor: "pointer" }}>
            <div style={{width:100, height:100}} className='overflow-hidden'>
                <Card.Img onClick={showSendMessage} variant="top" src={userData.photoURL ?? "https://via.placeholder.com/100"} />
            </div>

            <SendMessage 
                show={sendMessage} 
                handleClose={hideSendMessage} 
                name={userData.displayName} 
                uid={props.uid}
            />
        
            <Card.Body onClick={showSendMessage}>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Card.Title className="text-center">{userData.displayName || 'No name'}</Card.Title>
            </Card.Body>

        </Card>
    )
}
