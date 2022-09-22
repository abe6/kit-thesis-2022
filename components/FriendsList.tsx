import { Text, View, StyleSheet, FlatList, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { useAuthentication } from "../firebase/auth";
import { useFirestore } from "../firebase/firestore";
import { Friend, EmptyFriend } from "./Friend";
import { useAddFriendModal } from "./AddFriendModal";

export default function FriendsList() {
  const { getUserSnapshot } = useFirestore();
  const { currentUser } = useAuthentication();
  const { AddFriendModal, openModal } = useAddFriendModal();

  const [friendsUidList, setFriendsUidList] = useState([]);
  const [error, setError] = useState("");

  // Only runs once to start the listening
  useEffect(() => {
    if (!currentUser) return;
    // Updates friendslist whenever it changes
    const unsub = onSnapshot(
      getUserSnapshot(currentUser.uid),
      (userSnapshot) => {
        try {
          setFriendsUidList(userSnapshot.data().friends || []);
        } catch (error) {
          setError(error);
        }
      }
    );

    return unsub;
  }, [currentUser]);

  function FriendItem({ item }) {
    return <Friend uid={item} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>
          Your Friends{" "}
          <Text style={{ color: "lightgray", fontSize: 18 }}>
            ({friendsUidList.length})
          </Text>
        </Text>
        <Pressable style={styles.openModalButton} onPress={() => openModal()}>
          <Text style={styles.openModalButtonText}>Add Friend</Text>
        </Pressable>
      </View>

      {/* Friends list */}
      <View style={{ flex: 1, marginHorizontal: -20 }}>
        <View style={styles.listContainer}>
          <FlatList
            horizontal
            data={friendsUidList}
            renderItem={FriendItem}
            keyExtractor={(item) => item}
            ListEmptyComponent={EmptyFriend}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      <AddFriendModal />
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
