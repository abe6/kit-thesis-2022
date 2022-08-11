import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useFirestore } from "../firebase/firestore";
import { useStorage } from "../firebase/storage";

const IS_MOBILE = Dimensions.get("window").width < 800;

export default function SendTextMessageScreen({ route }) {
  const targetUser = route.params.targetUser;

  const { addMessageTo } = useFirestore();
  const { MediaType } = useStorage();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const cameraRef = useRef();

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [messageTextInput, setMessageTextInput] = useState("");
  const [image, setImage] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  function getCameraView() {
    if (hasPermission === null || !isFocused) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.cameraWrapper}>
        {image ? (
          <Image
            style={[styles.camera, { borderColor: "green", borderWidth: 2 }]}
            source={image}
          />
        ) : (
          <Camera style={styles.camera} type={cameraType} ref={cameraRef} />
        )}
      </View>
    );
  }

  function handleImageAction() {
    if (image) {
      setImage();
      return;
    }

    cameraRef.current.takePictureAsync({
      quality: 0.1,
      onPictureSaved: (pic) => setImage(pic),
    });
  }

  function sendMessage() {
    Keyboard.dismiss();
    setError("");

    if ((!messageTextInput || messageTextInput.trim().length == 0) && !image) {
      setError(
        "Your message needs some content. Either take a picture, or write a message."
      );
      return;
    }

    setLoading(true);

    addMessageTo(targetUser.uid, messageTextInput, MediaType.Image, image)
      .then(() => {
        // Message was successfull so return to dashboard.
        navigation.goBack();
        // TODO: Some sort of user feedback that it was successful. Needs global notifications.
      })
      .catch((error) => {
        setError("Failed to send image -> " + error.message);
        setLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      {IS_MOBILE ? (
        <></>
      ) : (
        <View style={styles.cameraContainer}>{getCameraView()}</View>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.messageTo}>Message To</Text>
        <Text style={styles.targetName}>{targetUser.displayName}</Text>
        <View style={styles.bodyWrapper}>
          <TextInput
            multiline
            style={[styles.textInput, styles.shadow]}
            onChangeText={setMessageTextInput}
            placeholder="What is your message?"
            keyboardType="default"
          />
          <View style={styles.buttonWrapper}>
            <Pressable
              disabled={loading}
              onPress={handleImageAction}
              style={loading ? styles.button : [styles.button, styles.shadow]}
            >
              <Text style={image ? { color: "red" } : { color: "green" }}>
                {image ? "Remove Image" : "Capture Image"}
              </Text>
            </Pressable>
            <Pressable
              disabled={loading}
              onPress={() => navigation.goBack()}
              style={loading ? styles.button : [styles.button, styles.shadow]}
            >
              <Text style={{ color: "blue" }}>Back</Text>
            </Pressable>
            <Pressable
              disabled={loading}
              onPress={sendMessage}
              style={loading ? styles.button : [styles.button, styles.shadow]}
            >
              <Text style={{ color: "green" }}>Send</Text>
            </Pressable>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : <></>}
        {loading ? (
          <View style={styles.loadingIcon}>
            <ActivityIndicator size="large" />
            <Text>Sending message...</Text>
          </View>
        ) : (
          <></>
        )}
      </View>

      {IS_MOBILE ? (
        <View style={styles.cameraContainer}>{getCameraView()}</View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

const mobileStyles = {
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cameraContainer: {
    width: "100%",
    height: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  contentContainer: {
    width: "100%",
    height: "40%",
    marginTop: 5,
    marginBottom: 40,
    paddingRight: 20,
    paddingLeft: 10,
  },
  camera: {
    width: "90%",
    height: "72%",
  },
};

const tabletStyles = {
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cameraContainer: {
    width: "50%",
    height: "95%",
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 10,
  },
  contentContainer: {
    width: "50%",
    height: "95%",
    marginTop: 20,
    paddingRight: 20,
    paddingLeft: 10,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
};

const commonStyles = {
  cameraWrapper: {
    alignItems: "center",
  },
  messageTo: {
    fontSize: 18,
    color: "gray",
  },
  targetName: {
    fontSize: 50,
    fontWeight: "bold",
  },
  bodyWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textInput: {
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
    textAlignVertical: "top",
    minHeight: 200,
    borderRadius: 20,
    backgroundColor: "whitesmoke",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "whitesmoke",
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  loadingIcon: {
    marginTop: 25,
    alignItems: "center",
  },
};

const combined = IS_MOBILE
  ? { ...commonStyles, ...mobileStyles }
  : { ...commonStyles, ...tabletStyles };

const styles = StyleSheet.create(combined);
