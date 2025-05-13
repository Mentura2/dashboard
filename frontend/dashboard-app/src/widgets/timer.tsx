import React, { useState, useEffect } from "react";

interface TimerWidgetProps {
  width: number;
  height: number;
}

interface Countdown {
  id: number;
  targetDate: string;
  name: string;
}

const TimerWidget: React.FC<TimerWidgetProps> = ({ width, height }) => {
  const isSmall = width <= 300 || height <= 200;
  const [activeTab, setActiveTab] = useState<"countdown" | "stopwatch">(
    "countdown"
  );
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [currentCountdownIndex, setCurrentCountdownIndex] = useState<number>(0);
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);

  const [newCountdownName, setNewCountdownName] = useState<string>("");
  const [newCountdownDate, setNewCountdownDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [newCountdownTime, setNewCountdownTime] = useState<string>("00:00");

  // Lade gespeicherte Daten aus Local Storage
  useEffect(() => {
    const savedCountdowns = localStorage.getItem("countdowns");
    if (savedCountdowns) {
      setCountdowns(JSON.parse(savedCountdowns));
    }

    const savedStopwatchTime = localStorage.getItem("stopwatchTime");
    if (savedStopwatchTime) {
      setStopwatchTime(parseInt(savedStopwatchTime, 10));
    }
  }, []);

  // Speichere Countdowns in Local Storage
  const saveCountdowns = (newCountdowns: Countdown[]) => {
    localStorage.setItem("countdowns", JSON.stringify(newCountdowns));
    setCountdowns(newCountdowns);
  };

  // Speichere Stoppuhr-Zeit in Local Storage
  useEffect(() => {
    localStorage.setItem("stopwatchTime", stopwatchTime.toString());
  }, [stopwatchTime]);

  const handleAddCountdown = () => {
    const targetDate = `${newCountdownDate}T${newCountdownTime}:00`;
    if (!newCountdownName.trim() || new Date(targetDate) <= new Date()) return;

    const newCountdown: Countdown = {
      id: Date.now(),
      targetDate,
      name: newCountdownName.trim(),
    };

    saveCountdowns([...countdowns, newCountdown]);
    setNewCountdownName("");
    setNewCountdownDate(new Date().toISOString().slice(0, 10));
    setNewCountdownTime("00:00");
  };

  const handleDeleteCountdown = (id: number) => {
    const updatedCountdowns = countdowns.filter((cd) => cd.id !== id);
    saveCountdowns(updatedCountdowns);
    setCurrentCountdownIndex(0); // Zurück zum ersten Countdown
  };

  const toggleStopwatch = () => {
    setStopwatchRunning(!stopwatchRunning);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stopwatchRunning]);

  const currentCountdown = countdowns[currentCountdownIndex];
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    if (!currentCountdown) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(currentCountdown.targetDate);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime("00:00:00:00");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setRemainingTime(
          `${days.toString().padStart(2, "0")}d ${hours
            .toString()
            .padStart(2, "0")}h ${minutes
            .toString()
            .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCountdown]);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white rounded-lg">
      {/* Tabs */}
      <div className="flex justify-around mb-4">
        <button
          onClick={() => setActiveTab("countdown")}
          className={`px-4 py-2 rounded ${
            activeTab === "countdown" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
        >
          Countdown
        </button>
        <button
          onClick={() => setActiveTab("stopwatch")}
          className={`px-4 py-2 rounded ${
            activeTab === "stopwatch" ? "bg-blue-500" : "bg-gray-700"
          }`}
          onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
        >
          Stoppuhr
        </button>
      </div>

      {/* Countdown */}
      {activeTab === "countdown" && (
        <div className="flex flex-col items-center">
          {isSmall ? (
            // Kleines Widget: Nur Titel und Pfeile
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() =>
                  setCurrentCountdownIndex(
                    (prev) => (prev - 1 + countdowns.length) % countdowns.length
                  )
                }
                className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
              >
                ←
              </button>
              <div className="text-center">
                <h3 className="text-lg font-bold">
                  {currentCountdown ? currentCountdown.name : "Kein Countdown"}
                </h3>
                {currentCountdown && (
                  <p className="text-sm text-gray-400">{remainingTime}</p>
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentCountdownIndex(
                    (prev) => (prev + 1) % countdowns.length
                  )
                }
                className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
              >
                →
              </button>
            </div>
          ) : (
            // Großes Widget: Vollständiger Inhalt
            <>
              {currentCountdown ? (
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold">{currentCountdown.name}</h3>
                  <p className="text-2xl">{remainingTime}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() =>
                        setCurrentCountdownIndex(
                          (prev) =>
                            (prev - 1 + countdowns.length) % countdowns.length
                        )
                      }
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                      onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setCurrentCountdownIndex(
                          (prev) => (prev + 1) % countdowns.length
                        )
                      }
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                      onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                    >
                      →
                    </button>
                    <button
                      onClick={() => handleDeleteCountdown(currentCountdown.id)}
                      className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                      onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ) : (
                <p>Kein Countdown aktiv.</p>
              )}

              {/* Countdown hinzufügen */}
              <div className="mt-4 flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Name"
                  value={newCountdownName}
                  onChange={(e) => setNewCountdownName(e.target.value)}
                  className="w-3/4 p-2 bg-gray-700 text-white rounded mb-4 text-center"
                />
                <div className="flex w-3/4 justify-between mb-6">
                  <input
                    type="date"
                    value={newCountdownDate}
                    onChange={(e) => setNewCountdownDate(e.target.value)}
                    className="w-[48%] p-2 bg-gray-700 text-white rounded text-center"
                  />
                  <input
                    type="time"
                    value={newCountdownTime}
                    onChange={(e) => setNewCountdownTime(e.target.value)}
                    className="w-[48%] p-2 bg-gray-700 text-white rounded text-center"
                  />
                </div>
                <button
                  onClick={handleAddCountdown}
                  className="px-6 py-2 bg-green-500 rounded hover:bg-green-600 text-white"
                  onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                >
                  Hinzufügen
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Stoppuhr */}
      {activeTab === "stopwatch" && (
        <div className="flex flex-col items-center">
          <p className="text-2xl mb-4">
            {Math.floor(stopwatchTime / 3600)
              .toString()
              .padStart(2, "0")}
            :
            {Math.floor((stopwatchTime % 3600) / 60)
              .toString()
              .padStart(2, "0")}
            :{(stopwatchTime % 60).toString().padStart(2, "0")}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={toggleStopwatch}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
              onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
            >
              {stopwatchRunning ? "Stop" : "Start"}
            </button>
            <button
              onClick={resetStopwatch}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerWidget;
