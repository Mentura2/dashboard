import React, { useState, useEffect } from "react";

interface ToDoWidgetProps {
  width: number;
  height: number;
}

interface ToDoItem {
  id: number;
  text: string;
  completed: boolean;
}

const ToDoWidget: React.FC<ToDoWidgetProps> = ({ width, height }) => {
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  // Lade gespeicherte ToDos aus Local Storage
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Speichere ToDos in Local Storage
  const saveTodos = (newTodos: ToDoItem[]) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const handleAddToDo = () => {
    if (inputValue.trim() === "") return;

    const newTodo: ToDoItem = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    saveTodos([...todos, newTodo]);
    setInputValue("");
  };

  // Handle ToDo erledigt markieren
  const handleToggleComplete = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const handleDeleteToDo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    saveTodos(updatedTodos);
  };

  // Bestimme, ob das Widget "klein" ist
  const isSmall = width <= 300 || height <= 200;

  // Sortiere ToDos in offene und erledigte
  const openTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="flex flex-col justify-between items-center h-full p-4 bg-gray-800 text-white rounded-lg">
      {isSmall ? (
        // Kleines Widget: Nur Eingabefeld und "+" Button
        <div className="w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a ToDo"
            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
          />
          <button
            onClick={handleAddToDo}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
          >
            +
          </button>
        </div>
      ) : (
        // Großes Widget: Liste der ToDos anzeigen
        <div className="w-full h-full flex flex-col">
          {/* Eingabefeld */}
          <div className="mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a ToDo"
              className="w-full p-2 bg-gray-700 text-white rounded mb-2"
            />
            <button
              onClick={handleAddToDo}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
            >
              Add
            </button>
          </div>

          {/* ToDo-Liste */}
          <div className="flex-1 overflow-y-auto">
            {/* Offene ToDos */}
            {openTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2 mb-2 bg-gray-700 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="mr-2"
                    onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                  />
                  <span>{todo.text}</span>
                </div>
                <button
                  onClick={() => handleDeleteToDo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                  onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                >
                  ✕
                </button>
              </div>
            ))}

            {completedTodos.length > 0 && (
              <hr className="my-4 border-gray-600" />
            )}

            {/* Erledigte ToDos */}
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2 mb-2 bg-gray-700 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="mr-2"
                    onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                  />
                  <span className="line-through text-gray-400">
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteToDo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                  onMouseDown={(e) => e.stopPropagation()} // Dragging verhindern
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoWidget;
