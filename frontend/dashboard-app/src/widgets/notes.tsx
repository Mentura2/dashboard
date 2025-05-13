import React, { useState, useEffect } from "react";

const NotesWidget = ({ width, height }: { width: number; height: number }) => {
  const [note, setNote] = useState<string>("");
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedNote = localStorage.getItem("note");
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const saveNote = (updatedNote: string) => {
    localStorage.setItem("note", updatedNote);
  };

  // Handle Textänderung mit Auto-Speichern
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNote = e.target.value;
    setNote(updatedNote);

    // Lösche vorherigen Timeout, falls vorhanden
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      saveNote(updatedNote);
    }, 1000); // Speichere nach 1 Sekunde Inaktivität
    setSaveTimeout(timeout);
  };

  return (
    <div
      className="flex flex-col bg-gray-800 text-white rounded-lg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        padding: "0px",
        boxSizing: "border-box",
      }}
    >
      <h2
        className="text-lg font-bold"
        style={{
          margin: "8px",
        }}
      >
        Notizen
      </h2>
      <textarea
        value={note}
        onChange={handleNoteChange}
        placeholder="Schreibe hier deine Notizen..."
        className="bg-gray-700 text-white rounded resize-none focus:outline-none"
        style={{
          height: `calc(100% - 40px)`,
          width: "calc(100% - 16px)",
          margin: "8px",
          padding: "8px",
          boxSizing: "border-box",
        }}
        onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
      />
    </div>
  );
};

export default NotesWidget;
