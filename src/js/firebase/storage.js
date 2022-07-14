import { getStorage } from "firebase/storage";
import { firebaseApp } from './firebase-config';
import React, { useContext } from 'react';
import { useAuth } from "./auth";

const storage = getStorage(firebaseApp)

const StorageContext = React.createContext()

export function useStorage() {
    return useContext(StorageContext)
}

export function StorageProvider({children}) {

    const { currentUser} = useAuth()
    
    

    const value = {
        
    }

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    )
}