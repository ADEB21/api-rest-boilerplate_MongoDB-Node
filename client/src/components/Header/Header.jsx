import React from "react";
import Style from "./header.module.scss";
import eventBus from "../../assets/scripts/eventBus";

const Header = ({ app }) => {
  const [data, setData] = React.useState(null); // Initialize a state variable for user data.
  const [count, setCount] = React.useState(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks")).count
      : 0
  ); // Initialize a state variable for user data.

  const disconnect = () => {
    localStorage.removeItem("token");
  };

  // Function to fetch user data securely with an authorization token.
  const fetchData = async () => {
    const token = localStorage.getItem("token"); // Get the authorization token from local storage.
    const response = await fetch("/protected", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request headers.
      },
    }).then((data) => data.json()); // Parse the response data and update the user data state.
    setData(response);
  };

  React.useEffect(() => {
    fetchData();
    eventBus.on("refetch", () => {
      setTimeout(() => {
        setCount(JSON.parse(localStorage.getItem("tasks")).count);
      }, 100);
    });
  }, []);

  const isAuthenticated = localStorage.getItem("token");

  return (
    <>
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

      {isAuthenticated && (
        <h1 style={{ padding: "80px 40px" }}>
          Bonjour {data && data.user.name}, Voici vos tâches{" "}
          <span style={{ fontVariantPosition: "super", color: "red" }}>
            {count && count}
            {/* Display the count of tasks in a superscript style. */}
          </span>
        </h1>
      )}
    </>
  );
};

export default Header;
