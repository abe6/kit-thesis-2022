import { useState, useEffect } from "react"
import { onSnapshot } from 'firebase/firestore'
import { useFirestore } from "../firebase/firestore"
import { useAuth } from "../firebase/auth"
import { Card, Alert } from 'react-bootstrap'
import Message from './Message'
import SendMessage from "./SendMessage"

export default function MessagesList() {
    const { getUserSnapshot } = useFirestore()
    const { currentUser } = useAuth()

    const [messagesList, setMessagesList] = useState([])
    const [error, setError] = useState('')
    const [sendMessage, setSendMessage] = useState(false)

    function showSendMessage() { setSendMessage(true) }
    function hideSendMessage(){ setSendMessage(false) }

    // Only runs once to start the listening
    useEffect(() => {
        // Updates messagesList whenever it changes
        const unsub = onSnapshot(getUserSnapshot(currentUser.uid), userSnapshot => {
          try {
            const messages = userSnapshot.data().messages ?? []
            messages.sort((a,b) => (a.sentAt < b.sentAt) ? 1 : -1)
            setMessagesList(messages)
          } catch (error) {
            setError(error)
          }
        })

        return unsub
    }, [])
    
    return (
      <Card className="w-100" style={{minHeight:375}}>
        {error && <Alert variant='danger'>{error}</Alert>}

        <Card.Header as="h4">
          <div>
            <strong>Your Messages</strong> <span className="text-muted">({messagesList.length})</span>
            <span className="float-end">
              <SendMessage 
                  show={sendMessage} 
                  handleClose={hideSendMessage}
                  handleShow={showSendMessage}
                  btntext="Send New Message"
              /> 
            </span>
          </div>
        </Card.Header>
        
        <Card.Body className="">
          <div className="d-flex flex-row flex-nowrap overflow-auto">
            {
              messagesList.map((mes, i) => {
                return (
                  <Message message={mes} key={i}/>
                )
              })
            } 
          </div>
        </Card.Body>
      </Card>
    )
}
