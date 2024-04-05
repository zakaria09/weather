/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect, useState} from 'react';
import './App.css';
import {useQuery} from '@tanstack/react-query';
import {getCoordinates, getWeather} from './api/weather';
import {useFormik} from 'formik';
import {isSameDay, parseISO} from 'date-fns';
import {CityForecast, DisplayForecast} from './types/forecast';
import Weather from './components/weather';
import WeeklyForecast from './components/Forecast';

function App() {
  const [city, setCity] = useState('');
  const [coord, setCoord] = useState({lat: 0, lon: 0, success: false});
  const [forecast, setForecast] = useState<CityForecast | undefined>();

  const [currentForecast, setCurrentForecast] = useState<
    DisplayForecast | undefined
  >();

  const formik = useFormik({
    initialValues: {city: ''},
    onSubmit: (values) => {
      const {city} = values;
      setCity(city);
    },
  });

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

  console.log(weather, weather?.city?.name);

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
      console.log(
        new Date(prev.dateTime),
        new Date(current.dateTime),
        isSameDay(new Date(prev.dateTime), new Date(current.dateTime))
      );
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

    console.log(forecast);
    setForecast(cityForecast);
  }, [weather]);

  console.log(currentForecast);

  return (
    <div>
      <div className='w-full max-w-lg'>
        <form className='shadow-md rounded p-6' onSubmit={formik.handleSubmit}>
          <label
            className='block text-slate-700 text-sm font-bold text-left pb-2'
            htmlFor='city'
          >
            City name:
          </label>
          <input
            className='shadow appearance-none border roun w-full py-2 px-3 leading-tight '
            id='city'
            name='city'
            onChange={formik.handleChange}
            value={formik.values.city}
            placeholder='London...'
          />
          <div className='flex items-center justify-between'>
            <button
              className='bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 my-4 rounded'
              type='submit'
            >
              Get Weather
            </button>
          </div>
        </form>
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
