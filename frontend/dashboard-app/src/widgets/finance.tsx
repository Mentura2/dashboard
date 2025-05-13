import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStockData } from "@/services/finance";

interface StockData {
  c: number; // Aktueller Preis
  dp: number; // Preisänderung in Prozent
}

interface FinanceWidgetProps {
  width: number;
  height: number;
  symbol: string;
}

const FinanceWidget: React.FC<FinanceWidgetProps> = ({ width, height }) => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [preloadedData, setPreloadedData] = useState<{
    [key: string]: StockData | null;
  }>({});
  const [inputValue, setInputValue] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const savedSymbols = localStorage.getItem("financeSymbols");
    if (savedSymbols) {
      const symbolsArray = savedSymbols.split(",");
      setSymbols(symbolsArray);
      preloadStockData(symbolsArray);
    } else {
      setShowInput(true);
    }
  }, []);

  const preloadStockData = async (symbols: string[]) => {
    const data: { [key: string]: StockData | null } = {};

    for (const symbol of symbols) {
      try {
        const stockData = await getStockData(symbol);
        data[symbol] = stockData;
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        data[symbol] = null;
      }
    }

    setPreloadedData(data);
  };

  const saveSymbols = (newSymbols: string[]) => {
    localStorage.setItem("financeSymbols", newSymbols.join(","));
    setSymbols(newSymbols);
    preloadStockData(newSymbols);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSymbols = inputValue.split(",").map((s) => s.trim().toUpperCase());
    saveSymbols(newSymbols);
    setInputValue("");
    setCurrentIndex(0);
    setShowInput(false);
  };

  const handleNext = () => {
    if (symbols.length > 0) {
      setDirection("right");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % symbols.length);
    }
  };

  const handlePrevious = () => {
    if (symbols.length > 0) {
      setDirection("left");
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? symbols.length - 1 : prevIndex - 1
      );
    }
  };

  const currentSymbol = symbols[currentIndex];
  const stockData = preloadedData[currentSymbol];

  const isSmall = width <= 300 || height <= 200;

  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col justify-between items-center h-full p-4 bg-gray-800 text-white rounded-lg">
      {showInput || symbols.length === 0 ? (
        <form onSubmit={handleInputSubmit} className="w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter stocks (e.g., AAPL, TSLA)"
            className="w-full p-2 text-black rounded text-white"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Save
          </button>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-center w-full mb-4">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              ←
            </button>
            <h2 className="text-lg font-bold">{currentSymbol}</h2>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              →
            </button>
          </div>

          <div className="relative w-full h-32 flex items-center justify-center overflow-hidden">
            <AnimatePresence custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="absolute w-full h-full flex items-center justify-center"
              >
                {stockData ? (
                  isSmall ? (
                    <div className="text-center">
                      <p className="text-2xl font-semibold">
                        ${stockData.c.toFixed(2)}
                      </p>
                      <p
                        className={`text-lg font-medium ${
                          stockData.dp >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stockData.dp >= 0 ? "+" : ""}
                        {stockData.dp.toFixed(2)}%
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Current Price</p>
                          <p className="text-lg font-semibold">
                            ${stockData.c.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            Price Change (%)
                          </p>
                          <p
                            className={`text-lg font-medium ${
                              stockData.dp >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {stockData.dp >= 0 ? "+" : ""}
                            {stockData.dp.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center text-red-500">
                    Failed to load data.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceWidget;
