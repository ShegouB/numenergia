// app/simulate.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { getWeatherByCoords } from '@/services/weatherApi';
import { saveSimulation } from '@/services/storage';

export default function SimulateScreen() {
  const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [weather, setWeather] = useState<any>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAndSimulate = useCallback(async () => {
    setLoading(true);
    setResult(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Autorisez la géolocalisation pour simuler.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

      const weatherData = await getWeatherByCoords(loc.coords.latitude, loc.coords.longitude);
      setWeather(weatherData);

      // Simulation simple
      const solarIrradiance = estimateSolarIrradiance(weatherData.condition); // condition météo
      const estimatedPower = Math.round(solarIrradiance * 5 * 0.75); // estimation naïve
      const simulationText = `Conditions : ${weatherData.condition}
Température : ${weatherData.temperature}°C
Ensoleillement estimé : ${solarIrradiance} kWh/m²/j
Production estimée : ${estimatedPower} kWh/jour`;

      setResult(simulationText);

      await saveSimulation({
        date: new Date().toISOString(),
        location: weatherData.city,
        result: simulationText,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de récupérer les données pour la simulation.');
    } finally {
      setLoading(false);
    }
  }, []);

  const estimateSolarIrradiance = (condition: string) => {
    if (condition.includes('pluie')) return 2;
    if (condition.includes('nuage')) return 3;
    return 5; // ciel clair
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simulation Énergétique</Text>

      <Button title="Lancer la simulation" onPress={fetchAndSimulate} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007aff" />}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});
