import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    updateProfile
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
    const [loading, setLoading] = useState(true) 
    
    // Use effect so this only gets assigned once. 
    useEffect(() => {

        // Automatically sets the current user when ever the auth state changes. 
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
    
        return unsubscribe
    }, [])


    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }


    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        return signOut(auth)
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    function changeEmail(email){
        return updateEmail(currentUser, email)
    }

    function changePassword(password){
        return updatePassword(currentUser, password)
    }

    function changeProfile(name, photoLink) {
        return updateProfile(currentUser, {
            displayName: name,
            photoURL: photoLink
        })
    }

    const value = {
        currentUser,
        register,
        login,
        logout,
        resetPassword,
        changeEmail,
        changePassword,
        changeProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}