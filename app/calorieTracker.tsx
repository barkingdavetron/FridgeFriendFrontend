// Import necessary modules from React and React Native
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
// Define the structure of a calorie entry
interface Entry {
  id: number;
  food: string;
  calories: number;
  date: string;
}
// Main  component
export default function CalorieTracker() {
    // State for food name calories and list of entries
  const navigation = useNavigation();
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  // useEffect to set header styling and behavior when component mounts
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: true, // Enable back button
      gestureEnabled: true, // Enable swipe gesture
      headerStyle: {
        backgroundColor: "#FFA726", // Orange background
      },
      headerTitleStyle: {// Black title text
        color: "#000",
        fontWeight: "bold",
      },
      headerTitle: " Calorie Tracker", // Title text
    });
  }, [navigation]);
  // Function to add a new calorie entry to the list
  const addEntry = () => {
        // Show alert if input is incomplete
    if (!food || !calories) {
      Alert.alert("Please enter both food and calories");
      return;
    }
    // Create a new entry object
    const newEntry: Entry = {
      id: Date.now(), // Unique ID using  current timestamp
      food,
      calories: parseInt(calories), // Convert string to number
      date: new Date().toLocaleDateString(), // Format the date
    };
        // Add the new entry to the beginning of the list
    setEntries([newEntry, ...entries]);
        // Clear input fields
    setFood("");
    setCalories("");
  };
  // Render the component UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Calories</Text>
    {/* Text input for the user to enter a food item */}
      <TextInput
        placeholder="Food item"
        placeholderTextColor="#ccc"
        value={food}
        onChangeText={setFood}
        style={styles.input}
      />
    {/* Text input for the user to enter a calorie count */}
      <TextInput
        placeholder="Calories"
        placeholderTextColor="#ccc"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        style={styles.input}
      />
          {/* Button that adds the current input as a new entry */}
      <TouchableOpacity style={styles.button} onPress={addEntry}>
        <Text style={styles.buttonText}>Add Entry</Text>
      </TouchableOpacity>

 {/* Scrollable list that displays all calorie entries. 
        Each entry shows the food calories and date*/}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryText}>
              {item.food} - {item.calories} cal
            </Text>
            <Text style={styles.entryDate}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No entries yet.</Text>
        }
        style={{ marginTop: 20, width: "100%" }}
      />
    </View>
  );
}
// Stylesheet 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFA726",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFA726",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#FFA726",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  entryCard: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  entryText: {
    fontSize: 16,
    color: "#fff",
  },
  entryDate: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#ccc",
  },
});
