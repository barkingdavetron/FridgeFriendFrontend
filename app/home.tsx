// import necessary modules
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, StatusBar, ScrollView, FlatList
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// define leaderboard entry structure
interface LeaderboardEntry {
  username: string;
  points: number;
}
// main home screen component
const HomeScreen = () => {
  const router = useRouter(); // router for navigation
  const navigation = useNavigation(); // navigation object
  const [loading, setLoading] = useState(true);// loading state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);// leaderboard data
  // set header styles
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: false, // hides the back arrow
      gestureEnabled: true,
      headerStyle: {
        backgroundColor: '#FFA726',
      },
      headerTitleStyle: {
        color: '#000',
        fontWeight: 'bold',
      },
      headerTitle: 'FridgeFriend ',
    });
  }, [navigation]);
  // check token and fetch leaderboard
  useEffect(() => {
    const checkTokenAndLoad = async () => {
      const token = await AsyncStorage.getItem('token'); // get jwt token
      if (!token) {
        router.replace('/sign_in'); // redirect if no token
      } else {
        try {
          const res = await axios.get('http://192.168.1.2:5000/leaderboard', {
            headers: { Authorization: token }
          });
          setLeaderboard(res.data.leaderboard); // update leaderboard
        } catch (err) {
          console.error('Failed to fetch leaderboard');
        } finally {
          setLoading(false); // stop loading
        }
      }
    };
    checkTokenAndLoad(); // call function on mount
  }, []);
  // show each leaderboard item
  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.leaderboardText}>
        {index + 1}. {item.username} - {item.points} pts
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA726" />
      </View>
    );
  }

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFA726" />
      <Text style={styles.title}>Welcome to FridgeFriend</Text>
      {/* navigation grid */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/scanner')}>
          <Text style={styles.cardText}> Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/recipes')}>
          <Text style={styles.cardText}> Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/Ingredients')}>
          <Text style={styles.cardText}> Ingredients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/shoppinglist')}>
          <Text style={styles.cardText}> Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/wastetracker')}>
          <Text style={styles.cardText}> Waste</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/calorieTracker')}>
          <Text style={styles.cardText}> Calories</Text>
        </TouchableOpacity>
      </View>
            {/* leaderboard section */}
      <Text style={styles.subtitle}> Leaderboard</Text>
      <FlatList
  data={leaderboard}
  keyExtractor={(_, index) => index.toString()}
  renderItem={renderLeaderboardItem}
  nestedScrollEnabled={true} // 
  style={styles.leaderboardList}
/>

    </ScrollView>
  );
};
// stylesheet
const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFA726',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: '40%',
    margin: 10,
    paddingVertical: 30,
    backgroundColor: '#FFA726',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA726',
    marginTop: 30,
    marginBottom: 10,
  },
  leaderboardList: {
    width: '90%',
  },
  leaderboardItem: {
    padding: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    marginVertical: 4,
  },
  leaderboardText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
