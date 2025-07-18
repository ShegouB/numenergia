// app/weather.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeatherByCity } from '../services/weatherApi';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<null | {
    city: string;
    temperature: number;
    humidity: number;
    condition: string;
    icon: string;
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission refusée', 'La géolocalisation est nécessaire pour afficher la météo.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const data = await getWeatherByCoords(location.coords.latitude, location.coords.longitude);
        setWeather(data);
      } catch (e) {
        console.error('Erreur chargement météo:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007aff" />;

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather?.city}</Text>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${weather?.icon}@4x.png` }}
        style={{ width: 100, height: 100 }}
      />
      <Text style={styles.temp}>{weather?.temperature}°C</Text>
      <Text>Humidité : {weather?.humidity}%</Text>
      <Text>Condition : {weather?.condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  city: { fontSize: 28, fontWeight: 'bold' },
  temp: { fontSize: 48, marginVertical: 10 },
});
