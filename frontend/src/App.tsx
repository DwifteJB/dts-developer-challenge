import "./css/index.css";

import { Hammer, Loader } from "lucide-react";

import type { Task } from "./types";

import { useEffect, useState } from "react";
import TaskItem from "./components/TaskItem";
import Constants from "./Constants";
import CreateTaskDialog from "./components/CreateDialog";
import GovIcon from "./components/GovIcon";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // for searching
  const [searchQ, setSearchQ] = useState("");

  const [hasLoaded, setHasLoaded] = useState(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  function fetchTasks() {
    // env from .env file, VITE_API_URL

    try {
      fetch(Constants.API_URL + "/task/all")
        .then((response) => response.json())
        .then((data) => {
          setTasks(data);
          setFilteredTasks(data);
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
    // if empty then show all
    if (!searchQ || searchQ.trim() === "") {
      setFilteredTasks(tasks);
      return;
    }

    // filter by title only
    if (tasks) {
      const filtered = tasks.filter((task) =>
        task.Title.toLowerCase().includes(searchQ.toLowerCase()),
      );
      setFilteredTasks(filtered);
    }
  }, [searchQ]);

  useEffect(() => {
    // load
    fetchTasks();
  }, []);

  if (!hasLoaded) {
    return (
      <div className="bg-[#1d70b8] min-h-screen min-w-screen flex items-center justify-center">
        {/* spinner */}
        <Loader className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen min-w-screen">
      {/* top bit of text as like a title */}
      <div className="p-4 bg-[#1d70b8] justify-center flex gap-4">
        {/* max width of 6xl, center */}
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="min-w-full flex gap-4">
            <GovIcon />
            {/* spacer */}
            <div className="flex-1"></div>
            <div className="text-white text-xl md:text-2xl font-bold">
              Developer Task System
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pt-8">
        {/* track your tasks */}
        <span className="text-xl md:text-2xl font-medium mb-4 text-gray-700">
          Manage and track your developer tasks.
        </span>
        <br />
        {/* title */}
        <span className="text-3xl md:text-5xl font-semibold mb-4 text-[#0b0c0c]">
          Task System
        </span>

        {/* spacer */}

        <div className="h-8"></div>

        {/* your tasks */}
        <span className="text-3xl md:text-4xl font-bold mb-4 text-[#0b0c0c]">
          Your Tasks
        </span>

        <div className="h-4"></div>

        {/* number of tasks, e.g 0 tasks found */}
        <div className="text-2xl text-black/90 font-semibold">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}{" "}
          found
        </div>

        {/* extra create task button */}

        <div className="h-4"></div>

        <div className="flex flex-row gap-4">
          {/* search */}
          <input
            type="text"
            placeholder="Search tasks..."
            className="border rounded px-3 py-2 flex-1"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
          <button
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => setCreateDialogOpen(true)}
          >
            Create New Task
          </button>
        </div>

        {/* list of tasks, not in grid but in line with space r*/}

        <div className="flex flex-col gap-4 mt-4">
          {filteredTasks.map((task) => (
            <TaskItem
              setTasks={setTasks}
              task={task}
              tasks={tasks}
              key={task.ID}
            />
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No tasks found.
            </div>
          )}
        </div>
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
