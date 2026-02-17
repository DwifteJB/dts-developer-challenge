import { Edit, Trash } from "lucide-react";

import type { Task } from "../types";
import { useState } from "react";
import EditDialog from "./EditDialog";
import Constants from "@/Constants";

import toast from "react-hot-toast";

function getStatusColor(status: string) {
  // assume that statuses are "pending", "in progress" & "complete", otherwise its blue
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-500 border-yellow-300";
    case "in progress":
      return "bg-blue-100 text-blue-500 border-blue-300";
    case "complete":
      return "bg-green-100 text-green-500 border-green-300";
    default:
      return "border-blue-300 text-blue-500 bg-blue-100";
  }
}

export default function TaskItem({
  task,
  tasks,
  setTasks,
}: {
  task: Task;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleDelete() {
    try {
      const response = await fetch(
        Constants.API_URL + `/task/${task.ID}/delete`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        setTasks(tasks.filter((t) => t.ID !== task.ID));
        toast.success("Task deleted successfully");
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task: " + (error as Error).message);
    }
  }
  return (
    <div key={task.ID} className="bg-white border border-gray-300 m-2 rounded">
      {/* title at top */}
      <div className="w-full border-b border-gray-300">
        <div className="p-4">
          <h3 className="text-3xl font-semibold tracking-tight">
            {task.Title.charAt(0).toUpperCase() + task.Title.slice(1)}
          </h3>

          {/* due at */}
          <p className="text-xl text-black/90">
            Due at{" "}
            {new Date(task.DueDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            on {new Date(task.DueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* contains: description, status, due date (parse from ISO) */}

      <div className="p-4">
        <div className="flex flex-row justify-between items-start">
          <div>
            <p className="text-2xl text-black/90 font-semibold">Description</p>
            <div className="h-2" />
            <p className="text-xl text-black/90 mb-2">
              {task.Description.charAt(0).toUpperCase() +
                task.Description.slice(1)}
            </p>
          </div>
          <button
            className="bg-red-400 text-xl hover:bg-red-600 text-white p-2 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        <p className="text-2xl text-black/90 font-semibold">Status</p>
        <div className="h-2" />
        {/* status card of getStatusColor */}
        <div className="flex flex-row gap-4 items-center">
          <div className={`inline-block border ${getStatusColor(task.Status)} px-2 py-1 rounded`}>
            {task.Status.charAt(0).toUpperCase() + task.Status.slice(1)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-row gap-2 p-2 border-t border-gray-300">
        <button
          className="flex-1 text-xl min-h-8 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
          onClick={() => setDialogOpen(true)}
        >
          Edit Status
        </button>
      </div>

      <EditDialog
        tasks={tasks}
        setTasks={setTasks}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={task}
      />
    </div>
  );
}
