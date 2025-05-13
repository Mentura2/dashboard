"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import WeatherWidget from "@/widgets/weather";
import { Layout } from "react-grid-layout";
import NotesWidget from "@/widgets/notes";
import TimerWidget from "@/widgets/timer";
import ToDoWidget from "@/widgets/todo";
import FinanceWidget from "@/widgets/finance";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const GridLayout = dynamic(() => import("react-grid-layout"), { ssr: false });

export default function Home() {
  const [widgetSizes, setWidgetSizes] = useState<{
    [key: string]: { width: number; height: number };
  }>({
    weather: { width: 300, height: 200 },
    finance: { width: 300, height: 200 },
    todo: { width: 300, height: 200 },
    timer: { width: 300, height: 200 },
    notes: { width: 300, height: 200 },
  });

  const [layout, setLayout] = useState<Layout[]>(() => {
    if (typeof window !== "undefined") {
      const savedLayout = localStorage.getItem("dashboardLayout");
      return savedLayout
        ? JSON.parse(savedLayout)
        : [
            { i: "weather", x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 3 },
            { i: "finance", x: 2, y: 0, w: 2, h: 6, minW: 2, minH: 6 },
            { i: "todo", x: 4, y: 0, w: 2, h: 8, minW: 2, minH: 3 },
            {
              i: "timer",
              x: 6,
              y: 0,
              w: 2,
              h: 4,
              minW: 1,
              maxW: 4,
              minH: 4,
              maxH: 10,
            },
            {
              i: "notes",
              x: 8,
              y: 0,
              w: 2,
              h: 4,
              minW: 2,
              maxW: 6,
              minH: 4,
              maxH: 10,
            },
          ];
    }
    return [];
  });

  const [gridWidth, setGridWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setGridWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleLayoutChange = (currentLayout: Layout[]) => {
    const cols = 12;
    const rowHeight = 30;

    const updatedSizes: { [key: string]: { width: number; height: number } } =
      {};
    currentLayout.forEach((item) => {
      updatedSizes[item.i] = {
        width: item.w * (gridWidth / cols),
        height: item.h * rowHeight,
      };
    });

    setWidgetSizes(updatedSizes);
    setLayout(currentLayout);

    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardLayout", JSON.stringify(currentLayout));
    }
  };

  const handleResizeStop = (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout
  ) => {
    if (newItem.i === "timer") {
      const updatedLayout = layout.map((item) => {
        if (item.i === "timer") {
          if (newItem.w > 3 || newItem.h > 5) {
            return { ...item, w: 4, h: 10 };
          } else {
            return { ...item, w: 2, h: 4 };
          }
        }
        return item;
      });

      setLayout(updatedLayout);

      setWidgetSizes((prev) => ({
        ...prev,
        timer: {
          width: updatedLayout.find((item) => item.i === "timer")!.w * 100,
          height: updatedLayout.find((item) => item.i === "timer")!.h * 30,
        },
      }));

      if (typeof window !== "undefined") {
        localStorage.setItem("dashboardLayout", JSON.stringify(updatedLayout));
      }
    }
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={gridWidth}
      onLayoutChange={handleLayoutChange}
      onResizeStop={handleResizeStop}
    >
      <div key="weather">
        <WeatherWidget
          width={widgetSizes.weather?.width || 300}
          height={widgetSizes.weather?.height || 200}
        />
      </div>
      <div key="finance">
        <FinanceWidget
          width={widgetSizes.finance?.width || 300}
          height={widgetSizes.finance?.height || 200}
          symbol="AAPL"
        />
      </div>
      <div key="todo">
        <ToDoWidget
          width={widgetSizes.todo?.width || 300}
          height={widgetSizes.todo?.height || 200}
        />
      </div>
      <div key="timer">
        <TimerWidget
          width={widgetSizes.timer?.width || 300}
          height={widgetSizes.timer?.height || 200}
        />
      </div>
      <div key="notes">
        <NotesWidget
          width={widgetSizes.notes?.width || 300}
          height={widgetSizes.notes?.height || 200}
        />
      </div>
    </GridLayout>
  );
}
