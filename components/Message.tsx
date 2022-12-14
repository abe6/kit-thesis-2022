import {
  Text,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useFirestore } from "../firebase/firestore";
import { useAuthentication } from "../firebase/auth";
import { Video } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useStorage } from "../firebase/storage";
import { RFPercentage } from "react-native-responsive-fontsize";
import TimeAgo from "react-native-timeago";

export function Message({ message, openModal }) {
  const sentAt = new Date(message.sentAt);

  const { getUserData, removeMessageFrom } = useFirestore();
  const { currentUser } = useAuthentication();
  const { getMessageMediaUrl } = useStorage();

  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Runs once to retrieve the user (sender) data.
  useEffect(() => {
    getUserData(message.sender)
      .then((resp) => setUserData(resp.data))
      .catch((error) => setError(error));
  }, []);

  // Retrieves the media url for the message
  useEffect(() => {
    if (!currentUser || message.mediaType === "") return;
    (async () => {
      const url = await getMessageMediaUrl(currentUser.uid, message.messageId);
      setMediaUrl(url);
    })();
  }, [currentUser]);

  async function onDelete() {
    setError("");

    Alert.alert(
      "Delete",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Logout canceled"),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeMessageFrom(currentUser.uid, message).catch((error) =>
              setError(error)
            );
          },
        },
      ],
      { cancelable: true }
    );
  }

  function handlePlayAudio() {
    if (isPlayingAudio) {
      console.log("stopping");
    } else if (!isPlayingAudio) {
      console.log("playing");
    }
  }

  function getMediaView() {
    switch (message.mediaType) {
      case "video":
        return (
          <View style={style.mediaWrapper}>
            <Video
              style={[style.visualMedia]}
              source={{ uri: mediaUrl }}
              resizeMode="contain"
              useNativeControls
            />
          </View>
        );
      case "image":
        return (
          <View style={style.mediaWrapper}>
            <Image style={style.visualMedia} source={{ uri: mediaUrl }} />
          </View>
        );
      case "audio":
        return (
          <View style={style.mediaWrapper}>
            <Ionicons
              name="mic-circle-outline"
              size={RFPercentage(10)}
              color="black"
            />
            <Pressable onPress={handlePlayAudio}>
              <Ionicons
                name={isPlayingAudio ? "stop" : "play"}
                size={RFPercentage(4)}
                color={isPlayingAudio ? "red" : "black"}
              />
            </Pressable>
            <Text>
              {isPlayingAudio ? "Stop playing" : "Play audio message"}
            </Text>
          </View>
        );
      default:
        return <Text>No message mediaType</Text>;
    }
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <View>
          <View style={style.senderRow}>
            <Image
              style={style.userPicture}
              source={{ uri: userData.photoURL }}
            />
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={style.senderName}>{userData.displayName}</Text>
              <TimeAgo style={style.sentAtText} time={sentAt} />
            </View>
          </View>
          {/* <Text style={style.sentAtText}>{sentAt.toLocaleString()}</Text> */}
        </View>
        <Pressable onPress={onDelete}>
          <Ionicons name="trash" size={28} color="black" />
        </Pressable>
      </View>

      <View style={style.body}>
        {mediaUrl ? getMediaView() : <></>}

        {message.text ? (
          <View style={style.right}>
            <ScrollView>
              <Text style={style.bodyText}>{message.text}</Text>
            </ScrollView>
          </View>
        ) : (
          <></>
        )}
      </View>

      <Pressable
        style={style.replyButton}
        onPress={() => openModal({ ...userData, uid: message.sender })}
      >
        <Text style={{ fontSize: RFPercentage(2.5) }}>Reply</Text>
      </Pressable>
    </View>
  );
}

export function EmptyMessage() {
  return (
    <View
      style={[
        style.container,
        {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
          paddingHorizontal: 40,
          marginRight: 20,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        You currently have no messages
      </Text>
      <Text style={{ fontSize: 16, textAlign: "center" }}>
        Start a conversation by sending a message to someone
      </Text>
    </View>
  );
}

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    width: 375,
    margin: 15,
    marginEnd: 0,
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgray",
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  senderName: {
    fontWeight: "bold",
    fontSize: RFPercentage(3),
  },
  userPicture: {
    height: RFPercentage(4),
    aspectRatio: 1,
    borderRadius: RFPercentage(2),
    marginRight: 10,
  },
  sentAtText: {
    color: "gray",
    fontSize: RFPercentage(1.2),
    marginLeft: 10,
  },

  body: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  right: { flex: 1 },

  bodyText: {
    flexShrink: 0,
    flexDirection: "column",
    flexWrap: "wrap",
    marginVertical: 10,
    fontSize: 18,
  },
  replyButton: {
    marginTop: 10,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "whitesmoke",
    alignItems: "center",
  },
  visualMedia: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
});

const mobileStyles = StyleSheet.create({
  mediaWrapper: {
    height: "100%",
    width: "60%",
    paddingTop: 15,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
const tabletStyles = StyleSheet.create({
  mediaWrapper: {
    height: "100%",
    aspectRatio: 3 / 4,
    paddingTop: 15,
    paddingRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

const IS_MOBILE = Dimensions.get("window").width < 800;
const combined = IS_MOBILE
  ? { ...commonStyles, ...mobileStyles }
  : { ...commonStyles, ...tabletStyles };

const style = StyleSheet.create(combined);
