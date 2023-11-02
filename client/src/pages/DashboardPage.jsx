import React from "react";
import { TaskList } from "../components/TaskList/TaskList";
import CreateTaskForm from "../components/CreateTaskForm/CreateTaskForm";

const Login = () => {
  const [data, setData] = React.useState(null);
  const [tasks, setTasks] = React.useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.json());
    setData(response);
  };

  const fetchTasks = async () => {
    const etag = localStorage.getItem("etag")
    const response = await fetch("/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {console.log(data) 
      return data.json()});
    setTasks(response);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <h1 style={{ padding: "0px 40px" }}>
        Bonjour {data && data.user.name}, Voici vos tâches{" "}
        <span style={{ fontVariantPosition: "super", color: "red" }}>
          {tasks && tasks.count}
        </span>
      </h1>
      <TaskList tasks={tasks} />
      <CreateTaskForm/>
    </>
  );
};

export default Login;
