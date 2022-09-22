import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { useAuthentication } from "../firebase/auth";
import { useFirestore } from "../firebase/firestore";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function RegisterScreen() {
  const { register, changeProfile } = useAuthentication();
  const { createUserDoc } = useFirestore();

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const [emailInput, setEmailInput] = useState<string>("");
  const [displayNameInput, setDisplayNameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>();
  const [passwordConfirmInput, setPasswordConfirmInput] = useState<string>();

  async function handleSubmit(e: GestureResponderEvent) {
    setError("");
    setLoading(true);

    if (!emailInput) {
      setError("You must provide an email.");
      setLoading(false);
      return;
    }

    if (!displayNameInput) {
      setError("You must provide a display name.");
      setLoading(false);
      return;
    }

    if (!passwordInput || !passwordConfirmInput) {
      setError("You must enter a password in both fields.");
      setLoading(false);
      return;
    }

    if (passwordInput != passwordConfirmInput) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    register(emailInput, passwordInput)
      .then((credentials) => {
        createUserDoc(
          // Updates db
          credentials.user.uid,
          credentials.user.email,
          displayNameInput
        );
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
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

      <View style={styles.inputsView}>
        <TextInput
          style={styles.input}
          onChangeText={setEmailInput}
          placeholder="Your email"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          onChangeText={setDisplayNameInput}
          placeholder="Display name"
          keyboardType="default"
        />

        <TextInput
          style={styles.input}
          onChangeText={setPasswordInput}
          placeholder="Password"
          keyboardType="default"
          secureTextEntry={true}
        />

        <TextInput
          style={styles.input}
          onChangeText={setPasswordConfirmInput}
          placeholder="Confirm Password"
          keyboardType="default"
          secureTextEntry={true}
        />

        <Pressable
          style={styles.submit}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={{ fontSize: 24 }}>Sign Up</Text>
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

  error: {
    marginTop: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#D54826FF",
  },
});
