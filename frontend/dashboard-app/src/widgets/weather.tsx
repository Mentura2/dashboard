import React, { useEffect, useState } from "react";
import { getWeather } from "@/services/weather";

// Example component
const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeather("Chemnitz", 1);
        setWeatherData(data);
      } catch (error) {
        console.error(error);
      } finally {
      }
      setLoading(false);
    };

    fetchWeather();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weatherData) {
    return <div>Error fetching weather data</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      <h2>{weatherData.location.name}</h2>
      <p>{weatherData.current.condition.text}</p>
      <img src={weatherData.current.condition.icon} alt="Weather icon" />
      <p>{weatherData.current.temp_c}°C</p>
    </div>
  );
};

export default WeatherWidget;
