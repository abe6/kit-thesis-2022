import { StyleSheet, Text, SafeAreaView, View, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import MyMetics from "../components/MyMetrics";
import SharedMetricsList from "../components/SharedMetricsList";

export default function MetricsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Metrics</Text>

      <View style={styles.myMetricsWrapper}>
        <MyMetics />
      </View>
      <View style={styles.sharedMetricsWrapper}>
        <SharedMetricsList />
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
  myMetricsWrapper: {
    height: "65%",
  },
};

const tabletStyles = {
  title: {
    fontSize: RFPercentage(5),
    textAlign: "center",
  },
  myMetricsWrapper: {
    height: "55%",
    marginBottom: 10,
  },
};

const commonStyles = {
  container: {
    flex: 1,
    width: "100%",
  },
  sharedMetricsWrapper: {
    flex: 1,
    marginTop: 10,
  },
};

const IS_MOBILE = Dimensions.get("window").width < 800;
const combined = IS_MOBILE
  ? { ...commonStyles, ...mobileStyles }
  : { ...commonStyles, ...tabletStyles };

const styles = StyleSheet.create(combined);
