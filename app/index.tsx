// import necessary modules
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
const HomeScreen = () => {
  const router = useRouter();// router for navigation
  const navigation = useNavigation(); // navigation object
  // set header styles
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#FFA726' },// orange background
      headerTitleStyle: { color: '#000', fontWeight: 'bold' }, // black bold title
      headerTitle: 'FridgeFriend ', // screen title
      headerBackVisible: true, 
      gestureEnabled: true,
    });
  }, [navigation]);
  // render screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />

      <Text style={styles.title}>Welcome to FridgeFriend </Text>
  {/* sign in button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/sign_in')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      {/* sign up button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/sign_up')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};
// stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFA726',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFA726',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
