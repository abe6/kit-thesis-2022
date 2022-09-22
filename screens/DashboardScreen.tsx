import { SafeAreaView, Text, View, StyleSheet, Dimensions } from "react-native";
import { useAuthentication } from "../firebase/auth";
import { useState, useEffect } from "react";
import MessageList from "../components/MessageList";
import FriendsList from "../components/FriendsList";
import { RFPercentage } from "react-native-responsive-fontsize";

const IS_MOBILE = Dimensions.get("window").width < 800;

export default function DashboardScreen({ navigation }) {
  const { currentUser } = useAuthentication();

  const [error, setError] = useState("");
  const [title, setTitle] = useState("Welcome");

  // Add a listener to run whenever the screen is mounted
  useEffect(() => {
    setTitle(
      currentUser && currentUser.displayName
        ? `Welcome, ${currentUser.displayName}`
        : "Welcome"
    );

    return navigation.addListener("focus", () => {
      // Update the name as it may of changed
      setTitle(
        currentUser && currentUser.displayName
          ? `Welcome, ${currentUser.displayName}`
          : "Welcome"
      );
    });
  }, [navigation, currentUser]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.messageListWrapper}>
        <MessageList />
      </View>
      <View style={styles.friendsListWrapper}>
        <FriendsList />
      </View>
    </SafeAreaView>
  );
}

const mobileStyles = {
  title: {
    fontSize: RFPercentage(4),
    textAlign: "center",
    marginBottom: 10,
  },
  messageListWrapper: {
    height: "70%",
  },
};

const tabletStyles = {
  title: {
    fontSize: RFPercentage(5),
    textAlign: "center",
    marginBottom: 5,
  },
  messageListWrapper: {
    height: "60%",
  },
};

const commonStyles = {
  container: {
    flex: 1,
    width: "100%",
  },

  friendsListWrapper: {
    flex: 1,
  },
};

const combined = IS_MOBILE
  ? { ...commonStyles, ...mobileStyles }
  : { ...commonStyles, ...tabletStyles };

const styles = StyleSheet.create(combined);
