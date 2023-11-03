import React from "react";  // Import the React library.
import { TaskList } from "../components/TaskList/TaskList";  // Import the TaskList component.
import CreateTaskForm from "../components/CreateTaskForm/CreateTaskForm";  // Import the CreateTaskForm component.

const Login = () => {
  const [data, setData] = React.useState(null);  // Initialize a state variable for user data.
  const [tasks, setTasks] = React.useState(null);  // Initialize a state variable for tasks data.

  // Function to fetch user data securely with an authorization token.
  const fetchData = async () => {
    const token = localStorage.getItem("token");  // Get the authorization token from local storage.
    const response = await fetch("/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // Include the token in the request headers.
      },
    }).then((data) => data.json());  // Parse the response data and update the user data state.
    setData(response);
  };

  // Function to fetch tasks and handle ETag-based caching.
  const fetchTasks = () => {
    const etag = localStorage.getItem("etag");  // Get the ETag from local storage.
    fetch("/tasks", {
      method: "GET",
      headers: etag ? { "If-None-Match": etag } : undefined,  // Include the ETag in the request headers if it exists.
    })
      .then((res) => {
        if (res.status === 304) {  // Check if the response status indicates "Not Modified."
          console.log("Not Modified", res);
          setTasks(JSON.parse(localStorage.getItem("tasks")));  // Use cached tasks data.
        } else if (res.status === 200) {  // Check if the response status is "Modified."
          const resEtag = res.headers.get("etag");  // Get the ETag from the response headers.
          localStorage.setItem("etag", resEtag);  // Update the ETag in local storage.
          console.log("Modified", res);
          res.json()
            .then(data => {
              setTasks(data);  // Update tasks data in the state.
              localStorage.setItem("tasks", JSON.stringify(data));  // Store updated tasks data in local storage.
            })
            .catch(err => {
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
    fetchData();  // Call fetchData when the component is mounted.
  }, []);

  React.useEffect(() => {
    fetchTasks();  // Call fetchTasks when the component is mounted.
  }, []);

  return (
    <>
      <h1 style={{ padding: "80px 40px" }}>
        Bonjour {data && data.user.name}, Voici vos tâches{" "}  {/* Display a greeting with the user's name. */}
        <span style={{ fontVariantPosition: "super", color: "red" }}>
          {tasks && tasks.count}  {/* Display the count of tasks in a superscript style. */}
        </span>
      </h1>
      <CreateTaskForm />  {/* Render the CreateTaskForm component for creating new tasks. */}
      <TaskList tasks={tasks} />  {/* Render the TaskList component and pass the tasks data. */}
    </>
  );
};

export default Login;  // Export the Login component as the default export.
