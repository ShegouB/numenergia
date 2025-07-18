// app/(tabs)/simulate.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { getWeatherByCoords } from '@/services/weatherApi';
import { saveSimulation } from '@/services/storage';

export default function SimulateScreen() {
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
      const weatherData = await getWeatherByCoords(loc.coords.latitude, loc.coords.longitude);

      const irradiance = estimateSolarIrradiance(weatherData.condition);
      const estimatedPower = Math.round(irradiance * 5 * 0.75);
      const resultText = `📍 ${weatherData.city}\n🌤 ${weatherData.condition}\n🌡 Temp : ${weatherData.temperature}°C\n🔆 Ensoleillement : ${irradiance} kWh/m²/j\n⚡ Production estimée : ${estimatedPower} kWh/j`;

      setResult(resultText);

      await saveSimulation({
        date: new Date().toISOString(),
        location: weatherData.city,
        result: resultText,
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Simulation impossible pour le moment.');
    } finally {
      setLoading(false);
    }
  }, []);

  const estimateSolarIrradiance = (condition: string) => {
    if (condition.toLowerCase().includes('pluie')) return 2;
    if (condition.toLowerCase().includes('nuage')) return 3;
    return 5;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔍 Simulation Énergétique</Text>
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
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  resultBox: { marginTop: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  resultText: { fontSize: 16, color: '#333' },
});
