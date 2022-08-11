import { Text, View, StyleSheet, Modal, Pressable } from "react-native";
import { useAuthentication } from "../firebase/auth";
import { useState, useEffect } from "react";
import { useFirestore } from "../firebase/firestore";
import { getDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const ICON_SIZE = RFPercentage(10);

export function useNewMessageModal() {
  const { getUserSnapshot, getUserData } = useFirestore();
  const { currentUser } = useAuthentication();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newMessageTarget, setNewMessageTarget] = useState("");
  const [friendsData, setFriendsData] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Runs once to retrieve the users friends to populate the dropdown
    getUserData()
      .then((resp) => {
        // Map each friends uid to a user data object
        Promise.all(
          Object.values(resp.friends).map((uid) => {
            return getDoc(getUserSnapshot(uid));
          })
        )
          .then((users) => {
            let friends = [];
            // create a mappiong of friedns UID to their profile data
            users.forEach((user) => {
              const data = user.data().data;
              friends.push({
                label: data.displayName,
                value: { ...data, uid: user.id },
              });
            });
            setFriendsData(friends);
          })
          .catch((error) => setError(error));
      })
      .catch((error) => setError(error));
  }, [currentUser]);

  function openModal(targetUid = "") {
    setNewMessageTarget(targetUid);
    setDropdownVisible(!targetUid); // Only show dropdown if no targetUid
    setModalMessage("");
    setModalVisible(true);
  }

  function makeMessageSelection(route: string) {
    if (!newMessageTarget) {
      setModalMessage("You must select a friend to message.");
      return;
    }

    setDropdownVisible(false);
    setModalVisible(false);

    switch (route) {
      case "video":
        navigation.navigate("SendVideoMessageScreen", {
          targetUser: newMessageTarget,
        });
        break;
      case "audio":
        navigation.navigate("SendAudioMessageScreen", {
          targetUser: newMessageTarget,
        });
        break;
      case "text":
        navigation.navigate("SendTextMessageScreen", {
          targetUser: newMessageTarget,
        });
        break;

      default:
        return;
    }
  }

  function NewMessageModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeaderWrapper}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={styles.header}
              >
                New message
                {newMessageTarget ? ` to ${newMessageTarget.displayName}` : ""}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons
                  name="close-circle-outline"
                  size={RFValue(24)}
                  color="black"
                />
              </Pressable>
            </View>

            {/* Dropdown */}
            {dropdownVisible ? (
              <View style={styles.dropdownWrapper}>
                <DropDownPicker
                  placeholder="Select a friend"
                  searchable={true}
                  items={friendsData}
                  value={newMessageTarget}
                  setValue={setNewMessageTarget}
                  itemKey="label"
                  dropDownDirection="TOP"
                  closeAfterSelecting={true}
                  open={dropdownOpen}
                  onOpen={() => setDropdownOpen(true)}
                  onClose={() => setDropdownOpen(false)}
                />
              </View>
            ) : (
              <></>
            )}

            <View style={styles.modalIconsWrapper}>
              <Pressable
                style={styles.modalIcon}
                onPress={() => makeMessageSelection("video")}
              >
                <Ionicons
                  name="videocam-outline"
                  size={ICON_SIZE}
                  color="black"
                />
              </Pressable>
              <Pressable
                style={styles.modalIcon}
                onPress={() => makeMessageSelection("audio")}
              >
                <Ionicons name="mic-outline" size={ICON_SIZE} color="black" />
              </Pressable>
              <Pressable
                style={styles.modalIcon}
                onPress={() => makeMessageSelection("text")}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={ICON_SIZE}
                  color="black"
                />
              </Pressable>
            </View>

            {/* Modal error */}
            {modalMessage ? (
              <Text style={styles.modalError}>{modalMessage}</Text>
            ) : (
              <></>
            )}
          </View>
        </Pressable>
      </Modal>
    );
  }

  return {
    NewMessageModal,
    openModal,
  };
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  header: {
    fontWeight: "bold",
    fontSize: 24,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "50%",
    minWidth: 350,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalHeaderWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgray",
  },

  dropdownWrapper: {
    marginTop: 15,
  },

  modalIconsWrapper: {
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalIcon: {},

  modalError: {
    marginTop: 15,
    color: "red",
  },
});
