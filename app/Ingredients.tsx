// import necessary modules
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ListRenderItem,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter, useNavigation } from "expo-router";
//   data structure
interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  expiry: string | null;
}
// main component
const IngredientsList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); // ingredient list state
  const [loading, setLoading] = useState<boolean>(true); // loading state
  const [token, setToken] = useState<string | null>(null); // auth token
  const router = useRouter(); // router for navigation
  const navigation = useNavigation();// navigation object
  //  header styles
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: true,
      gestureEnabled: true,
      headerStyle: {
        backgroundColor: "#FFA726",
      },
      headerTitleStyle: {
        color: "#000",
        fontWeight: "bold",
      },
      headerTitle: "Ingredients List",
    });
  }, [navigation]);
  // fetch ingredients from backend
  useEffect(() => {
    const fetchIngredients = async () => {
      const storedToken = await AsyncStorage.getItem("token"); // get stored token
      if (!storedToken) {
        router.replace("/sign_in"); // redirect if not logged in
        return;
      }
      setToken(storedToken);

      try {
        const response = await axios.get("http://192.168.1.2:5000/getIngredients", {
          headers: { Authorization: storedToken },
        });
        setIngredients(response.data.ingredients); // set ingredients data
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
        Alert.alert("Error", "Failed to load ingredients");
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchIngredients();
  }, [router]);
  // delete an ingredient by id
  const deleteIngredient = async (id: number) => {
    if (!token) return;
    try {
      await axios.delete(`http://192.168.1.2:5000/ingredients/${id}`, {
        headers: { Authorization: token },
      });
      setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      Alert.alert("Error", "Failed to delete ingredient");
    }
  };
  // render each ingredient card
  const renderItem: ListRenderItem<Ingredient> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {/* delete ingredient from backend */}
        <TouchableOpacity onPress={() => deleteIngredient(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText}>Quantity: {item.quantity}</Text>
      <Text style={styles.cardText}>Expiry: {item.expiry || "N/A"}</Text>
    </View>
  );
     // render full screen layout including ingredients list
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}> Your Ingredients</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFA726" />
      ) : (
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No ingredients found.</Text>}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFA726",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: "#FFA726",
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA726",
  },
  cardText: {
    fontSize: 14,
    color: "#eee",
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
    fontSize: 16,
  },
});

export default IngredientsList;
