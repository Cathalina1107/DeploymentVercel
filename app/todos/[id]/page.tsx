"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export default function TodoDetail() {
    const { id } = useParams<{ id: string }>();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Load Todo detail
    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const response = await fetch("/api/todos");
                if (!response.ok) throw new Error("Failed to fetch todos");
                const todos: Todo[] = await response.json();
                const foundTodo = todos.find((item) => item.id === Number(id));
                setTodo(foundTodo || null);
                if (foundTodo) {
                    setEditedTitle(foundTodo.title);
                }
            } catch (error) {
                console.error("Failed to load todo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodo();
    }, [id]);

    // Update Todo title
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editedTitle.trim()) return;
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editedTitle.trim(),
                }),
            });
            if (!response.ok) throw new Error("Failed to update todo");
            const updatedTodo = await response.json();
            setTodo(updatedTodo);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };
    if (loading) {
        return <main style={{ padding: "2rem" }}>Loading...</main>;
    }
    if (!todo) {
        return (
            <main style={{ padding: "2rem" }}>
                <h1>Task not found</h1>
                <Link href="/">Back to To-Do List</Link>
            </main>
        );
    }
    return (
        <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Task Detail</h1>
            <p>Task ID: {todo.id}</p>
            <p>
                Status: {todo.completed ? "Completed" : "Not Completed"}
            </p>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        style={{ padding: "0.5rem", marginRight: "0.5rem" }}/>
                    <button type="submit">Save</button>
                    <button
                        type="button"
                        onClick={() => {
                            setEditedTitle(todo.title);
                            setIsEditing(false);
                        }}>
                        Cancel
                    </button>
                </form>
            ) : (
                <>
                    <p>Task: {todo.title}</p>

                    <button onClick={() => setIsEditing(true)}>
                        Edit Task
                    </button>
                </>
            )}
            <p style={{ marginTop: "1rem" }}>
                <Link href="/">Back to To-Do List</Link>
            </p>
        </main>
    );
}