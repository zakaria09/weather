import React from 'react';
import {Icons} from '../types/forecast';
import {FaCloudRain, FaRegSnowflake, FaSmog, FaSun} from 'react-icons/fa';
import {IoCloudSharp, IoThunderstorm} from 'react-icons/io5';
import {BiSolidMessageAltError} from 'react-icons/bi';
import rainy from '../assets/icons/rainy-7.svg';
import drizzle from '../assets/icons/rainy-drizzle.svg';
import clouds from '../assets/icons/cloudy.svg';
import snow from '../assets/icons/snowy-6.svg';
import sun from '../assets/icons/sunny.svg';
import thunder from '../assets/icons/thunder.svg';

export default function WeatherIcon({weather}: {weather: Icons}) {
  if (weather === 'Rain') return <img src={rainy} />;
  else if (weather === 'Drizzle') return <img src={drizzle} />;
  else if (weather === 'Clouds') return <img src={clouds} />;
  else if (weather === 'Clear') return <img src={sun} />;
  else if (weather === 'Snow') return <img src={snow} />;
  else if (weather === 'Thunderstorm') return <img src={thunder} />;
  else if (weather === 'Atmosphere') return <FaSmog />;
  else return <BiSolidMessageAltError />;
}
