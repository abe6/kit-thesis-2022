import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { firebaseApp } from './firebase-config';
import React, { useContext } from 'react';

const db = getFirestore(firebaseApp);

const FirestoreContext = React.createContext()

export function useFirestore() {
    return useContext(FirestoreContext)
}

export function FirestoreProvider({children}) {
    
    function getUserSnapshot(userId) {
        return doc(db, "users", userId)
    }

    async function updateUserData(user) {
        const userData = {
            displayName: user.displayName || '',
            email: user.email,
            photoURL: user.photoURL || ''
        }
        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, {
            data: userData
        }); 
    }

    async function getUserData(uid) {
        const docRef = doc(db, "users", uid)
        const docSnap = await getDoc(docRef)
        return docSnap.data().data;
    }

    const value = {
        getUserSnapshot,
        updateUserData,
        getUserData
    }

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    )
}