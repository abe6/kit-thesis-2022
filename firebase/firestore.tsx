import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { useAuthentication } from "./auth";
import { firebaseApp } from "./firebase-config";
import { useStorage } from "./storage";
import { uid as generateUid } from "uid";

const db = getFirestore(firebaseApp);

export function useFirestore() {
  const { currentUser } = useAuthentication();
  const { uploadMediaTo, deleteMessageMedia, MediaType } = useStorage();

  function getUserSnapshot(userId: string) {
    return doc(db, "users", userId);
  }

  async function getUserData(uid: string = currentUser.uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  function updateUserData() {
    const userData = {
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
    };

    return updateDoc(doc(db, "users", currentUser.uid), {
      data: userData,
    });
  }

  async function createUserDoc(
    uid: string,
    email: string,
    displayName: string = ""
  ) {
    await setDoc(doc(db, "users", uid), {
      data: {
        email: email,
        displayName: displayName,
      },
    });
  }

  async function addFriend(email: string) {
    let id = "";

    const allUsersSnapshot = await getDocs(collection(db, "users"));
    allUsersSnapshot.forEach((doc) => {
      if (doc.data().data.email === email) {
        id = doc.id;
      }
    });

    if (id) {
      const currentUserSnapshot = getUserSnapshot(currentUser.uid);
      await updateDoc(currentUserSnapshot, {
        friends: arrayUnion(id),
      });
    } else {
      throw new Error("User not found");
    }
  }

  function removeFriend(uid: string) {
    const currentUserSnapshot = getUserSnapshot(currentUser.uid);
    return updateDoc(currentUserSnapshot, {
      friends: arrayRemove(uid),
    });
  }

  async function addMessageTo(
    uid: string,
    messageText: string,
    mediaType: MediaType,
    media: any
  ) {
    const recipientSnap = getUserSnapshot(uid);
    const messageId = generateUid();

    let realMediaType = MediaType.None;
    if (media) {
      try {
        await uploadMediaTo(uid, messageId, mediaType, media);
        realMediaType = mediaType;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to store media -> " + error.message);
      }
    }

    return updateDoc(recipientSnap, {
      messages: arrayUnion({
        messageId: messageId,
        sender: currentUser.uid,
        text: messageText,
        sentAt: Date.now(),
        status: "inbox",
        mediaType: realMediaType,
      }),
    }).then(() => {
      messageSentMetric(currentUser.uid);
      messageReceivedMetric(uid);
    });
  }

  function removeMessageFrom(uid: string, message: any) {
    const recipientSnap = getUserSnapshot(uid);
    if (message.mediaType) {
      deleteMessageMedia(message.messageId).catch(() => Promise.resolve());
    }
    return updateDoc(recipientSnap, {
      messages: arrayRemove(message),
    });
  }

  async function messageSentMetric(uid: string) {
    const userSnapshot = getUserSnapshot(uid);
    await updateDoc(userSnapshot, {
      "metrics.messages_sent": arrayUnion(Date.now()),
    });
  }

  async function messageReceivedMetric(uid: string) {
    const userSnapshot = getUserSnapshot(uid);
    await updateDoc(userSnapshot, {
      "metrics.messages_received": arrayUnion(Date.now()),
    });
  }

  async function shareWithFriend(email: string) {
    let snapshot = null;

    const allUsersSnapshot = await getDocs(collection(db, "users"));
    allUsersSnapshot.forEach((doc) => {
      if (doc.data().data.email === email) {
        snapshot = doc.ref;
      }
    });

    if (snapshot) {
      await updateDoc(snapshot, {
        "metrics.shared": arrayUnion(currentUser?.uid),
      });
    } else {
      throw new Error("User not found");
    }
  }

  return {
    getUserSnapshot,
    updateUserData,
    getUserData,
    addFriend,
    createUserDoc,
    addMessageTo,
    removeMessageFrom,
    removeFriend,
    shareWithFriend,
  };
}
