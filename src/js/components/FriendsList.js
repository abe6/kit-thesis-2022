import { useState, useEffect } from "react"
import { onSnapshot } from 'firebase/firestore'
import { useFirestore } from "../firebase/firestore"
import { useAuth } from "../firebase/auth"
import { Alert, Card, Row, Col } from 'react-bootstrap'
import Contact from './Contact'
import AddFriend from "./AddFriend"

export default function FriendsList() {
    const { getUserSnapshot } = useFirestore()
    const { currentUser } = useAuth()

    const [friendsUidList, setFriendsUidList] = useState([])
    const [error, setError] = useState('')

    // Only runs once to start the listening
    useEffect(() => {
        // Updates friendslist whenever it changes
        const unsub = onSnapshot(getUserSnapshot(currentUser.uid), userSnapshot => {
          try {
            setFriendsUidList(userSnapshot.data().friends || [])
          } catch (error) {
            setError(error)
          }
        })

        return unsub
    }, [])
    
    return (
      <Card className="w-100 mt-2">
        {error && <Alert variant='danger'>{error}</Alert>}

        <Card.Header as="h4">
          <div className='align-items-center'>
              <strong>Your friends</strong> <span className="text-muted">({friendsUidList.length})</span>
              <span className="float-end"> <AddFriend/> </span>
          </div>
        </Card.Header>

        <Card.Body className="">
          <div className='overflow-scroll' >
            <div className="vw-100 d-flex flex-row overflow-auto">
              {
                friendsUidList.map((uid, i) => {
                  return (
                    <Contact uid={uid} key={i}/>
                  )
                })
              } 
            </div>
          </div>
        </Card.Body>
      </Card>
    )
}
