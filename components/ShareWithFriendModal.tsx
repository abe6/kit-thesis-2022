import {
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFirestore } from "../firebase/firestore";

export function useShareWithFriendModal() {
  const { shareWithFriend } = useFirestore();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState("");

  let emailInput = "";

  function openModal() {
    setModalMessage("");
    setModalVisible(true);
    setLoading(false);
  }

  function handleSubmit() {
    if (!emailInput) {
      setModalMessage("Please input an email");
      return;
    }
    setLoading(true);

    shareWithFriend(emailInput.toLowerCase())
      .then(() => {
        setModalVisible(false);
      })
      .catch((error) => {
        setModalMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function ShareWithFriendModal() {
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
              <Text style={styles.header}>Share with a friend</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={36} color="black" />
              </Pressable>
            </View>

            <View style={styles.modalBodyWrapper}>
              <Text style={{ fontSize: 18 }}>What is your friends email?</Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => (emailInput = e)}
                placeholder="Your friends email"
                keyboardType="email-address"
              />
            </View>

            <Pressable
              style={styles.addFriendButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.addFriendText}>Share</Text>
            </Pressable>
            {loading ? (
              <ActivityIndicator style={{ marginTop: 10 }} color="green" />
            ) : (
              <></>
            )}

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
    ShareWithFriendModal,
    openModal,
  };
}

const styles = StyleSheet.create({
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

  header: {
    fontWeight: "bold",
    fontSize: 24,
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

  modalBodyWrapper: {
    alignSelf: "flex-start",
    marginTop: 10,
    width: "100%",
  },

  modalError: {
    marginTop: 15,
    color: "red",
  },

  input: {
    width: "100%",
    marginTop: 15,
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "gray",
    borderRadius: 25,
    borderWidth: 0.25,
  },
  addFriendButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: "whitesmoke",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  addFriendText: {},
});
