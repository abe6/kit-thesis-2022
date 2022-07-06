import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth'
import { firebaseApp } from './firebase-config';
import React, { useContext, useEffect, useState } from 'react';

// Initalise Auth
const auth = getAuth(firebaseApp);

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState() 
    
    // Use effect so this only gets assigned once. 
    useEffect(() => {

        // Automatically sets the current user when ever the auth state changes. 
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })
    
        return unsubscribe
    }, [])


    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }


    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const value = {
        currentUser,
        register,
        login
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}