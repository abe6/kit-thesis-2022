import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firebaseApp } from "./firebase-config";
import { useAuthentication } from "./auth";
import { getOrientationAsync } from "expo-screen-orientation";

const storage = getStorage(firebaseApp);

export function useStorage() {
  const { currentUser } = useAuthentication();

  // Returns the download url of the new photo
  async function uploadProfilePicture(uri): Promise<string> {
    const { fileBlob, metadata } = await uriToFileBlob(uri);

    const newImageRef = ref(
      storage,
      `${currentUser.uid}/photo/${fileBlob._data.name}`
    );

    await uploadBytes(newImageRef, fileBlob, metadata).catch((error) => {
      console.log("Failed to upload profile picture. ");
      console.log(error);
    });
    return getDownloadURL(newImageRef);
  }

  // Uploads the media for a message to the targts media folder
  async function uploadMediaTo(
    uid: string,
    messageId: string,
    mediaType: MediaType,
    media: any
  ): Promise<void> {
    let uri: string = media.uri;
    if (mediaType == MediaType.Audio) {
      uri = media.getURI();
    }

    const mediaRef = ref(storage, `${uid}/messageMedia/${messageId}`);
    const { fileBlob, metadata } = await uriToFileBlob(uri);

    await uploadBytes(mediaRef, fileBlob, metadata).catch((error) => {
      console.log("Failed to upload media. ");
      console.log(error);
    });
  }

  enum MediaType {
    Video = "video",
    Audio = "audio",
    Image = "image",
    None = "",
  }

  async function deleteMessageMedia(messageId: string): Promise<void> {
    const mediaRef = ref(
      storage,
      `${currentUser.uid}/messageMedia/${messageId}`
    );
    return deleteObject(mediaRef);
  }

  function getMessageMediaUrl(uid: string, messageId: string): Promise<string> {
    const mediaRef = ref(storage, `${uid}/messageMedia/${messageId}`);
    return getDownloadURL(mediaRef);
  }

  async function uriToFileBlob(uri) {
    // TODO: Compress media

    const fileResponse = await fetch(uri);
    const fileBlob = await fileResponse.blob();

    let metadata = {
      customMetadata: {
        orientation: await getOrientationAsync(),
      },
      contentType: fileResponse.headers.map["content-type"],
    };

    return { fileBlob, metadata };
  }

  return {
    uploadProfilePicture,
    uploadMediaTo,
    deleteMessageMedia,
    getMessageMediaUrl,
    MediaType,
  };
}
