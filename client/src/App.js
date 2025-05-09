import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch items");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch(`${API_URL}/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputValue }),
        });
        const newTodo = await response.json();
        setTodos([newTodo, ...todos]);
        setInputValue("");
        toast.success("Item added successfully!");
      } catch (error) {
        console.error("Error creating todo:", error);
        toast.error("Failed to add item");
      }
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
      });
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      toast.success("Item status updated!");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update item status");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete item");
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditValue(todo.text);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (editValue.trim() !== "") {
      try {
        const response = await fetch(`${API_URL}/todos/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editValue }),
        });
        const updatedTodo = await response.json();
        setTodos(
          todos.map((todo) => (todo._id === editingId ? updatedTodo : todo))
        );
        setEditingId(null);
        setEditValue("");
        toast.success("Item updated successfully!");
      } catch (error) {
        console.error("Error updating todo:", error);
        toast.error("Failed to update item");
      }
    }
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id)}
            />
            {editingId === todo._id ? (
              <form
                onSubmit={handleEdit}
                style={{ display: "inline", flex: 1 }}
              >
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleEdit}
                  autoFocus
                  style={{ width: "100%" }}
                />
              </form>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    flex: 1,
                  }}
                >
                  {todo.text}
                </span>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => startEditing(todo)}>Edit</button>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
