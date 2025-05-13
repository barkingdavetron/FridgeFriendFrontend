
// import necessary modules
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native'; // core UI components
import axios from 'axios';
import { useLocalSearchParams, useNavigation } from 'expo-router';
// API key for Spoonacular
const KEY = '528ac505cbdc4e7bacbaafb772d4062e';
// main component
export default function DisplayedRecipe() {
  const { id } = useLocalSearchParams(); // get recipe id from url
  const [recipe, setRecipe] = useState<any>(null); // recipe data
  const [loading, setLoading] = useState(true);// loading state
  const navigation = useNavigation(); // navigation object

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#FFA726' },
      headerTitleStyle: { color: '#000', fontWeight: 'bold' },
      headerTintColor: '#000',
      headerTitle: 'Recipe Details',
      headerBackVisible: true, 
      gestureEnabled: true,
    });
  }, [navigation]);
  // fetch recipe from api
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${KEY}`
        );
        setRecipe(res.data); // store result
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();  // call fetch if id exists
  }, [id]);
 // show loading spinner
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA726" />
      </View>
    );
  }
  // show error message if recipe not found
  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }
  // render recipe details
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>{recipe.title}</Text>
      {/* recipe image */}
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      )}
      {/* list of ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      
      {recipe.extendedIngredients?.map((ing: any) => (
        <Text key={ing.id} style={styles.text}>- {ing.original}</Text>
      ))}

      <Text style={styles.sectionTitle}> Instructions</Text>
      <Text style={styles.text}>
        {recipe.instructions ? recipe.instructions.replace(/<[^>]+>/g, '') : 'No instructions available.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFA726',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA726',
    marginTop: 15,
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
