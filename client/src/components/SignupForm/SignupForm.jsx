import React from "react";
import Style from "./signupForm.module.scss";

const SignupForm = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = React.useState(false);

  const handleEmailChange = (e) => {
    // Mettre à jour le state `credentials` avec la nouvelle valeur du champ d'username
    setCredentials({ ...credentials, email: e.target.value });
    console.log(credentials.email);
  };

  const handlePasswordChange = (e) => {
    // Mettre à jour le state `credentials` avec la nouvelle valeur du champ de mot de passe
    setCredentials({ ...credentials, password: e.target.value });
    console.log(credentials.password);
  };

  React.useEffect(() => {
    //isAuthenticated();
  }, [credentials]);

  const handleSignup = async () => {
    const requestBody = {
      email: credentials.email,
      password: credentials.password,
    };

    const response = await fetch("/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then((res) => {
      console.log("response", res.status);
      res.json().then((data) => {
        console.log(data);
        if (res.status === 201) {
          setIsSignup(true);
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      });
    });
  };
  return (
    <>
      <form className={Style.form}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required onChange={handleEmailChange} />
        <label htmlFor="password">Password</label>
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
            handleSignup();
          }}
        >
          Signup
        </button>
      </form>
      {isSignup && <p>Account created, you will be redirected...</p>}
    </>
  );
};

export default SignupForm;
