import React from "react";
import Style from "./loginForm.module.scss";

const LoginForm = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = React.useState(false);

  const handleEmailChange = (e) => {
    // Mettre à jour le state `credentials` avec la nouvelle valeur du champ d'username
    setCredentials({ ...credentials, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    // Mettre à jour le state `credentials` avec la nouvelle valeur du champ de mot de passe
    setCredentials({ ...credentials, password: e.target.value });
  };

  React.useEffect(() => {
    isAuthenticated();
  }, [credentials]);

  const isAuthenticated = () => {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  };

  const handleLogin = async () => {
    const requestBody = {
      email: credentials.email,
      password: credentials.password,
    };

    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then((res) => {
      console.log("res", res);
      res.json().then((data) => {
        console.log("data", data);
        if (res.status === 200) {
          localStorage.setItem("token", data.token);
          setIsLogin(true)
          setTimeout(() => {
            isAuthenticated()
          }, 3000)
        }
      });
    });
  };
  return (
    <>
      <form className={Style.form}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required onChange={handleEmailChange} />
        <label>Password</label>
        <input
          type="password"
          id="password"
          required
          onChange={handlePasswordChange}
        />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          Login
        </button>
      </form>
      {isLogin && <p>Authentification successful, you will be redirected...</p>}
    </>
  );
};

export default LoginForm;
