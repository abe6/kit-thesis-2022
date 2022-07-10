import { useState, useEffect } from "react"
import { onSnapshot } from 'firebase/firestore'
import { useFirestore } from "../firebase/firestore"
import { useAuth } from "../firebase/auth"
import { Alert, CardGroup, Container } from 'react-bootstrap'
import Contact from './Contact'

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
            setFriendsUidList(userSnapshot.data().friends)
          } catch (error) {
            setError(error)
          }
        })

        return unsub
    }, [])
    
    return (
      <>
        {error && <Alert variant='danger'>{error}</Alert>}
        
        <p><strong>Your friends</strong> ({friendsUidList.length}) :</p>
        {
          friendsUidList.map(uid => {
            return (
              <Contact uid={uid}/>
            )
          })
        }
      </>
    )
}
