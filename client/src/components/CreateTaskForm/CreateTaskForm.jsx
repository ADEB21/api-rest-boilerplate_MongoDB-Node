import React from "react";
import Style from "./createTaskForm.module.scss";
import eventBus from "../../assets/scripts/eventBus";

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
    eventBus.dispatch("refetch");
  };

  return (
    <form className={Style.form}>
      <label htmlFor="">Add a task</label>
      <input onChange={handleUsernameChange} type="text" />
      <div
        style={
          taskField ? { opacity: 1 } : { opacity: 0.3, cursor: "not-allowed" }
        }
      >
        <button
          style={!taskField ? { pointerEvents: "none" }: {pointerEvents: "auto"}}
          onClick={(e) => {
            e.preventDefault();
            createTask();
          }}
          type="submit"
        >
          Add task
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
