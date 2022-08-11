import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useAuthentication } from "../firebase/auth";
import { useState, useEffect } from "react";
import { useFirestore } from "../firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { Message, EmptyMessage } from "./Message";
import { useNewMessageModal } from "./NewMessageModal";

export default function MessageList() {
  const { getUserSnapshot } = useFirestore();
  const { currentUser } = useAuthentication();
  const { NewMessageModal, openModal } = useNewMessageModal();

  const [messagesList, setMessagesList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    // Updates messagesList whenever it changes
    const unsub = onSnapshot(
      getUserSnapshot(currentUser.uid),
      (userSnapshot) => {
        try {
          const messages = userSnapshot.data().messages ?? [];
          messages.sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
          setMessagesList(messages);
        } catch (error) {
          setError(error.message);
        }
      }
    );

    return unsub;
  }, [currentUser]);

  function MessageItem({ item }) {
    return <Message message={item} openModal={openModal} />;
  }

  function EmptyItem() {
    return <EmptyMessage />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>
          Your Messages{" "}
          <Text style={{ color: "lightgray", fontSize: 18 }}>
            ({messagesList.length})
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.openModalButton}
          onPress={() => openModal()}
        >
          <Text style={styles.openModalButtonText}>New Message</Text>
        </TouchableOpacity>
      </View>

      {/* Message list */}
      <View style={{ flex: 1, marginHorizontal: -20 }}>
        <View style={styles.listContainer}>
          <FlatList
            horizontal
            data={messagesList}
            keyExtractor={(item) => item.messageId}
            renderItem={MessageItem}
            ListEmptyComponent={EmptyItem}
          />
        </View>
      </View>

      <NewMessageModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  header: {
    fontWeight: "bold",
    fontSize: 24,
  },

  listContainer: {
    height: "100%",
    width: "100%",
  },

  openModalButton: {
    backgroundColor: "dodgerblue",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  openModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
