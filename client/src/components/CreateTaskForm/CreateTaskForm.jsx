import React from "react";
import Style from "./createTaskForm.module.scss"

const CreateTaskForm = () => {
  const [data, setData] = React.useState(null);
  const [taskField, setTaskField] = React.useState();

  const handleUsernameChange = (e) => {
    // Mettre à jour le state `credentials` avec la nouvelle valeur du champ d'username
    setTaskField(e.target.value);
  };


  const createTask = async () => {
    const body = { title: taskField };
    const response = await fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((data) => data.json());
    console.log(response);
    setData(response);
  };

  return (
    <form className={Style.form}>
      <label htmlFor="">Add a task</label>
      <input onChange={handleUsernameChange} type="text" />
      <button onClick={(e) => {
        e.preventDefault()
        createTask()
      }} type="submit">
        Add task
      </button>
    </form>
  );
};

export default CreateTaskForm;