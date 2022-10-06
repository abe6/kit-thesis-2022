import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthentication } from "./firebase/auth";
import LoginScreen from "./screens/LoginScreenScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPassword";
import DashboardScreen from "./screens/DashboardScreen";
import UpdateProfileScreen from "./screens/UpdateProfileScreen";
import MetricsScreen from "./screens/MetricsScreen";
import SendTextMessageScreen from "./screens/SendTextMessageScreen";
import SendAudioMessageScreen from "./screens/SendAudioMessageScreen";
import SendVideoMessageScreen from "./screens/SendVideoMessageScreen";
import {
  Text,
  Alert,
  SafeAreaView,
  View,
  StyleSheet,
  LogBox,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RFPercentage } from "react-native-responsive-fontsize";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const { currentUser, logout } = useAuthentication();
  LogBox.ignoreAllLogs();

  function confirmLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout canceled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => logout(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  function buildDrawer(props) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <Text style={styles.title}> K.i.T </Text>
          <View style={styles.headerInfoWrapper}>
            <View style={styles.headerUserInfoWrapper}>
              <Text style={styles.headerUserName}>
                {currentUser?.displayName}
              </Text>
              <Text style={styles.headerUserEmail}>{currentUser?.email}</Text>
            </View>
          </View>
        </View>

        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          {/* Add the logout button below all routes */}
          <DrawerItem label="Logout" onPress={confirmLogout} />
        </DrawerContentScrollView>
      </SafeAreaView>
    );
  }

  function publicStack() {
    return (
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ title: "Password Reset" }}
        />
      </Stack.Navigator>
    );
  }

  function privateStack() {
    return (
      <>
        <Drawer.Navigator
          initialRouteName="DashboardScreen"
          drawerContent={buildDrawer}
        >
          <Drawer.Screen
            name="DashboardScreen"
            component={DashboardScreen}
            options={{
              title: "Dashboard",
              drawerIcon: ({ size, color }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="UpdateProfileScreen"
            component={UpdateProfileScreen}
            options={{
              title: "Update profile",
              drawerIcon: ({ size, color }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="MetricsScreen"
            component={MetricsScreen}
            options={{
              title: "Metrics",
              drawerIcon: ({ size, color }) => (
                <Ionicons name="stats-chart" size={size} color={color} />
              ),
            }}
          />

          {/* Hidden from drawer. Unload when hidden */}
          <Drawer.Group
            screenOptions={{
              unmountOnBlur: true,
              drawerItemStyle: {
                display: "none",
              },
            }}
          >
            <Drawer.Screen
              name="SendTextMessageScreen"
              component={SendTextMessageScreen}
              options={{ title: "Send a message" }}
            />
            <Drawer.Screen
              name="SendAudioMessageScreen"
              component={SendAudioMessageScreen}
              options={{ title: "Send a message" }}
            />
            <Drawer.Screen
              name="SendVideoMessageScreen"
              component={SendVideoMessageScreen}
              options={{ title: "Send a message" }}
            />
          </Drawer.Group>
        </Drawer.Navigator>
      </>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? privateStack() : publicStack()}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    padding: 5,
    backgroundColor: "whitesmoke",
  },
  title: {
    alignSelf: "center",
    fontSize: RFPercentage(10),
    marginBottom: -10,
  },
  headerInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: "lightgray",
  },
  headerImage: {
    width: 75,
    height: 75,
    borderRadius: 75,
  },
  headerUserInfoWrapper: {
    paddingBottom: 5,
  },
  headerUserName: {
    fontSize: 30,
    textTransform: "capitalize",
  },
  headerUserEmail: {
    marginTop: 5,
    color: "gray",
  },
});
