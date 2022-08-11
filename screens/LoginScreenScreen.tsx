import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useAuthentication } from "../firebase/auth";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function LoginScreen({ navigation }) {
  const { login } = useAuthentication();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>();

  async function handleSignIn(e: GestureResponderEvent) {
    setError("");
    setLoading(true);

    if (!emailInput) {
      setError("You must sign in with an email.");
      setLoading(false);
      return;
    }

    if (!passwordInput) {
      setError("You must enter a password.");
      setLoading(false);
      return;
    }

    try {
      await login(emailInput, passwordInput);
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.error}>
          <Text>{error}</Text>
        </View>
      ) : (
        <></>
      )}
      <Text style={styles.title}>K.i.T</Text>

      <KeyboardAvoidingView behavior="padding" style={styles.inputsView}>
        <TextInput
          style={styles.input}
          onChangeText={setEmailInput}
          placeholder="Your email"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          onChangeText={setPasswordInput}
          placeholder="Password"
          keyboardType="default"
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.submit} onPress={handleSignIn}>
          <Text style={{ fontSize: 24 }}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.mutedText}>Forgot Password?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.register}>Register Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignSelf: "center",
    width: "100%",
  },

  title: {
    alignSelf: "center",
    fontSize: RFPercentage(15),
    marginBottom: -20,
  },

  inputsView: {
    alignItems: "center",
    paddingHorizontal: "20%",
  },

  input: {
    marginTop: 10,
    width: "100%",
    height: 60,
    padding: 20,
    borderColor: "lightgray",
    borderRadius: 25,
    borderWidth: 0.25,
  },

  mutedText: {
    color: "lightgray",
    marginTop: -5,
    marginBottom: 10,
  },

  submit: {
    width: "100%",
    padding: 5,
    backgroundColor: "dodgerblue",
    borderRadius: 25,
    marginVertical: 15,
    alignItems: "center",
  },

  register: {
    alignSelf: "center",
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});
