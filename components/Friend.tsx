import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useFirestore } from "../firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { useNewMessageModal } from "./NewMessageModal";
import { RFPercentage } from "react-native-responsive-fontsize";

export function Friend({ uid }) {
  const { getUserSnapshot, getUserData, removeFriend } = useFirestore();
  const { NewMessageModal, openModal } = useNewMessageModal();

  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // // Runs once to retrieve the user (contacts) data
    // getUserData(uid)
    //   .then((resp) => setUserData(resp.data))
    //   .catch((error) => setError(error));

    // Updates the users data whenever it changes
    const unsub = onSnapshot(getUserSnapshot(uid), (userSnapshot) =>
      setUserData(userSnapshot.data().data)
    );

    return unsub;
  }, []);

  function deleteFriend() {
    setError("");
    Alert.alert(
      "Delete",
      "Are you sure you want to remove this friend?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Friend removal canceled"),
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeFriend(uid).catch((error) => setError(error));
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <View>
      {userData ? (
        <View style={style.container}>
          <Pressable
            onPress={() => openModal({ ...userData, uid: uid })}
            onLongPress={() => deleteFriend()}
            style={style.pressable}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={style.userPicture}
                source={{ uri: userData.photoURL }}
              />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={style.contactName}
              >
                {userData.displayName}
              </Text>
            </View>
          </Pressable>
          <NewMessageModal />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

export function EmptyFriend() {
  return (
    <View
      style={[
        style.container,
        {
          justifyContent: "center",
          alignItems: "center",
          width: Dimensions.get("window").width - 37,
          paddingVertical: 10,
          paddingHorizontal: 40,
          marginRight: 20,
        },
      ]}
    >
      <Text
        style={{
          fontSize: RFPercentage(2),
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        You currently have no contacts
      </Text>
      <Text style={{ fontSize: RFPercentage(1.5), textAlign: "center" }}>
        Add a new friend now
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: RFPercentage(13),
    margin: 15,
    marginEnd: 0,
    marginBottom: 0,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  pressable: {
    flex: 1,
    paddingTop: 10,
  },

  userPicture: {
    height: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },

  contactName: {
    fontSize: RFPercentage(2.5),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    marginTop: 5,
  },
});
