import React from "react";
import Style from "./form.module.scss"

const Form = () => {
  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });

  const handleUsernameChange = (e) => {
    // Mettre à jour le state `credentials` avec la nouvelle valeur du champ d'username
    setCredentials({ ...credentials, username: e.target.value });
  };

  const handlePasswordChange = (e) => {
    // Mettre à jour le state `credentials` avec la nouvelle valeur du champ de mot de passe
    setCredentials({ ...credentials, password: e.target.value });
  };

  React.useEffect(() => {
    isAuthenticated();
  }, [credentials]);

  const redirectTo = (path) => {
    window.location.href = path;
  };

  const isAuthenticated = () => {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  };

  const handleLogin = async () => {
    const requestBody = {
      username: credentials.username,
      password: credentials.password,
    };

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then((data) => data.json());

    localStorage.setItem("token", response);
    isAuthenticated();
  };
  return (
    <form className={Style.form}>
      <label>Username</label>
      <input type="text" onChange={handleUsernameChange} />
      <label>Password</label>
      <input type="password" onChange={handlePasswordChange} />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        Envoyer
      </button>
    </form>
  );
};

export default Form;
