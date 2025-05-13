// import necessary modules
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter, useNavigation } from "expo-router";
import moment from "moment";
// structure for each ingredient entry
interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  expiry: string | null;
}
// main component
const WasteTracker = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);// store fetched ingredients
  const [loading, setLoading] = useState(true);// loading spinner
  const router = useRouter();
  const navigation = useNavigation();
  // set header options
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#FFA726" },
      headerTitleStyle: { color: "#000", fontWeight: "bold" },
      headerTitle: "Waste Tracker ",
      headerBackVisible: true, 
      gestureEnabled: true,
      
    });
  }, [navigation]);
  // fetch ingredient list from backend
  useEffect(() => {
    const fetchIngredients = async () => {
      const token = await AsyncStorage.getItem("token"); // get token
      if (!token) return router.replace("/sign_in");// redirect if not

      try {
        const res = await axios.get("http://192.168.1.2:5000/getIngredients", {
          headers: { Authorization: token },
        });// store ingredients
        setIngredients(res.data.ingredients);
      } catch (err) {
        console.error(err);// show error if fetch fails
        Alert.alert("Error could not load data");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);
  // render each ingredient item with expiry color coding
  const renderItem = ({ item }: { item: Ingredient }) => {
    const expiryDate = item.expiry ? moment(item.expiry) : null; // parse expiry using moment
    const daysLeft = expiryDate ? expiryDate.diff(moment(), "days") : null; // calculate days left
    const isExpiringSoon = daysLeft !== null && daysLeft <= 7;// check if within 7 days
  // render screen
    return (
      <View
        style={[
          styles.item,
          { backgroundColor: isExpiringSoon ? "#FF5252" : "#66BB6A" },
        ]}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>Quantity: {item.quantity}</Text>
        <Text style={styles.detail}>Expiry: {item.expiry || "N/A"}</Text>
        {daysLeft !== null && (
          <Text style={styles.days}>
            {daysLeft >= 0 ? `${daysLeft} day(s) left` : "Expired"}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>Track What’s About to Expire</Text>
            {/* show  list */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFA726" />
      ) : (
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#fff" }}>
              No ingredients found.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFA726",
    textAlign: "center",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  detail: {
    color: "#f5f5f5",
    fontSize: 14,
  },
  days: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default WasteTracker;
