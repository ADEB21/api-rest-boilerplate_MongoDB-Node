import React from "react"; // Import the React library.
import { TaskList } from "../components/TaskList/TaskList"; // Import the TaskList component.
import CreateTaskForm from "../components/CreateTaskForm/CreateTaskForm"; // Import the CreateTaskForm component.
import eventBus from "../assets/scripts/eventBus";

const Login = () => {
  const [tasks, setTasks] = React.useState(null); // Initialize a state variable for tasks data.

  // Function to fetch tasks and handle ETag-based caching.
  const fetchTasks = () => {
    const etag = localStorage.getItem("etag"); // Get the ETag from local storage.
    fetch("/tasks", {
      method: "GET",
      headers: etag ? { "If-None-Match": etag } : undefined, // Include the ETag in the request headers if it exists.
    })
      .then((res) => {
        if (res.status === 304) {
          // Check if the response status indicates "Not Modified."
          setTasks(JSON.parse(localStorage.getItem("tasks"))); // Use cached tasks data.
        } else if (res.status === 200) {
          // Check if the response status is "Modified."
          const resEtag = res.headers.get("etag"); // Get the ETag from the response headers.
          localStorage.setItem("etag", resEtag); // Update the ETag in local storage.
          res
            .json()
            .then((data) => {
              setTasks(data); // Update tasks data in the state.
              localStorage.setItem("tasks", JSON.stringify(data)); // Store updated tasks data in local storage.
            })
            .catch((err) => {
              console.error("Error parsing JSON response:", err);
            });
        } else {
          console.error("Unexpected response status:", res.status);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    fetchTasks(); // Call fetchTasks when the component is mounted.
    eventBus.on("refetch", () => {
      fetchTasks();
    });
  }, []);

  return (
    <>
      <CreateTaskForm /> <TaskList tasks={tasks} />{" "}
    </>
  );
};

export default Login; // Export the Login component as the default export.
