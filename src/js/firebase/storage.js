import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
    
    // Returns photo downlaod url
    async function uploadProfilePicture(picture){
        const imageRef = ref(storage, `${currentUser.uid}/photo/${picture.name}`);
        await uploadBytes(imageRef, picture)
        return getDownloadURL(imageRef)
    }

    

    const value = {
        uploadProfilePicture
    }

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    )
}