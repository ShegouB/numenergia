// app/weather.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Alert, Button, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { getWeatherByCoords } from '@/services/weatherApi';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<null | {
    city: string;
    temperature: number;
    humidity: number;
    condition: string;
    icon: string;
  }>(null);
  const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La géolocalisation est nécessaire pour afficher la météo.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      const data = await getWeatherByCoords(loc.coords.latitude, loc.coords.longitude);
      setWeather(data);
    } catch (e) {
      console.error('Erreur chargement météo:', e);
      Alert.alert('Erreur', 'Erreur lors de la récupération des données météo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007aff" />;

  return (
    <View style={styles.container}>
      <Button title="Actualiser" onPress={fetchWeather} />

      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker coordinate={location} title={weather?.city} />
        </MapView>
      )}

      <View style={styles.weatherBox}>
        <Text style={styles.city}>{weather?.city}</Text>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${weather?.icon}@4x.png` }}
          style={{ width: 100, height: 100 }}
        />
        <Text style={styles.temp}>{weather?.temperature}°C</Text>
        <Text>Humidité : {weather?.humidity}%</Text>
        <Text>Condition : {weather?.condition}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: '#f2f2f2' },
  map: {
    width: Dimensions.get('window').width,
    height: 250,
    marginVertical: 10,
  },
  weatherBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  city: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  temp: { fontSize: 48, marginVertical: 10 },
});
