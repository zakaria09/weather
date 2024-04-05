import React from 'react';
import {DisplayForecast, Forecast} from '../types/forecast';
import {format} from 'date-fns';
import WeatherIcon from './WeatherIcon';

type Props = {
  forecast: DisplayForecast;
};

export default function WeeklyForecast({forecast}: Props) {
  return (
    <div>
      <div className='flex flex-col items-start'>
        <h1 className='text-2xl font-bold'>{forecast.city}</h1>
        <span className='text-md font-semibold text-gray-600'>
          {format(new Date(forecast.date), 'EEEE')}
        </span>
      </div>
      {forecast.forecast.map((weather, i) => (
        <div key={i}>
          <div>
            <p className='text-sm'>{format(weather.dateTime, 'p')}</p>
          </div>
          <div className='flex justify-between content-center px-6 py-4 border-solid border-2 border-slate-200 rounded my-2'>
            <div className='flex self-center'>
              <p className='text-lg font-semibold'>{weather.temp}&deg;</p>
            </div>
            <WeatherIcon weather={weather.weather.icon} />
          </div>
        </div>
      ))}
    </div>
  );
}
