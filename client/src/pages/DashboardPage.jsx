import React from "react";
import { TaskList } from "../components/TaskList/TaskList";
import CreateTaskForm from "../components/CreateTaskForm/CreateTaskForm";
import axios from "axios";

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

  const fetchTasks = () => {
    const etag = localStorage.getItem("etag");
    fetch("/tasks", {
      method: "GET",
      headers: etag ? { "If-None-Match": etag } : undefined,
    })
      .then((res) => {
        if (res.status === 304) {
          console.log("Not Modified", res);
          setTasks(JSON.parse(localStorage.getItem("tasks")))
        } else if (res.status === 200) {
          const resEtag = res.headers.get("etag");
          localStorage.setItem("etag", resEtag);
          console.log("Modified", res);
          res.json()
            .then(data => {
              setTasks(data)
              localStorage.setItem("tasks", JSON.stringify(data))
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
    fetchData();
  }, []);

  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <h1 style={{ padding: "80px 40px" }}>
        Bonjour {data && data.user.name}, Voici vos tâches{" "}
        <span style={{ fontVariantPosition: "super", color: "red" }}>
          {tasks && tasks.count}
        </span>
      </h1>
      <CreateTaskForm />
      <TaskList tasks={tasks} />
    </>
  );
};

export default Login;
