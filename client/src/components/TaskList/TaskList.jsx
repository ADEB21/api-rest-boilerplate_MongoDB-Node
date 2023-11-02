import React from "react";
import Style from "./taskList.module.scss";
import TaskItem from "../TaskItem/TaskItem";

export const TaskList = ({ tasks }) => {
  return (
    <section className={Style.taskList_container}>
      <ul>
        {tasks?.tasks.map((task) => {
          return <TaskItem key={task._id} task={task} />;
        })}
      </ul>
    </section>
  );
};
