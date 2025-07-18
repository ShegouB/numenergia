// app/simulate.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { getWeatherByCoords } from '@/services/weatherApi';
import { saveSimulation } from '@/services/storage';

export default function SimulateScreen() {
  const [surface, setSurface] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [sunHours, setSunHours] = useState('');
  const [locationName, setLocationName] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [result, setResult] = useState<
    null | {
      daily: number;
      monthly: number;
      date: string;
      sunHours: number;
      weather: string;
    }
  >(null);
  const [loading, setLoading] = useState(false);

  const fetchLocationAndWeather = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La localisation est nécessaire pour estimer l’ensoleillement.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      const weather = await getWeatherByCoords(lat, lon);

      const condition = weather.condition.toLowerCase();
      let estimatedSunHours = 5; // par défaut

      if (condition.includes('clair') || condition.includes('clear')) estimatedSunHours = 7;
      else if (condition.includes('nuage') || condition.includes('cloud')) estimatedSunHours = 4;
      else if (condition.includes('pluie') || condition.includes('rain')) estimatedSunHours = 2;

      setSunHours(String(estimatedSunHours));
      setLocationName(weather.city);
      setWeatherCondition(weather.condition);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d’obtenir les données météo.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  const calculateProduction = async () => {
    const s = parseFloat(surface);
    const e = parseFloat(efficiency) / 100;
    const h = parseFloat(sunHours);

    if (isNaN(s) || isNaN(e) || isNaN(h) || s <= 0 || e <= 0 || h <= 0) {
      Alert.alert('Erreur', 'Veuillez remplir correctement tous les champs numériques.');
      return;
    }

    const daily = s * e * h;
    const monthly = daily * 30;
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    setResult({
      daily,
      monthly,
      date: currentDate,
      sunHours: h,
      weather: weatherCondition,
    });

    await saveSimulation({
      date: new Date().toISOString(),
      location: locationName || 'Inconnue',
      result: `Date: ${currentDate}\nMétéo: ${weatherCondition}\nHeures d’ensoleillement estimées: ${h}\nProduction estimée: ${daily.toFixed(
        2
      )} kWh/jour, ${monthly.toFixed(2)} kWh/mois`,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simulation Solaire Avancée</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Surface des panneaux (m²)"
            keyboardType="numeric"
            value={surface}
            onChangeText={setSurface}
          />
          <TextInput
            style={styles.input}
            placeholder="Rendement des panneaux (%)"
            keyboardType="numeric"
            value={efficiency}
            onChangeText={setEfficiency}
          />
          <TextInput
            style={styles.input}
            placeholder="Heures d’ensoleillement/jour"
            keyboardType="numeric"
            value={sunHours}
            onChangeText={setSunHours}
          />
          <Button title="Simuler" onPress={calculateProduction} color="#28a745" />
        </>
      )}

      {result && (
        <View style={styles.resultBox}>
          <View style={styles.resultRow}>
            <Feather name="calendar" size={24} color="#3498db" />
            <Text style={styles.resultText}> {result.date}</Text>
          </View>

          <View style={styles.resultRow}>
            <Feather name="cloud" size={24} color="#95a5a6" />
            <Text style={styles.resultText}> {result.weather}</Text>
          </View>

          <View style={styles.resultRow}>
            <Feather name="sun" size={24} color="#f39c12" />
            <Text style={styles.resultText}> {result.sunHours} h d’ensoleillement estimées</Text>
          </View>

          <View style={styles.resultRow}>
            <Feather name="zap" size={24} color="#27ae60" />
            <Text style={styles.resultText}> {result.daily.toFixed(2)} kWh/jour</Text>
          </View>

          <View style={styles.resultRow}>
            <Feather name="bar-chart-2" size={24} color="#2980b9" />
            <Text style={styles.resultText}> {result.monthly.toFixed(2)} kWh/mois</Text>
          </View>

          <View style={styles.resultRow}>
            <Feather name="map-pin" size={24} color="#c0392b" />
            <Text style={styles.resultText}> Localisation : {locationName}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, flexGrow: 1, backgroundColor: '#f4f6f8' },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 30 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  resultBox: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderColor: '#28a745',
    borderWidth: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
  },
});
