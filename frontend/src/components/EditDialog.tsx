import { createPortal } from "react-dom";

import { X } from "lucide-react";
import type { Task } from "@/types";
import { useEffect, useState } from "react";
import Constants from "@/Constants";
import { toast } from "react-hot-toast";

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

  // id of the task to edit :)
  // use portal
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
            Edit Task
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
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status"
            className="bg-[#101010] border border-[#2D2D2D] rounded px-3 py-2 text-white"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-xl border border-[#2D2D2D] bg-green-600 hover:bg-green-700 px-4 py-2 text-white "
              onClick={handleEdit}
            >
              Edit
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
