export async function getWeather(city: string, days: number) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Use the client-side environment variable
  const baseUrl = `https://api.weatherapi.com/v1/forecast.json?q=${city}&days=${days}&lang=de&key=${apiKey}`;

  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
