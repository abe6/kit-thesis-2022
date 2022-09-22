import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useAuthentication } from "../firebase/auth";
import {
  requestMediaLibraryPermissionsAsync,
  launchImageLibraryAsync,
} from "expo-image-picker";
import { useFirestore } from "../firebase/firestore";
import { useStorage } from "../firebase/storage";

export default function UpdateProfileScreen({ navigation }) {
  const { currentUser, changePassword, changeProfile } = useAuthentication();
  const { updateUserData } = useFirestore();
  const { uploadProfilePicture } = useStorage();

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const [photoDisplayUri, setPhotoDisplayUri] = useState<string>("");
  const [newPhotoUri, setNewPhotoUri] = useState<string>("");
  const [displayNameInput, setDisplayNameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>();
  const [passwordConfirmInput, setPasswordConfirmInput] = useState<string>();

  const displayNameInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();

  useEffect(() => {
    if (!currentUser) return;
    setDisplayNameInput(currentUser.displayName);
    setPhotoDisplayUri(currentUser.photoURL);
  }, [currentUser]);

  // Add a listener to reset inputs whenever the screen is mounted
  useEffect(() => {
    return navigation.addListener("focus", () => {
      passwordInputRef.current.clear();
      passwordConfirmInputRef.current.clear();
    });
  }, [navigation]);

  async function handleSubmit(e: GestureResponderEvent) {
    setError("");
    setLoading(true);

    if (!displayNameInput) {
      setError("You must provide a display name.");
      setLoading(false);
      return;
    }

    if (passwordInput != passwordConfirmInput) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const promises = [];

    if (displayNameInput != currentUser?.displayName || newPhotoUri) {
      const name =
        displayNameInput != currentUser?.displayName
          ? displayNameInput
          : currentUser?.displayName;

      const url = newPhotoUri
        ? await uploadProfilePicture(newPhotoUri)
        : currentUser?.photoURL;

      promises.push(changeProfile(name, url));
    }

    if (passwordInput && passwordConfirmInput) {
      promises.push(changePassword(passwordInput));
    }

    Promise.all(promises)
      .then(() => {
        updateUserData().then(() => {
          navigation.navigate("DashboardScreen");
        });
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function pickImage() {
    // Ask the user for the permission to access the media library
    const permissionResult = await requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log("No permission");
      return;
    }

    const result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.cancelled) {
      setPhotoDisplayUri(result.uri);
      setNewPhotoUri(result.uri);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.error}>
          <Text>{error}</Text>
        </View>
      ) : (
        <></>
      )}

      <View style={styles.header}>
        <Image
          style={styles.userPicture}
          source={
            photoDisplayUri
              ? { uri: photoDisplayUri }
              : { uri: "https://via.placeholder.com/150" }
          }
        />

        <Pressable
          onPress={pickImage}
          disabled={loading}
          style={{
            paddingHorizontal: 10,
            paddingBottom: 5,
            marginVertical: 10,
            borderRadius: 10,
            borderColor: "lightgray",
            borderWidth: 0.5,
          }}
        >
          <Text style={styles.mutedText}>Change picture</Text>
        </Pressable>
      </View>

      <View style={styles.inputsView}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setDisplayNameInput}
          defaultValue={displayNameInput}
          placeholder="Display name"
          keyboardType="default"
          ref={displayNameInputRef}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPasswordInput}
          placeholder="Password"
          keyboardType="default"
          secureTextEntry={true}
          ref={passwordInputRef}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPasswordConfirmInput}
          placeholder="Confirm Password"
          keyboardType="default"
          secureTextEntry={true}
          ref={passwordConfirmInputRef}
        />

        <Pressable
          style={styles.submit}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={{ fontSize: 24 }}>Update</Text>
        </Pressable>
        {loading ? (
          <View
            style={{
              marginTop: 25,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" />
            <Text>Updating profile...</Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },

  header: {
    alignItems: "center",
    height: "40%",
    marginTop: 20,
    borderBottomColor: "lightgray",
    borderBottomWidth: 0.5,
  },

  inputsView: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: "20%",
    width: "100%",
  },

  input: {
    marginTop: 10,
    width: "100%",
    height: 60,
    padding: 20,
    borderColor: "lightgray",
    borderRadius: 5,
    borderWidth: 0.25,
  },

  mutedText: {
    color: "gray",
    fontSize: 18,
    marginTop: 10,
  },

  submit: {
    width: "100%",
    padding: 5,
    backgroundColor: "dodgerblue",
    borderRadius: 25,
    marginVertical: 15,
    alignItems: "center",
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },

  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    marginBottom: -5,
    marginTop: 10,
  },

  userPicture: {
    height: "80%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
