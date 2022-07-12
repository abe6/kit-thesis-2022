import { useState, useEffect, useBetween } from "react"
import { Card, Alert } from 'react-bootstrap'
import { useFirestore } from "../firebase/firestore"
import SendMessage from "./SendMessage"

export default function Contact(props) {
    const { getUserData } = useFirestore()

    const [error, setError] = useState('')
    const [userData, setUserData] = useState({})

    // Runs once to retrieve the user (contacts) data
    useEffect(() => {
        getUserData(props.uid).then(data => setUserData(data)).catch( error => setError(error))
    }, [])
    
    function handleClick(e) {
        e.preventDefault()

        console.log('todo: send message on contact click')
    }

    return (
        <Card className="m-1 mb-3" onClick={handleClick} style={{ cursor: "pointer" }}>
            <Card.Img variant="top" src="https://via.placeholder.com/150" />

            <SendMessage name={userData.displayName} uid={props.uid}/>
        
            <Card.Body>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Card.Title className="text-center">{userData.displayName || 'No name'}</Card.Title>
            </Card.Body>

        </Card>
    )
}
