export async function getStockData(symbol: string) {
  const apiKey = "d0flk01r01qr6dbsrhi0d0flk01r01qr6dbsrhig"; // API-Key aus Umgebungsvariablen
  const baseUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}
