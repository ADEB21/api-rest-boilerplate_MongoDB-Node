import React from "react";
import Style from "./taskItem.module.scss";
import eventBus from "../../assets/scripts/eventBus";

const TaskItem = ({ task, taskIndex }) => {
  const updateTaskStatus = async (id) => {
    const token = localStorage.getItem("token"); // Get the authorization token from local storage.
    const body = [{ propName: "isDone", value: !task.isDone }];

    const response = await fetch(`/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Inclure le jeton dans les en-têtes de la requête.
      },
      body: JSON.stringify(body),
    }).then((data) => {
      if (data.status === 200) {
        data.json();
        eventBus.dispatch("refetch");
      }
    }).catch(err => {
      console.log(err);
    })
  };

  const deleteTask = (id) => {
    const token = localStorage.getItem("token"); // Get the authorization token from local storage.
    fetch(`/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Inclure le jeton dans les en-têtes de la requête.
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data.status === 200) {
          eventBus.dispatch("refetch");
        }
      });
    });
  };

  return (
    <>
      <li className={Style.taskItem}>
        <div className={Style.taskItem_header}>
          <p className={Style.taskItem_title}>N°{taskIndex}</p>
          <span className={Style.taskItem_separator}>-</span>
          <p className={Style.taskItem_number}>{task.title}</p>
        </div>
        <div className={Style.taskItem_actions}>
          <button
            className={Style.taskItem_actions_update}
            onClick={() => updateTaskStatus(task._id)}
          >
            {task.isDone ? <span>✅</span> : <span>❌</span>}
          </button>
          <button
            className={Style.taskItem_actions_delete}
            onClick={() => deleteTask(task._id)}
          >
            Supprimer la tâche
          </button>
        </div>
      </li>
    </>
  );
};

export default TaskItem;
