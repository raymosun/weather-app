import { useEffect, useState } from 'react'
import './App.css'
import Searchbar from './components/Searchbar';
import axios from 'axios';

interface Coords {
  lat: number;
  lon: number;
}

interface Weather {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  }
  weather: {
    description: string;
    icon: string;
  }[]
}

const PM_ACCELERATOR = `
The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations.

Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavours.`

function App() {
  const [query, setQuery] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<Weather | null>(null);

  // Update city search results
  useEffect(() => {
    if (!query) return;
    axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
    .then((response) => {
      setCityResults(response.data);
    });
  }, [query]);

  // Update weather data
  useEffect(() => {
    if (!coords) return;
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=imperial`)
    .then((response) => {
      setWeather(response.data);
    });
  }, [coords])

  const showInfo = () => {
    alert('This app was created as part of a technical assessment for PM Accelerator.\n' + PM_ACCELERATOR);
  }

  return (
    <>
      <h1>Weather App</h1>
      <h6>Enter a city</h6>
      <Searchbar setQuery={setQuery} />
      <div className="results">
        {cityResults.map(({name, state, country, lat, lon}) => {
          const cityName = [name, state, country].filter(Boolean).join(', ');
          return (
            <div key={[lat, lon].join()} onClick={() => {
              setCoords({lat, lon});
              setCity(cityName);
              setCityResults([])
            }
            }>{cityName}</div>
          )
        })}
      </div>
      {city && (
        <div className="horizontal">
        <h1>{city}</h1> <h4>({coords?.lat}, {coords?.lon})</h4>
      </div>
      )}
      {weather && (
        <div className="weather">
          <div className="horizontal">
            <div className="temp">
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} />
              <h1>{weather.main.temp}°F</h1>
            </div>
            <h2>{weather.weather[0].description}</h2>
          </div>
          <div className="details">
            <h3>Feels like</h3>
            <h3>{weather.main.feels_like}°F</h3>
            <h3>High</h3>
            <h3>{weather.main.temp_max}°F</h3>
            <h3>Low</h3>
            <h3>{weather.main.temp_min}°F</h3>
            <h3>Humidity</h3>
            <h3>{weather.main.humidity}</h3>
          </div>
        </div>
      )}
      <footer>
        <p>Created by Raymond Sun</p>
        <p className="info" onClick={showInfo}>See info</p>
      </footer>
    </>
  )
}

export default App;
