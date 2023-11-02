import React from "react";
import Style from "./taskItem.module.scss";

const TaskItem = ({ task }) => {
  const updateTaskStatus = async (id) => {
    const body = [{ propName: "isDone", value: !task.isDone }];

    const response = await fetch(`/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((data) => data.json());
  };

  const deleteTask = async (id) => {
    const response = await fetch(`/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
  };

  return (
    <>
      <li className={Style.taskItem}>
        <p className={Style.taskItem_title}>{task.title}</p>
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
