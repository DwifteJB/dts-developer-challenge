import { createPortal } from "react-dom";

import { X } from "lucide-react";
import type { Task } from "@/types";
import { useEffect, useState } from "react";
import Constants from "@/Constants";
import { toast } from "react-hot-toast";

export default function CreateTaskDialog({
  open,
  onClose,
  tasks,
  setTasks,
}: {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  async function handleCreate() {
    // ensure all are valid
    if (!title || !status || !dueDate) {
      toast.error(
        "Please fill in all required fields (title, status, due date)",
      );
      return;
    }

    // send req to create

    try {
      const response = await fetch(`${Constants.API_URL}/task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: title,
          Description: description,
          Status: status,
          DueDate: dueDate,
        }),
      });

      if (response.ok) {
        // add the new task to the list of tasks
        const newTask: Task = await response.json();
        setTasks([...tasks, newTask]);
        toast.success("Task created successfully");

        // set everything back to default
        setTitle("");
        setDescription("");
        setStatus("");
        setDueDate(null);

        

        onClose();
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task: " + (error as Error).message);
    }
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0  flex items-center justify-center">
      {/* fake background */}
      <div
        onClick={() => {
          // assume clicking outside
          onClose();
        }}
        className="absolute inset-0 w-screen h-screen bg-[#0F0F10] opacity-80 backdrop-blur-3xl"
      />
      <div className="bg-[#0F0F10] border border-[#2D2D2D] rounded-lg p-4 w-96 z-20">
        {/* X close button top right of the dialog */}
        <div className="flex flex-row w-full justify-between items-center mb-4 ">
          <h2 className="text-xl font-bold mb-4 text-white flex-1">
            Create Task
          </h2>
          <div className="flex">
            <button
              className="text-gray-400 hover:text-gray-600 -mt-6"
              onClick={onClose}
            >
              <X className="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        </div>

        <form className="flex flex-col gap-4">
          {/* title, description (text area), status and duetime (use calendar) */}

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#101010] border border-[#2D2D2D] rounded px-3 py-2 text-white"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#101010] border border-[#2D2D2D] rounded px-3 py-2 text-white"
          />

          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status"
            className="bg-[#101010] border border-[#2D2D2D] rounded px-3 py-2 text-white"
          />

          {/*  cal */}

          <input
            type="datetime-local"
            value={dueDate ? dueDate.toISOString().slice(0, 16) : ""}
            onChange={(e) => setDueDate(new Date(e.target.value))}
            placeholder="Due Date"
            className="bg-[#101010] border border-[#2D2D2D] rounded px-3 py-2 text-white"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-xl border border-[#2D2D2D] bg-green-600 hover:bg-green-700 px-4 py-2 text-white "
              onClick={handleCreate}
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2D2D2D] px-4 py-2 text-white hover:bg-[#2D2D2D]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
