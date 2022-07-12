import { getFirestore, doc, updateDoc, getDoc, getDocs, collection, arrayUnion, arrayRemove, setDoc} from "firebase/firestore";
import { firebaseApp } from './firebase-config';
import React, { useContext } from 'react';
import { useAuth } from "./auth";

const db = getFirestore(firebaseApp);

const FirestoreContext = React.createContext()

export function useFirestore() {
    return useContext(FirestoreContext)
}

export function FirestoreProvider({children}) {

    const { currentUser} = useAuth()
    
    function getUserSnapshot(userId) {
        return doc(db, "users", userId)
    }

    function updateUserData() {

        const userData = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL
        }

        return setDoc(doc(db, "users", currentUser.uid), {
            data: userData
        });
        
    }

    async function createUserDoc(uid, email) {
        await setDoc(doc(db, "users", uid), {
            data: {
                email: email
            }
          });
    }

    async function getUserData(uid) {
        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)
        return docSnap.data().data;
    }

    async function addFriend(email){
        let id = ''

        const allUsersSnapshot = await getDocs(collection(db, 'users'))
        allUsersSnapshot.forEach((doc) => {
            if (doc.data().data.email === email){
                id = doc.id
            }
          });

        if (id) {
            const currentUserSnapshot = getUserSnapshot(currentUser.uid)
            await updateDoc(currentUserSnapshot, {
                friends: arrayUnion(id)
            })
        } else {
            throw new Error("User not found")
        }
    }

    function addMessageTo(uid, messageText){
        const recipientSnap = getUserSnapshot(uid)
        return updateDoc(recipientSnap, {
            messages: arrayUnion({
                sender: currentUser.uid,
                text: messageText,
                sentAt: Date.now(),
                status: "inbox"
            })
        })
    }

    function removeMessageFrom(uid, message){
        const recipientSnap = getUserSnapshot(uid)
        return updateDoc(recipientSnap, {
            messages: arrayRemove(message)
        });
    }

    const value = {
        getUserSnapshot,
        updateUserData,
        getUserData,
        addFriend,
        createUserDoc,
        addMessageTo,
        removeMessageFrom
    }

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    )
}