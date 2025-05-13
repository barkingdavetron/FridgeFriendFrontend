
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useNavigation } from 'expo-router';
// backend login endpoint
const apiUrl = "http://192.168.1.2:5000/login";
// main component
export default function SignIn() {
  const router = useRouter();// router for navigation
  const navigation = useNavigation();// access to navigation options
  const [email, setEmail] = useState('');// email input
  const [password, setPassword] = useState('');// password input
  // set  header

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#FFA726' },
      headerTitleStyle: { color: '#000', fontWeight: 'bold' },
      headerTitle: 'Sign In',
      headerBackVisible: true, 
      gestureEnabled: true,
    });
  }, [navigation]);
  // function to handle login request
  const signInUser = async () => {
    if (!email || !password) {
      // show alert if form incomplete
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // send login credentials
      });

      const data = await response.json(); // parse response

      if (!response.ok) {
        throw new Error(data.error || "Login failed"); // throw error if login unsuccessful
      }
      // save user and token to storage
      await AsyncStorage.setItem("user", JSON.stringify(data));
      await AsyncStorage.setItem("token", data.token);
      Alert.alert("Success", "User logged in");  // notify user
      router.replace("/home");// navigate to home page
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unknown error occurred.");// show error alert
    }
  };
  // render screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>Welcome Back </Text>
      {/* email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {/* password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* sign in button */}
      <View style={styles.buttonWrapper}>
        <Button title="Sign In" onPress={signInUser} color="#FFA726" />
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
