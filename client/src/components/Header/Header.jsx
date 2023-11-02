import React from "react";
import Style from "./header.module.scss";

const Header = ({ app }) => {
  const disconnect = () => {
    localStorage.removeItem("token");
  };

  const isAuthenticated = localStorage.getItem("token");

  return (
    <header className={Style.header}>
      <nav>
        <h1>{app}</h1>
        <ul>
          <li>
            <a href="/">Accueil</a>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li className={Style.header_disconnect}>
                <button onClick={() => disconnect()}>Se déconnecter</button>
              </li>
            </>
          ) : (
            <li className={Style.header_login}>
              <a href="/login">Se connecter</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
