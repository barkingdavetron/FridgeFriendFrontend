// import necessary modules
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  StatusBar
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
// backend registration endpoint
const apiUrl = "http://192.168.1.2:5000/register";
// main component
export default function SignUp() {
  const [username, setUsername] = useState(''); // username input
  const [email, setEmail] = useState(''); // email input
  const [password, setPassword] = useState('');// password input
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#FFA726' },
      headerTitleStyle: { color: '#000', fontWeight: 'bold' },
      headerTitle: 'Sign Up',
      headerBackVisible: true, 
      gestureEnabled: true,
    });
  }, [navigation]);
  // function to register a new user
  const registerUser = async () => {
    if (!username || !email || !password) {
          // check if all fields are filled
      Alert.alert("Error please fill out all fields");
      return;
    }

    try {
      console.log("Sending request to backend:", { username, email, password });
      // send registration data to backend
      let response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      let data = await response.json();// parse json response
      console.log("Response data:", data);//  log
      // if backend responds with error
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
          // success message
      Alert.alert("Success user registered successfully");
            // clear input fields
      setUsername('');
      setEmail('');
      setPassword('');
      router.replace('/sign_in');
            // navigate to sign in screen
    } catch (error: unknown) {
            // show error message based on type
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("An unknown error has occurred.");
      }
    }
  };
  // render screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button title="Sign Up" onPress={registerUser} color="#FFA726" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFA726",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderColor: "#FFA726",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonWrapper: {
    marginTop: 10,
  },
});
