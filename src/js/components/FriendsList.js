import { useState, useEffect } from "react"
import { onSnapshot } from 'firebase/firestore'
import { useFirestore } from "../firebase/firestore"
import { useAuth } from "../firebase/auth"

export default function FriendsList() {
    const { getUserSnapshot } = useFirestore()
    const { currentUser } = useAuth()

    const [friends, setFriends] = useState('')

    // Only runs once to start the listening
    // useEffect(() => {
    //     const unsub = onSnapshot(getUserSnapshot(currentUser.uid), userSnapshot => {
    //         const data = userSnapshot.data()
    //         setFriends(JSON.stringify(data))
    //     })

    //     return unsub
    // }, [])
    
    return (
      <>
        <p>Your friends:</p>
        <p>{friends}</p>
        {/* for each friend, display some card */}
      </>
    )
}
