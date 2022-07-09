import { getFirestore, doc } from "firebase/firestore";
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


    const value = {
        getUserSnapshot
    }

    return (
        <FirestoreContext.Provider value={value}>
            {children}
        </FirestoreContext.Provider>
    )
}