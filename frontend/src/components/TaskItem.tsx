import { Edit, Trash } from "lucide-react";

import type { Task } from "../types";
import { useState } from "react";
import EditDialog from "./EditDialog";
import Constants from "@/Constants";

import toast from "react-hot-toast";

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
    <div
      key={task.ID}
      className="bg-[#0F0F10] border border-[#2D2D2D] m-2 rounded-lg"
    >
      {/* title at top */}
      <div className="w-full border-b border-[#2D2D2D]">
        <h3 className="text-white text-center p-2">{task.Title}</h3>
      </div>

      {/* contains: description, status, due date (parse from ISO) */}

      <div className="p-2">
        <p className="text-sm text-gray-400 mb-2">
          Description: {task.Description ?? "No description provided."}
        </p>
        <p className="text-sm text-gray-400 mb-1">
          Status: <span className="text-green-400">{task.Status}</span>
        </p>
        <p className="text-sm text-gray-400">
          Due: {new Date(task.DueDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-1 flex-row gap-2 p-2 border-t border-[#2D2D2D]">
        <button
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
          onClick={() => setDialogOpen(true)}
        >
          <Edit className="w-4 h-4 mx-auto" />
        </button>
        <button
          className="p-4 bg-red-500 hover:bg-red-600 text-white py-1 rounded"
          onClick={handleDelete}
        >
          <Trash className="w-4 h-4 mx-auto" />
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
