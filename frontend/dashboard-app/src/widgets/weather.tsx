import React, { useEffect, useState } from "react";
import { getWeather } from "@/services/weather";
import { XMarkIcon } from "@heroicons/react/24/solid";

const WeatherWidget = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const [city, setCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedCity = localStorage.getItem("weatherCity");
    if (savedCity) {
      setCity(savedCity);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWeather(city, 1);
        setWeatherData(data);
      } catch (error) {
        console.error(error);
        setError("Die eingegebene Stadt konnte nicht gefunden werden.");
        setCity(null);
        localStorage.removeItem("weatherCity");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleCitySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputCity = (e.target as HTMLFormElement).city.value.trim();
    if (inputCity) {
      localStorage.setItem("weatherCity", inputCity);
      setCity(inputCity);
    }
  };

  const handleCityRemove = () => {
    localStorage.removeItem("weatherCity");
    setCity(null);
    setWeatherData(null);
    setError(null);
  };

  const getBackgroundClass = () => {
    if (
      !weatherData ||
      !weatherData.current ||
      !weatherData.current.condition
    ) {
      return "bg-gradient-to-br from-blue-500 to-blue-300";
    }

    const condition = weatherData.current.condition.text.toLowerCase();
    if (condition.includes("storm") || condition.includes("rain")) {
      return "bg-gradient-to-br from-gray-600 to-gray-400";
    } else if (condition.includes("cloud")) {
      return "bg-gradient-to-br from-gray-400 to-gray-200";
    } else {
      return "bg-gradient-to-br from-blue-500 to-blue-300";
    }
  };

  if (!city) {
    return (
      <div
        className={`flex flex-col justify-center items-center w-full h-full p-4 box-border ${getBackgroundClass()}`}
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          Bitte geben Sie eine Stadt ein:
        </h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={handleCitySubmit}
          className="flex flex-col items-center"
        >
          <input
            type="text"
            name="city"
            placeholder="Stadt eingeben"
            className="p-2 text-base mb-4 w-full max-w-xs border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Speichern
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center w-full h-full ${getBackgroundClass()}`}
      >
        Loading...
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div
        className={`flex justify-center items-center w-full h-full ${getBackgroundClass()}`}
      >
        Error fetching weather data
      </div>
    );
  }

  const isSmall = width <= 300 && height <= 200;

  return (
    <div
      className={`flex flex-col justify-between items-center w-full h-full p-4 box-border overflow-hidden ${getBackgroundClass()}`}
    >
      {isSmall ? (
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">
            {weatherData.location.name}
          </h2>
          <p className="text-2xl font-semibold text-white">
            {weatherData.current.temp_c}°C
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="Location Pin">
                📍
              </span>
              <span className="text-lg font-bold text-white">
                {weatherData.location.name}
              </span>
              <button
                onClick={handleCityRemove}
                className="ml-2 flex items-center justify-center"
                title="Stadt entfernen"
              >
                <XMarkIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>

            {weatherData?.current?.condition?.text && (
              <div className="flex items-center gap-2">
                <img
                  src={weatherData.current.condition.icon}
                  alt="Condition Icon"
                  className="w-8 h-8"
                />
                <span className="text-sm text-white">
                  {weatherData.current.condition.text}
                </span>
              </div>
            )}
          </div>

          <div className="text-2xl font-bold text-center my-4 text-white">
            {weatherData.current.temp_c}°C
          </div>

          <div className="text-sm text-center text-gray-200">
            Min: {weatherData.forecast.forecastday[0].day.mintemp_c}°C / Max:{" "}
            {weatherData.forecast.forecastday[0].day.maxtemp_c}°C
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
