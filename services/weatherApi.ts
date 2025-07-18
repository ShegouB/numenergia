// services/weatherApi.ts
import { OPEN_WEATHER_API_KEY } from '@env';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherByCoords = async (lat: number, lon: number) => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=fr`
  );
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données météo');
  }

  const data = await response.json();
  return {
    city: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    condition: data.weather[0].description,
    icon: data.weather[0].icon,
  };
};
