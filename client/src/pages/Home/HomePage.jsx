import React from "react";
import Style from "./homePage.module.scss";
import img from "../../assets/images/img.jpg";

const HomePage = () => {
  return (
    <section className={Style.hero}>
      <div>
        <h1>Make Every Day a Productive Day</h1>
        <p>Go to your dashboard to see them</p>
        <div>
          <a href="/dashboard">Dashboard</a>
          <a href="/signup">Signup</a>
        </div>
      </div>
      <img src={img} alt="" />
    </section>
  );
};

export default HomePage;
