import { X } from "lucide-react";
import type { Task } from "@/types";
import { useEffect, useState } from "react";
import Constants from "@/Constants";
import { toast } from "react-hot-toast";
import DialogWrapper from "./DialogWrapper";

export default function EditDialog({
  open,
  onClose,
  task,
  tasks,
  setTasks,
}: {
  open: boolean;
  onClose: () => void;
  task: Task;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [status, setStatus] = useState(task.Status);

  useEffect(() => {
    setStatus(task.Status);
  }, [task]);

  async function handleEdit() {
    // send req to edit
    try {
      const response = await fetch(
        `${Constants.API_URL}/task/${task.ID}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Status: status,
          }),
        },
      );
      if (response.ok) {
        toast.success("Task updated successfully");

        setTasks(
          tasks.map((t) => (t.ID === task.ID ? { ...t, Status: status } : t)),
        );
        onClose();
      } else {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task: " + (error as Error).message);
    }
  }


  return (
    <DialogWrapper open={open} onClose={onClose}>
      {/* X close button top right of the dialog */}
      <div className="flex flex-row w-full justify-between items-center mb-4 ">
        <h2 className="text-xl font-bold mb-4  flex-1">
          Edit Task&apos;s status
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

      <form className="flex flex-col">
        <span>Status</span>
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
          className="border border-gray-300 rounded px-3 py-2"
        />

        <div className="h-4" />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-green-600 hover:bg-green-700 px-4 py-2 text-white"
            onClick={handleEdit}
          >
            Edit
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
