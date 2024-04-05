/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from 'react';
import './App.css';
import {useQuery} from '@tanstack/react-query';
import {getCoordinates, getWeather} from './api/weather';
import {isSameDay, parseISO} from 'date-fns';
import {CityForecast, DisplayForecast} from './types/forecast';
import Weather from './components/weather';
import WeeklyForecast from './components/Forecast';
import CityForm from './components/CityForm';

function App() {
  const [city, setCity] = useState('');
  const [coord, setCoord] = useState({lat: 0, lon: 0, success: false});
  const [forecast, setForecast] = useState<CityForecast | undefined>();

  const [currentForecast, setCurrentForecast] = useState<
    DisplayForecast | undefined
  >();

  const {data} = useQuery({
    queryKey: ['coordinates', city],
    queryFn: () => getCoordinates(city),
    enabled: !!city,
  });

  useEffect(() => {
    if (data?.length) {
      const [result] = data;
      setCoord({lat: result.lat, lon: result.lon, success: true});
    }
  }, [data]);

  const {data: weather, status} = useQuery({
    queryKey: ['weather', coord.lat, coord.lon],
    queryFn: () => getWeather({lat: coord.lat, lon: coord.lon}),
    enabled: !!coord.success,
  });

  // so we don't see previous stale results
  useEffect(() => {
    if (status === 'success') setCoord((prev) => ({...prev, success: false}));
  }, [status]);

  // console.log(weather, weather?.city?.name);

  useEffect(() => {
    if (!weather) return;
    const days = weather.list.map((data) => ({
      dateTime: parseISO(data.dt_txt.replace(' ', 'T')),
      temp: Math.round(data.main.temp),
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      weather: {
        icon: data.weather[0].main,
        description: data.weather[0].description,
      },
    }));
    const forecast: any = {};
    days.reduce((prev, current) => {
      if (isSameDay(new Date(prev.dateTime), new Date(current.dateTime))) {
        const {dateTime}: {dateTime: Date} = current;
        const dateKey = new Date(
          dateTime.getFullYear(),
          dateTime.getMonth(),
          dateTime.getDate()
        ).toUTCString();
        forecast[dateKey] = forecast[dateKey]
          ? [...forecast[dateKey], current]
          : [current];
      }
      return current;
    });

    const cityForecast: CityForecast = {
      city: weather.city.name,
      country: weather.city.country,
      forecast: forecast,
    };

    setForecast(cityForecast);
  }, [weather]);

  return (
    <div>
      <div className='w-full max-w-lg'>
        <CityForm onCity={setCity} />
      </div>
      <div className='my-10'>
        <div className='w-full flex flex-col md:flex-row'>
          <div className='basis-3/12'>
            {forecast && (
              <Weather forecast={setCurrentForecast} weather={forecast} />
            )}
          </div>
          <div className='basis-9/12 px-6'>
            {currentForecast && <WeeklyForecast forecast={currentForecast} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
