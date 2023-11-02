import "./App.css";
import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Header from "./components/Header/Header";

function App() {
  const [data, setData] = React.useState(null);

  const fetchData = async () => {
    const response = await fetch("/hello", {
      method: "GET",
    }).then((data) => data.json());

    setData(response.message);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header app={data}/>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route element={<ProtectedRoutes />}>
            <Route element={<DashboardPage />} path="/dashboard"/>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
