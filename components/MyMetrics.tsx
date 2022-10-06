import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";

import { onSnapshot } from "firebase/firestore";
import { BarChart, XAxis, YAxis, Grid } from "react-native-svg-charts";
import { RFPercentage } from "react-native-responsive-fontsize";

import { useAuthentication } from "../firebase/auth";
import { useFirestore } from "../firebase/firestore";

export default function MyMetics() {
  const { getUserSnapshot } = useFirestore();
  const { currentUser } = useAuthentication();

  const [userData, setUserData] = useState({});

  const last7Days = getLast7Days();

  useEffect(() => {
    if (!currentUser) return;

    // Update userdata whenever it changes
    const unsub = onSnapshot(
      getUserSnapshot(currentUser.uid),
      (userSnapshot) => {
        setUserData(userSnapshot.data());
      }
    );

    return unsub;
  }, [currentUser]);

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
    var mapOfDays = new Map(last7Days.map((i) => [i, 0]));
    timestamps.forEach((time) => {
      const date = new Date(time);
      const dateString = date.toLocaleDateString();
      if (mapOfDays.has(dateString)) {
        mapOfDays.set(dateString, mapOfDays.get(dateString) + 1);
      }
    });
    return mapOfDays;
  }

  function getSentChartData() {
    const sentTimes = userData.metrics ? userData.metrics.messages_sent : [];
    return countTimetampsInWeek(sentTimes);
  }

  function getReceivedChartData() {
    const sentTimes = userData.metrics
      ? userData.metrics.messages_received
      : [];
    return countTimetampsInWeek(sentTimes);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Your Metrics</Text>
      <View style={styles.chartsContainer}>
        <View style={styles.sentChart}>
          <View style={styles.subTitle}>
            <Text style={styles.subTitle}>Messages sent (last 7 days)</Text>
          </View>

          <View style={{ flex: 1, flexDirection: "row" }}>
            <YAxis
              data={Array.from(getSentChartData().values())}
              svg={{ fontSize: RFPercentage(1), fill: "black" }}
              contentInset={{ top: 10, bottom: 10 }}
              numberOfTicks={Math.max(...getSentChartData().values())}
            />
            <BarChart
              style={{ flex: 1 }}
              data={Array.from(getSentChartData())}
              yAccessor={(item) => item.item[1]}
              xAccessor={(item) => item.item[0]}
              contentInset={{ top: 10, bottom: 10 }}
              svg={{ fill: "dodgerblue" }}
            >
              <Grid />
            </BarChart>
          </View>

          <XAxis
            data={last7Days}
            formatLabel={(value, index) => last7Days[index]}
            contentInset={{ left: 30, right: 20 }}
            svg={{ fontSize: RFPercentage(1), fill: "black" }}
          />
        </View>

        <View style={styles.receivedChart}>
          <View style={styles.subTitle}>
            <Text style={styles.subTitle}>Messages received (last 7 days)</Text>
          </View>

          <View style={{ flex: 1, flexDirection: "row" }}>
            <YAxis
              data={Array.from(getReceivedChartData().values())}
              svg={{ fontSize: RFPercentage(1), fill: "black" }}
              contentInset={{ top: 10, bottom: 10 }}
              numberOfTicks={Math.max(...getReceivedChartData().values())}
            />
            <BarChart
              style={{ flex: 1 }}
              data={Array.from(getReceivedChartData())}
              yAccessor={(item) => item.item[1]}
              xAccessor={(item) => item.item[0]}
              contentInset={{ top: 10, bottom: 10 }}
              svg={{ fill: "dodgerblue" }}
            >
              <Grid />
            </BarChart>
          </View>

          <XAxis
            data={last7Days}
            formatLabel={(value, index) => last7Days[index]}
            contentInset={{ left: 30, right: 20 }}
            svg={{ fontSize: RFPercentage(1), fill: "black" }}
          />
        </View>
      </View>
    </View>
  );
}

const mobileStyles = {
  chartsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  sentChart: {
    width: "100%",
    height: "48%",
  },
  receivedChart: {
    width: "100%",
    height: "48%",
  },
};

const tabletStyles = {
  chartsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    // marginVertical: 10,
  },
  sentChart: {
    width: "45%",
    height: "100%",
  },
  receivedChart: {
    width: "45%",
    height: "100%",
  },
};

const commonStyles = {
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  subTitle: {
    alignItems: "center",
    fontSize: 18,
  },
};

const IS_MOBILE = Dimensions.get("window").width < 800;
const combined = IS_MOBILE
  ? { ...commonStyles, ...mobileStyles }
  : { ...commonStyles, ...tabletStyles };

const styles = StyleSheet.create(combined);
