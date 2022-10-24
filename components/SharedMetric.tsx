import { Text, View, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { useFirestore } from "../firebase/firestore";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export function SharedMetric({ sharedUid }) {
  const [userData, setUserData] = useState({});
  const { getUserSnapshot } = useFirestore();

  const [sentToday, setSentToday] = useState(0);
  const [sentWeek, setSentWeek] = useState(0);
  const [receivedWeek, setReceivedWeek] = useState(0);

  useEffect(() => {
    // Update whenever userdata changes
    const unsub = onSnapshot(getUserSnapshot(sharedUid), (userSnapshot) => {
      setUserData(userSnapshot.data());
      if (userSnapshot.data().metrics) {
        const sent = userSnapshot.data().metrics.messages_sent || [];
        const received = userSnapshot.data().metrics.messages_received || [];
        setSentToday(countTimetampsToday(sent));
        setSentWeek(countTimetampsInWeek(sent));
        setReceivedWeek(countTimetampsInWeek(received));
      }
    });

    return unsub;
  }, []);

  function getLast7Days() {
    var last7Days = [];
    for (var i = 0; i < 8; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toLocaleDateString());
    }
    return last7Days;
  }

  function countTimetampsInWeek(timestamps: number[]) {
    const last7days = getLast7Days();
    var count = 0;
    timestamps.forEach((time) => {
      const date = new Date(time);
      const dateString = date.toLocaleDateString();
      if (last7days.includes(dateString)) {
        count += 1;
      }
    });
    return count;
  }

  function countTimetampsToday(timestamps: number[]) {
    const todayDate = new Date().getDate();
    var count = 0;
    timestamps.forEach((time) => {
      const date = new Date(time);
      const day = date.getDate();
      if (todayDate == day) {
        count += 1;
      }
    });
    return count;
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image
          style={style.userPicture}
          source={{ uri: userData.data ? userData.data.photoURL : "" }}
        />
        <Text style={style.userName}>
          {userData.data ? userData.data.displayName : "Contact"}
        </Text>
      </View>
      <Text style={style.infoLine}>Messages sent (today): {sentToday}</Text>
      <Text style={style.infoLine}>
        Messages sent (last 7 days): {sentWeek}
      </Text>
      <Text style={style.infoLine}>
        Messages received (last 7 days): {receivedWeek}
      </Text>
    </View>
  );
}

export function EmptyMetrics() {
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
          fontSize: RFPercentage(1.5),
          // fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        No metrics have been shared with you yet
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    width: RFPercentage(35),
    marginLeft: 10,
    marginEnd: 10,
    marginTop: 15,
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 15,
    // Shadow
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
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 7,
    borderBottomColor: "lightgray",
    borderBottomWidth: 0.5,
  },
  userName: {
    fontSize: RFPercentage(2.5),
    alignSelf: "center",
    textDecorationLine: "underline",
  },
  infoLine: {
    fontSize: RFPercentage(1.7),
  },
  userPicture: {
    height: RFPercentage(3),
    aspectRatio: 1,
    borderRadius: RFValue(100),
    marginRight: 10,
  },
});
