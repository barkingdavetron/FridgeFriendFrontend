// import necessary modules
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useNavigation } from 'expo-router';
// spoonacular api key and url
const KEY = '528ac505cbdc4e7bacbaafb772d4062e';
const URL = 'https://api.spoonacular.com/recipes/complexSearch';
// main component
const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState(''); // user input
  const [recipes, setRecipes] = useState<any[]>([]); // recipe results
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState<string | null>(null); // error state
  const router = useRouter(); // router object
  const navigation = useNavigation(); // navigation object
  // set  header styles
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#FFA726' },
      headerTitleStyle: { color: '#000', fontWeight: 'bold' },
      headerTitle: 'Recipe Finder ',
      headerBackVisible: true, 
      gestureEnabled: true,    
    });
  }, [navigation]);
  
  // check if user is logged in
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/sign_in"); // redirect if no token
      }
    };
    checkToken();
  }, []);
    // fetch recipes based on user input
  const searchRecipes = async () => {
    if (!searchTerm) {
      Alert.alert('Please enter a search term!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(URL, {
        params: {
          query: searchTerm,
          apiKey: KEY,
        },
      });
      setRecipes(response.data.results); // store recipe results
    } catch (error) {
      setError('Failed to fetch recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  // fetch recipes based on user stored ingredients
  const fetchByIngredients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem("token"); // get stored  token
      if (!token) { // redirect if not logged in
        router.replace("/sign_in");
        return;
      }
      // fetch user's saved ingredients from backend
      const res = await axios.get("http://192.168.1.2:5000/getIngredients", {
        headers: { Authorization: token },
      });
      // extract ingredient names into a string
      const names = res.data.ingredients.map((ing: any) => ing.name).join(", ");
      if (!names) {
        Alert.alert("No ingredients found in your list.");
        setIsLoading(false);
        return;
      }
      // if no ingredients  stop and show alert
      const recipeRes = await axios.get(URL, {
        params: {
          query: names,
          apiKey: KEY,
        },
      });
// show recipes based on ingredients
      setRecipes(recipeRes.data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recipes from ingredients.");
    } finally {
      setIsLoading(false);
    }
  };
      // navigate to recipe details
  const handleRecipePress = (id: number) => {
    router.push(`/displayed?id=${id}`);
  };
  // render screen
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>Search for Recipes</Text>
      {/* input for search term */}
      <TextInput
        style={styles.input}
        placeholder="e.g. Potato"
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {/* button to search by term */}
      <View style={styles.buttonWrapper}>
        <Button title="Search Recipes" color="#FFA726" onPress={searchRecipes} />
      </View>
      {/* button to search using stored ingredients */}
      <View style={styles.buttonWrapper}>
        <Button title="Recipes from My Ingredients" color="#FFA726" onPress={fetchByIngredients} />
      </View>
      {/* show loading or error as needed */}
      {isLoading && <ActivityIndicator size="large" color="#FFA726" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {/* display recipe results */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => handleRecipePress(item.id)}
          >
            <Text style={styles.recipeTitle}>🍴 {item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading && !error ? <Text style={styles.empty}>No recipes found.</Text> : null
        }
      />
    </ScrollView>
  );
};
//stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFA726',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderColor: '#FFA726',
    borderWidth: 1,
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonWrapper: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  recipeItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#FFA726',
    borderWidth: 1,
  },
  recipeTitle: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});

export default RecipeSearch;
