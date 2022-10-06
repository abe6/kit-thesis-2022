import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { onSnapshot } from "firebase/firestore";

import { useAuthentication } from "../firebase/auth";
import { useFirestore } from "../firebase/firestore";

import { SharedMetric, EmptyMetrics } from "./SharedMetric";
import { useShareWithFriendModal } from "./ShareWithFriendModal";

const IS_MOBILE = Dimensions.get("window").width < 800;

export default function SharedMetricsList() {
  const { getUserSnapshot } = useFirestore();
  const { currentUser } = useAuthentication();
  const { ShareWithFriendModal, openModal } = useShareWithFriendModal();

  const [sharedUsersList, setSharedUsersList] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Update sharedUsersList whenever userdata changes
    const unsub = onSnapshot(
      getUserSnapshot(currentUser.uid),
      (userSnapshot) => {
        const userData = userSnapshot.data();
        if (userData.metrics) {
          const userIds = userData.metrics.shared || [];
          setSharedUsersList(userIds);
        }
      }
    );

    return unsub;
  }, [currentUser]);

  function MetricItem({ item }) {
    return <SharedMetric sharedUid={item} />;
  }

  function EmptyItem() {
    return <EmptyMetrics />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>
          {IS_MOBILE ? "Shared metrics" : "Metrics shared with you"}
        </Text>
        <TouchableOpacity
          style={styles.openModalButton}
          onPress={() => openModal()}
        >
          <Text style={styles.openModalButtonText}>
            {IS_MOBILE ? "Share" : "Share your metrics"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Message list */}
      <View style={{ flex: 1 }}>
        <View style={styles.listContainer}>
          <FlatList
            horizontal
            data={sharedUsersList}
            keyExtractor={(item) => item}
            renderItem={MetricItem}
            ListEmptyComponent={EmptyItem}
          />
        </View>
      </View>

      <ShareWithFriendModal />
    </View>
  );
}

const mobileStyles = StyleSheet.create({});

const tabletStyles = StyleSheet.create({});

const commonStyles = StyleSheet.create({
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
    marginStart: -10,
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

const styles = IS_MOBILE
  ? { ...commonStyles, ...mobileStyles }
  : { ...commonStyles, ...tabletStyles };
