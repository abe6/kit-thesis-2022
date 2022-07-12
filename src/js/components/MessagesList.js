import { useState, useEffect } from "react"
import { onSnapshot } from 'firebase/firestore'
import { useFirestore } from "../firebase/firestore"
import { useAuth } from "../firebase/auth"
import { Card, Alert } from 'react-bootstrap'
import Message from './Message'

export default function MessagesList() {
    const { getUserSnapshot } = useFirestore()
    const { currentUser } = useAuth()

    const [messagesList, setMessagesList] = useState([])
    const [error, setError] = useState('')

    // Only runs once to start the listening
    useEffect(() => {
        // Updates messagesList whenever it changes
        const unsub = onSnapshot(getUserSnapshot(currentUser.uid), userSnapshot => {
          try {
            setMessagesList(userSnapshot.data().messages || [])
          } catch (error) {
            setError(error)
          }
        })

        return unsub
    }, [])
    
    return (
      <Card className="w-100">
        {error && <Alert variant='danger'>{error}</Alert>}

        <Card.Header as="h4">
          <strong>Your Messages</strong> <span className="text-muted">({messagesList.length})</span>
        </Card.Header>
        
        <Card.Body className="">
          <div className='overflow-scroll' >
            <div className="vw-100 d-flex flex-row overflow-auto">
              {
                messagesList.map((mes, i) => {
                  return (
                    <Message message={mes} key={i}/>
                  )
                })
              } 
            </div>
          </div>
        </Card.Body>
      </Card>
    )
}
