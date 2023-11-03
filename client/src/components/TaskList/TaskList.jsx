import React from "react";
import Style from "./taskList.module.scss";
import TaskItem from "../TaskItem/TaskItem";

export const TaskList = ({ tasks }) => {
  return (
    <section className={Style.taskList_container}>
      <ul>
        {tasks?.tasks.map((task, index) => {
          return <TaskItem key={task._id} task={task} taskIndex={index + 1} />;
        })}
      </ul>
    </section>
  );
};
