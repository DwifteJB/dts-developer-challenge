import { X } from "lucide-react";
import type { Task } from "@/types";
import { useState } from "react";
import Constants from "@/Constants";
import { toast } from "react-hot-toast";
import DialogWrapper from "./DialogWrapper";

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


  return (
    <DialogWrapper open={open} onClose={onClose}>
      {/* X close button top right of the dialog */}
      <div className="flex flex-row w-full justify-between items-center mb-4 ">
        <h2 className="text-xl font-bold mb-4 flex-1">Create Task</h2>
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

        <div className="flex flex-col gap-1">
          <span>Title</span>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span>Description</span>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span>Status</span>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/*  cal */}

        <div className="flex flex-col gap-1">
          <span>Due Date & Time</span>
          <input
            type="datetime-local"
            value={dueDate ? dueDate.toISOString().slice(0, 16) : ""}
            onChange={(e) => setDueDate(new Date(e.target.value))}
            placeholder="Due Date"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-green-600 hover:bg-green-700 px-4 py-2  "
            onClick={handleCreate}
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2  hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </DialogWrapper>
  );
}
