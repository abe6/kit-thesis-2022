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
  Dimensions,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useFirestore } from "../firebase/firestore";
import { useStorage } from "../firebase/storage";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

const IS_MOBILE = Dimensions.get("window").width < 800;

export default function SendAudioMessageScreen({ route }) {
  const targetUser = route.params.targetUser;

  const { addMessageTo } = useFirestore();
  const { MediaType } = useStorage();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [hasPermission, setHasPermission] = useState(null);
  const [messageTextInput, setMessageTextInput] = useState("");
  const [recording, setRecording] = useState<Audio.Recording>();
  const [micState, setMicState] = useState("idle");
  const [playbackState, setPlaybackState] = useState("idle");
  const [sound, setSound] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Button styles
  const [enableMicRecordButton, setEnableMicRecordButton] = useState(true);
  const [enableMicPlayButton, setEnableMicPlayButton] = useState(false);
  const [enableMicPauseButton, setEnableMicPauseButton] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === "granted");

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  useEffect(() => {
    setError("");
    // Record/Stop
    if (micState == "recording") {
      setEnableMicRecordButton(false);
    } else {
      setEnableMicRecordButton(true);
    }
    // Play
    if (playbackState == "playing" || !recording || micState == "recording") {
      setEnableMicPlayButton(false);
    } else {
      setEnableMicPlayButton(true);
    }
    //Pause
    if (playbackState != "playing") {
      setEnableMicPauseButton(false);
    } else {
      setEnableMicPauseButton(true);
    }
  }, [playbackState, micState, recording, sound]);

  function handleRecordPress() {
    Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
      .then(({ recording }) => {
        setMicState("recording");
        setRecording(recording);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleStopPress() {
    if (!recording) return;

    recording
      .stopAndUnloadAsync()
      .then(() => {
        setMicState("idle");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handlePlayPress() {
    Audio.Sound.createAsync(
      { uri: recording?.getURI() },
      { shouldPlay: true, isLooping: true }
    )
      .then(({ sound: soundResponse }) => {
        setPlaybackState("playing");
        setSound(soundResponse);
      })
      .catch((error) => {
        setError(error.message);
      });
  }
  function handlePausePress() {
    if (!sound) {
      console.log("no sound");
      return;
    }
    sound
      .stopAsync()
      .then(() => {
        setPlaybackState("idle");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function getAudioView() {
    if (hasPermission === null || !isFocused) {
      return <Text>No camera</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.audioWrapper}>
        <Ionicons
          name="mic-circle-outline"
          size={RFPercentage(25)}
          color={micState == "recording" ? "red" : "black"}
          style={styles.micIcon}
        />

        <View style={styles.micButtonWrapper}>
          <View style={styles.micButtonsRow}>
            <View style={styles.micCell}>
              <Pressable
                onPress={handleRecordPress}
                style={
                  enableMicRecordButton
                    ? [styles.button, styles.shadow]
                    : styles.button
                }
                disabled={!enableMicRecordButton}
              >
                <Text style={styles.recordButtonstext}>
                  Start new recording
                </Text>
              </Pressable>
            </View>
            <View style={styles.micCell}>
              <Pressable
                onPress={handleStopPress}
                style={
                  enableMicRecordButton
                    ? styles.button
                    : [styles.button, styles.shadow]
                }
                disabled={enableMicRecordButton}
              >
                <Text style={styles.recordButtonstext}>Stop recording</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.micButtonsRow}>
            <View style={styles.micCell}>
              <Pressable
                onPress={handlePlayPress}
                style={
                  enableMicPlayButton
                    ? [styles.button, styles.shadow]
                    : styles.button
                }
                disabled={!enableMicPlayButton}
              >
                <Text style={styles.recordButtonstext}>Play</Text>
              </Pressable>
            </View>
            <View style={styles.micCell}>
              <Pressable
                onPress={handlePausePress}
                style={
                  enableMicPauseButton
                    ? [styles.button, styles.shadow]
                    : styles.button
                }
                disabled={!enableMicPauseButton}
              >
                <Text style={styles.recordButtonstext}>Pause</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function sendMessage() {
    Keyboard.dismiss();
    setError("");

    if (
      (!messageTextInput || messageTextInput.trim().length == 0) &&
      !recording
    ) {
      setError("Please record audio before sending your message.");
      return;
    }

    setLoading(true);

    addMessageTo(targetUser.uid, messageTextInput, MediaType.Audio, recording)
      .then(() => {
        // Message was successfull so return to dashboard.
        navigation.goBack();
        // TODO: Some sort of user feedback that it was successful. Needs global notifications.
      })
      .catch((error) => {
        setError("Failed to send audio -> " + error.message);
        setLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      {IS_MOBILE ? (
        <></>
      ) : (
        <View style={styles.cameraContainer}>{getAudioView()}</View>
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
            <Pressable
              disabled={loading}
              onPress={() => navigation.goBack()}
              style={loading ? styles.button : [styles.button, styles.shadow]}
            >
              <Text style={[styles.buttonText, { color: "blue" }]}>Back</Text>
            </Pressable>
            <Pressable
              disabled={loading}
              onPress={sendMessage}
              style={loading ? styles.button : [styles.button, styles.shadow]}
            >
              <Text style={[styles.buttonText, { color: "green" }]}>Send</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>

        {/* debug output */}
        {/* <Text>{micState}</Text>
        <Text>{playbackState}</Text>
        <Text>
          {recording
            ? JSON.stringify(recording._isDoneRecording)
            : "no recording"}
        </Text>
        <Text>{sound ? JSON.stringify(sound) : "no sound"}</Text> */}

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
        <View style={styles.cameraContainer}>{getAudioView()}</View>
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
  audioWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  micIcon: {
    marginTop: RFPercentage(2),
  },
  micButtonWrapper: {
    width: "90%",
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
  audioWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  micIcon: {
    marginTop: -RFPercentage(5),
  },
  micButtonWrapper: {
    width: "60%",
  },
  buttonText: {
    fontSize: RFPercentage(2.5),
  },
};

const commonStyles = {
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
    paddingRight: 10,
    paddingLeft: "40%",
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
  micButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  micCell: {
    alignItems: "center",
    width: "50%",
  },
  recordButtonstext: {
    fontSize: RFPercentage(2),
  },
};

const combined = IS_MOBILE
  ? { ...commonStyles, ...mobileStyles }
  : { ...commonStyles, ...tabletStyles };

const styles = StyleSheet.create(combined);
