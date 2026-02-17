import { createPortal } from "react-dom";
import "./css/index.css";

import { Edit, Hammer, Loader, Trash, X } from "lucide-react";

import type { Task } from "./types";

import { useEffect, useState } from "react";
import EditDialog from "./components/EditDialog";
import TaskItem from "./components/TaskItem";
import Constants from "./Constants";
import CreateTaskDialog from "./components/CreateDialog";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  function fetchTasks() {
    // env from .env file, VITE_API_URL

    try {
      fetch(Constants.API_URL + "/task/all")
        .then((response) => response.json())
        .then((data) => {
          setTasks(data);
          setHasLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          // show dialog with error message
          // on ok refresh the page
          alert("Error fetching tasks: " + error.message);
          window.location.reload();
        });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    // load
    fetchTasks();
  }, []);

  if (!hasLoaded) {
    return (
      <div className="bg-[#101010] min-h-screen min-w-screen flex items-center justify-center">
        {/* spinner */}
        <Loader className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="bg-[#101010] min-h-screen min-w-screen"
      style={{
        background: "linear-gradient(rgb(22, 22, 22) 60%, rgb(11, 11, 11))",
      }}
    >
      {/* top bit of text as like a title */}
      <div className="p-4 border-b border-[#2D2D2D]">
        <h2 className="text-center text-2xl font-bold text-white">
          Your tasks ({tasks.length})
        </h2>
      </div>

      {/* grid based layout, based on screensize */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {/* test cards */}

        {tasks.map((task) => (
          <TaskItem
            key={task.ID}
            task={task}
            tasks={tasks}
            setTasks={setTasks}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-gray-400 text-center col-span-full">
            No tasks found. Create a new task to get started! (click the hammer
            in the bottom right)
          </p>
        )}
      </div>

      {/* bottom right bar that allows you to create new tasks! */}
      <div className="fixed bottom-4 right-4 bg-[#101010] border border-[#2D2D2D] rounded-lg ">
        <button
          className="bg-[#101010] border border-[#2D2D2D]  text-white p-4 rounded cursor-pointer"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Hammer className="w-4 h-4 mx-auto" />
        </button>
      </div>
      <CreateTaskDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        tasks={tasks}
        setTasks={setTasks}
      />
    </div>
  );
}

export default App;
