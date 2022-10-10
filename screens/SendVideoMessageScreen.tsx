import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useFirestore } from "../firebase/firestore";
import { useStorage } from "../firebase/storage";
import { Video } from "expo-av";
import { RFPercentage } from "react-native-responsive-fontsize";

const IS_MOBILE = Dimensions.get("window").width < 800;

export default function SendVideoMessageScreen({ route }) {
  const targetUser = route.params.targetUser;

  const { addMessageTo } = useFirestore();
  const { MediaType } = useStorage();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const cameraRef = useRef();

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [cameraState, setCameraState] = useState("idle");
  const [messageTextInput, setMessageTextInput] = useState("");
  const [video, setVideo] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status: statusCamera } =
        await Camera.requestCameraPermissionsAsync();
      const { status: statusMic } =
        await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(statusCamera === "granted" && statusMic === "granted");
      // setHasPermission(true);
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
        {video ? (
          <Video
            style={[styles.camera]}
            source={{ uri: video.uri }}
            resizeMode="contain"
            useNativeControls
            isLooping
            shouldPlay
          />
        ) : (
          <Camera style={styles.camera} type={cameraType} ref={cameraRef} />
        )}
      </View>
    );
  }

  function getVideoButton() {
    let text = "";
    let textColor = "";
    switch (cameraState) {
      case "idle":
        text = "Start recording";
        textColor = "green";
        break;
      case "captured":
        text = "Remove video";
        textColor = "black";
        break;
      case "recording":
        text = "Stop recording";
        textColor = "red";
        break;

      default:
        break;
    }
    return (
      <TouchableOpacity
        disabled={loading}
        onPress={handleVideoAction}
        style={loading ? styles.button : [styles.button, styles.shadow]}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.buttonText, { color: textColor }]}> {text}</Text>
          {cameraState === "recording" ? (
            <ActivityIndicator
              color="red"
              size="small"
              style={{ marginLeft: 10 }}
            />
          ) : (
            <></>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  function handleVideoAction() {
    // If theres a video, the next action is to remove the video
    if (video) {
      setVideo();

      setCameraState("idle");
    }
    switch (cameraState) {
      case "idle":
        cameraRef.current
          .recordAsync({
            quality: "720p",
            maxDuration: 120, // 120 seconds = 2 mins
          })
          .then((video) => {
            // Promise resolves when the video stops recording.
            setCameraState("captured");
            setVideo(video);
          });
        setCameraState("recording");
        break;
      case "recording":
        cameraRef.current.stopRecording();

      default:
        break;
    }
  }

  function sendMessage() {
    Keyboard.dismiss();
    setError("");

    if ((!messageTextInput || messageTextInput.trim().length == 0) && !video) {
      setError("Please record a video before sending your message.");
      return;
    }

    setLoading(true);

    addMessageTo(targetUser.uid, messageTextInput, MediaType.Video, video)
      .then(() => {
        // Message was successfull so return to dashboard.
        navigation.goBack();
        // TODO: Some sort of user feedback that it was successful. Needs global notifications.
      })
      .catch((error) => {
        setError("Failed to send video -> " + error.message);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.bodyWrapper}
        >
          <TextInput
            multiline
            style={[styles.textInput, styles.shadow]}
            onChangeText={setMessageTextInput}
            placeholder="What is your message?"
            keyboardType="default"
          />
          <View style={styles.buttonWrapper}>
            {getVideoButton()}

            <TouchableOpacity
              disabled={loading}
              onPress={() => navigation.goBack()}
              style={loading ? styles.button : [styles.button, styles.shadow]}
            >
              <Text style={[styles.buttonText, { color: "blue" }]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              onPress={sendMessage}
              style={loading ? styles.button : [styles.button, styles.shadow]}
            >
              <Text style={[styles.buttonText, { color: "green" }]}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  buttonText: {
    fontSize: RFPercentage(2),
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
  buttonText: {
    fontSize: RFPercentage(2.5),
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
