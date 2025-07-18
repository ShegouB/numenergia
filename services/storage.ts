// services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'simulations';

export const saveSimulation = async (simulation: {
  date: string;
  location: string;
  result: string;
}) => {
  const existing = await AsyncStorage.getItem(STORAGE_KEY);
  const simulations = existing ? JSON.parse(existing) : [];
  simulations.unshift(simulation);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
};

export const getSimulations = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
