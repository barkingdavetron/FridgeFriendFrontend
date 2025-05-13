// import necessary modules
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter, useNavigation } from "expo-router";
// define structure of a shopping list item
interface Item {
  id: number;
  name: string;
  quantity: string;
}
// main component
const ShoppingList = () => {
  const [items, setItems] = useState<Item[]>([]); // list of current items
  const [name, setName] = useState("");// input for item name
  const [quantity, setQuantity] = useState("1");// input for quantity
  const [token, setToken] = useState<string | null>(null);// auth token
  const [loading, setLoading] = useState(true);// loading state
  const router = useRouter();
  const navigation = useNavigation();
  // set  header
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#FFA726" },
      headerTitleStyle: { color: "#000", fontWeight: "bold" },
      headerTitle: " Shopping List",
      headerBackVisible: true, 
      gestureEnabled: true,
    });
  }, [navigation]);
  // fetch shopping list items from backend
  useEffect(() => {
    const fetchItems = async () => {
      const storedToken = await AsyncStorage.getItem("token");// get token
      if (!storedToken) {
        router.replace("/sign_in");// redirect if not logged in
        return;
      }
      setToken(storedToken);
      try {
        const res = await axios.get("http://192.168.1.2:5000/shopping-list", {
          headers: { Authorization: storedToken },
        });
        setItems(res.data.items);// store fetched items
      } catch (err) {
        Alert.alert("Error failed to load shopping list");// show error
      } finally {
        setLoading(false);// stop spinner
      }
    };

    fetchItems();
  }, []);
  // add a new item to the shopping list
  const addItem = async () => {
    if (!name || !quantity) return Alert.alert("Missing Info enter name and quantity");

    try {
      const res = await axios.post(
        "http://192.168.1.2:5000/shopping-list",
        { name, quantity },
        { headers: { Authorization: token || "" } }
      );
            // remove from local state
      setItems((prev) => [...prev, { id: res.data.itemId, name, quantity }]);
      setName("");
      setQuantity("1");
    } catch (err) {
      Alert.alert("Error failed to add item");
    }
  };
  // delete item from shopping list
  const deleteItem = async (id: number) => {
    try {
      await axios.delete(`http://192.168.1.2:5000/shopping-list/${id}`, {
        headers: { Authorization: token || "" },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      Alert.alert("Error failed to delete item");
    }
  };
  // render each row in the list
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{item.name} - {item.quantity}</Text>
      <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
  // render screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>Your Shopping List</Text>
      {/* input for item name */}
      <TextInput
        style={styles.input}
        placeholder="Item name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
            {/* input for quantity */}
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        placeholderTextColor="#aaa"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
       {/* add item button */}
      <View style={styles.buttonWrapper}>
        <Button title="Add Item" onPress={addItem} color="#FFA726" />
      </View>
      {/* loading spinner or item list */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFA726" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ marginTop: 20 }}
        />
      )}
    </View>
  );
};
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFA726",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#FFA726",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginTop: 5,
    marginBottom: 15,
  },
});

export default ShoppingList;
