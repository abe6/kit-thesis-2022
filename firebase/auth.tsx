import {
  User,
  UserCredential,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseApp } from "./firebase-config";

const auth = getAuth(firebaseApp);

export function useAuthentication() {
  const [currentUser, setCurrentUser] = useState<User>();

  // Use effect with no dependecies so the listerner only gets assigned once
  useEffect(() => {
    // Automatically sets the current user when ever the auth state changes.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setCurrentUser(user);
      } else {
        setCurrentUser(undefined);
      }
    });
  }, []);

  function register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout(): Promise<void> {
    return signOut(auth);
  }

  function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  function changeEmail(newEmail: string): Promise<void> {
    if (currentUser) {
      return updateEmail(currentUser, newEmail);
    } else {
      throw new Error("Must be logged in to change email.");
    }
  }

  function changePassword(newPassword: string): Promise<void> {
    if (currentUser) {
      return updatePassword(currentUser, newPassword);
    } else {
      throw new Error("Must be logged in to change password.");
    }
  }

  function changeProfile(
    newName: string,
    newPhotoUrl: string = ""
  ): Promise<void> {
    if (currentUser) {
      return updateProfile(currentUser, {
        displayName: newName,
        photoURL: newPhotoUrl,
      });
    } else {
      throw new Error("Must be logged in to change profile info.");
    }
  }

  return {
    currentUser,
    register,
    login,
    logout,
    resetPassword,
    changeEmail,
    changePassword,
    changeProfile,
  };
}
