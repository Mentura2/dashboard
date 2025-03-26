"use client";

import React from "react";
import dynamic from "next/dynamic";
import WeatherWidget from "@/widgets/weather";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Dynamically import GridLayout with SSR disabled
const GridLayout = dynamic(() => import("react-grid-layout"), { ssr: false });

export default function Home() {
  // Define the layout for the grid
  const layout = [
    { i: "a", x: 0, y: 0, w: 2, h: 2 },
    { i: "b", x: 2, y: 0, w: 2, h: 2 },
    { i: "c", x: 4, y: 0, w: 2, h: 2 },
  ];

  return (
    <div style={{ padding: "20px", height: "100vh" }}>
      <div style={{ width: "90%", height: "90%", margin: "0 auto" }}>
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1600}
        >
          <div
            key="a"
            style={{ textAlign: "center", backgroundColor: "#4570b5" }}
          >
            <WeatherWidget />
          </div>
          <div
            key="b"
            style={{ textAlign: "center", backgroundColor: "#ad1a6e" }}
          >
            B
          </div>
          <div key="c" style={{ background: "grey", textAlign: "center" }}>
            C
          </div>
        </GridLayout>
      </div>
    </div>
  );
}
