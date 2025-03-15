import React, { useState } from "react";
import {
  useFetchData,
  usePostData,
  usePutData,
  useUpdateData,
  useDeleteData,
} from "../utils/api";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface NewTodo {
  title: string;
  completed: boolean;
}

interface TodoUpdatePayload {
  id: number;
  title?: string;
  completed?: boolean;
}

const ExampleApiComponent: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [updateTodoTitle, setUpdateTodoTitle] = useState("");

  // Fetch todos example
  const {
    data: todos,
    isLoading,
    isError,
    error,
  }: UseQueryResult<Todo[], Error> = useFetchData("/todos", {
    queryKey: ["todos"],
    refetchOnWindowFocus: true,
    staleTime: 60000, // 1 minute
  });

  // Create todo example
  const createTodoMutation: UseMutationResult<any, Error, NewTodo> =
    usePostData("/todos", {
      invalidateQueries: [["todos"]],
      onSuccess: () => {
        setNewTodoTitle("");
      },
    });

  // Update todo example (PUT)
  const updateTodoMutation: UseMutationResult<any, Error, TodoUpdatePayload> =
    usePutData("/todos", {
      invalidateQueries: [["todos"]],
    });

  // Patch todo example
  const patchTodoMutation: UseMutationResult<any, Error, TodoUpdatePayload> =
    useUpdateData("/todos", {
      invalidateQueries: [["todos"]],
    });

  // Delete todo example
  const deleteTodoMutation: UseMutationResult<any, Error, number> =
    useDeleteData("/todos", {
      invalidateQueries: [["todos"]],
    });

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: NewTodo = {
      title: newTodoTitle,
      completed: false,
    };

    createTodoMutation.mutate(newTodo);
  };

  const handleUpdateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTodoId || !updateTodoTitle.trim()) return;

    const updatedTodo = {
      id: selectedTodoId,
      title: updateTodoTitle,
      completed: false,
    };

    updateTodoMutation.mutate(updatedTodo);
    setSelectedTodoId(null);
    setUpdateTodoTitle("");
  };

  const handleToggleComplete = (todo: Todo) => {
    patchTodoMutation.mutate({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  if (isLoading) return <div className="p-4">Loading todos...</div>;
  if (isError)
    return <div className="p-4 text-error">Error: {error as string}</div>;

  return (
    <div className="p-8 bg-background">
      <h1 className="text-3xl font-heading text-heading mb-6">
        Todo API Example
      </h1>

      {/* Create Todo Form */}
      <div className="mb-8">
        <h2 className="text-xl font-heading text-heading mb-4">
          Create New Todo
        </h2>
        <form onSubmit={handleCreateTodo} className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Enter todo title"
            className="px-3 py-2 border rounded-lg flex-grow"
          />
          <button
            type="submit"
            disabled={createTodoMutation.isPending}
            className="bg-button text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {createTodoMutation.isPending ? "Adding..." : "Add Todo"}
          </button>
        </form>
        {createTodoMutation.isError && (
          <p className="mt-2 text-error">
            Error: {createTodoMutation.error as string}
          </p>
        )}
      </div>

      {/* Update Todo Form */}
      {selectedTodoId && (
        <div className="mb-8">
          <h2 className="text-xl font-heading text-heading mb-4">
            Update Todo
          </h2>
          <form onSubmit={handleUpdateTodo} className="flex gap-2">
            <input
              type="text"
              value={updateTodoTitle}
              onChange={(e) => setUpdateTodoTitle(e.target.value)}
              placeholder="Enter new title"
              className="px-3 py-2 border rounded-lg flex-grow"
            />
            <button
              type="submit"
              disabled={updateTodoMutation.isPending}
              className="bg-button text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {updateTodoMutation.isPending ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTodoId(null);
                setUpdateTodoTitle("");
              }}
              className="bg-error text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Todo List */}
      <div>
        <h2 className="text-xl font-heading text-heading mb-4">Todo List</h2>
        {todos?.length > 0 ? (
          <ul className="space-y-2">
            {todos.map((todo: Todo) => (
              <li
                key={todo.id}
                className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                    className="h-5 w-5"
                  />
                  <span
                    className={
                      todo.completed ? "line-through text-gray-500" : ""
                    }>
                    {todo.title}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTodoId(todo.id);
                      setUpdateTodoTitle(todo.title);
                    }}
                    className="bg-button text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={deleteTodoMutation.isPending}
                    className="bg-error text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity text-sm">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text">No todos found. Create one above!</p>
        )}
      </div>
    </div>
  );
};

export default ExampleApiComponent;
