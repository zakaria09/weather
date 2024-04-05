import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

export const getCoordinates = async (cityName: string) => {
  const response = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${API_KEY}`
  );
  return response?.data;
};

export const getWeather = async (coord: {lon: number; lat: number}) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${API_KEY}`
  );
  return response?.data;
};
