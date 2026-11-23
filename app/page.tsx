"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Link from "next/link";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [showOnlyCompleted, setShowOnlyCompleted] = useState<boolean>(false);

  // Load todos from database through API
  useEffect(() => {
      const fetchTodos = async () => {
          try {
              const response = await fetch("/api/todos");
              if (!response.ok) throw new Error("Failed to fetch todos");
              const data = await response.json();
              setTodos(data);
          } catch (error) {
              console.error("Failed to load todos:", error);
          }
      };
      fetchTodos();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
        const response = await fetch("/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTodo.trim() }),
        });
        if (!response.ok) throw new Error("Failed to add todo");
        const todo = await response.json();
        setTodos((prev) => [...prev, todo]);
        setNewTodo("");
    } catch (error) {
        console.error("Failed to add todo:", error);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setNewTodo(e.target.value);
  };
  const toggleComplete = async (id: number): Promise<void> => {
      const todo = todos.find((item) => item.id === id);
      if (!todo) return;
      try {
          const response = await fetch(`/api/todos/${id}`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ completed: !todo.completed }),
          });
          if (!response.ok) throw new Error("Failed to update todo");
          const updatedTodo = await response.json();
          setTodos((prev) =>
              prev.map((item) =>
                  item.id === id ? updatedTodo : item
              )
          );
      } catch (error) {
          console.error("Failed to update todo:", error);
      }
  };
  const deleteTodo = async (id: number): Promise<void> => {
      try {
          const response = await fetch(`/api/todos/${id}`, {
              method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to delete todo");
          setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } catch (error) {
          console.error("Failed to delete todo:", error);
      }
  };
  const clearAllCompleted = async (): Promise<void> => {
      const completedTodos = todos.filter((todo) => todo.completed);
      try {
          await Promise.all(
              completedTodos.map((todo) =>
                  fetch(`/api/todos/${todo.id}`, {
                      method: "DELETE",
                  }).then((response) => {
                      if (!response.ok) throw new Error("Failed to delete todo");
                  })
              )
          );
          setTodos((prev) => prev.filter((todo) => !todo.completed));
      } catch (error) {
          console.error("Failed to clear completed todos:", error);
      }
  };
  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.filter((todo) => !showOnlyCompleted || todo.completed)
        .map((todo) => (
        <li
            key={todo.id}
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                backgroundColor: todo.completed ? "#e0ffe0" : "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}/>
            <Link
                href={`/todos/${todo.id}`}
                style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    color: "black",
                }}>
                {todo.title}
            </Link>
        </div>
        <button
            onClick={() => deleteTodo(todo.id)}
            style={{
                background: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
                fontSize: "1rem",
            }}>
            X
        </button>
      </li>
      ))}
      </ul>
      {todos.length === 0 && <p>No tasks yet. Add one!</p>}
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <input
              type="text"
              placeholder="Enter new task..."
              value={newTodo}
              onChange={handleChange}
              style={{ padding: "0.5rem", width: "70%", marginRight: "0.5rem" }}/>
          <button
              type="submit"
              style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
              }}>
              Add
          </button>
      </form>
      {todos.some((todo) => todo.completed) && (
          <button
              onClick={clearAllCompleted}
              style={{
                  padding: "0.4rem 0.8rem",
                  marginBottom: "1rem",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
              }}>
              Clear All Completed
          </button>
      )}
      {todos.length > 0 && (
          <button
              onClick={() => setShowOnlyCompleted((prev) => !prev)}
              style={{
                  padding: "0.4rem 0.8rem",
                  marginBottom: "1rem",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
              }}>
              {showOnlyCompleted ? "Show All" : "Show Only Completed"}
          </button>
      )}
    </main>
  );
}