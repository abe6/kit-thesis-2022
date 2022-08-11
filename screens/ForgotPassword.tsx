import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useAuthentication } from "../firebase/auth";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuthentication();

  const [error, setError] = useState<any>();
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [emailInput, setEmailInput] = useState<string>("");

  async function handleSubmit(e: GestureResponderEvent) {
    setError("");
    setMessage("");
    setLoading(true);

    if (!emailInput) {
      setError("You must submit an email.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(emailInput);
      setMessage("Check you inbox for password reset instructions.");
    } catch (error) {
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

      {message ? (
        <View style={styles.success}>
          <Text>{message}</Text>
        </View>
      ) : (
        <></>
      )}

      <Text style={styles.title}>K.i.T</Text>

      <View style={styles.inputsView}>
        <TextInput
          style={styles.input}
          onChangeText={setEmailInput}
          placeholder="Your email"
          keyboardType="email-address"
        />

        <Pressable
          style={styles.submit}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={{ fontSize: 24 }}>Reset password</Text>
        </Pressable>
      </View>
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
    marginTop: 5,
  },

  submit: {
    width: "100%",
    padding: 5,
    backgroundColor: "dodgerblue",
    borderRadius: 25,
    marginVertical: 15,
    alignItems: "center",
  },

  success: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "lightgreen",
    alignItems: "center",
  },

  error: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#D54826FF",
    alignItems: "center",
  },
});
