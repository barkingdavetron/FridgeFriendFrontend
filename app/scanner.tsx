
// import necessary modules
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useNavigation } from "expo-router";
import axios from "axios";

// main component
const OCRAndRekognition = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedDate, setExtractedDate] = useState<string>("");
  const [labels, setLabels] = useState<string[]>([]);
  const [ingredientName, setIngredientName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#FFA726" },
      headerTitleStyle: { color: "#000", fontWeight: "bold" },
      headerTitle: "Scan Ingredient",
      headerBackVisible: true,
    });
  }, [navigation]);

  useEffect(() => {
    const checkLogin = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) {
        router.replace("/sign_in");
      } else {
        setToken(storedToken);
      }
    };
    checkLogin();
  }, []);

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await sendToBackend(uri);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await sendToBackend(uri);
    }
  };

  const sendToBackend = async (uri: string) => {
    try {
      setLoading(true);
      setExtractedDate("");
      setLabels([]);
      setIngredientName("");

      const formData = new FormData();
      formData.append("image", {
        uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      const response = await axios.post("http://192.168.1.2:5000/scan-expiry", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token || "",
        },
      });

      console.log("Server response:", response.data);

      if (response.data.expiryDate) setExtractedDate(response.data.expiryDate);
      if (response.data.labels && response.data.labels.length > 0) {
        setLabels(response.data.labels);
        setIngredientName(response.data.labels[0]);
      }
    } catch (err) {
      console.log("Error analyzing image:", err);
      Alert.alert("Error", "Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  const saveIngredient = async () => {
    if (!ingredientName || !quantity) {
      Alert.alert("Missing field", "Please enter a name and quantity.");
      return;
    }

    try {
      await axios.post(
        "http://192.168.1.2:5000/ingredients",
        {
          name: ingredientName,
          quantity,
          expiry: extractedDate || "",
        },
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      Alert.alert("Success", "Ingredient saved to your list.");
      setImageUri(null);
      setExtractedDate("");
      setLabels([]);
      setIngredientName("");
    } catch (error) {
      console.error("Failed to save ingredient:", error);
      Alert.alert("Error", "Could not save ingredient.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>Scan Your Ingredient</Text>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator size="large" color="#FFA726" />
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Ingredient Name:</Text>
          <TextInput
            style={styles.input}
            value={ingredientName}
            onChangeText={setIngredientName}
            placeholder="Ingredient name"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.label}>Quantity:</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="e.g. 1"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.label}>Expiry Date:</Text>
          <TextInput
            style={styles.input}
            value={extractedDate}
            onChangeText={setExtractedDate}
            placeholder="DD/MM or YYYY-MM-DD"
            placeholderTextColor="#aaa"
          />
          <View style={styles.buttonWrapper}>
            <Button title="Save to ingredients list" onPress={saveIngredient} color="#FFA726" />
          </View>
        </View>
      )}
      <View style={styles.buttonWrapper}>
        <Button title="Capture image using camera" onPress={captureImage} color="#FFA726" />
        <View style={{ height: 10 }} />
        <Button title="Pick image from gallery" onPress={pickImageFromGallery} color="#FFA726" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#000", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#FFA726", marginBottom: 20, textAlign: "center" },
  image: { width: 300, height: 300, marginVertical: 10, borderRadius: 10 },
  label: { fontWeight: "bold", color: "#FFA726", marginTop: 10 },
  input: {
    borderColor: "#FFA726",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginTop: 5,
    width: 250,
    textAlign: "center",
  },
  formContainer: { alignItems: "center", marginTop: 10 },
  buttonWrapper: {
    marginTop: 20,
    width: 250,
  },
});

export default OCRAndRekognition;
