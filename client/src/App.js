import "./App.css";  // Import the CSS file for styling.
import React from "react";  // Import the React library for building the app.
import {
  BrowserRouter as Router,  // Import the Router component from react-router-dom to manage client-side routing.
  Switch,  // Import the Switch component for rendering only one route at a time.
  Route,  // Import the Route component for defining routes.
  Routes,  // Import the Routes component to group routes.
} from "react-router-dom";  // Import routing components from react-router-dom.

import Login from "./pages/LoginPage";  // Import the Login page component.
import DashboardPage from "./pages/DashboardPage";  // Import the Dashboard page component.
import ProtectedRoutes from "./routes/ProtectedRoutes";  // Import the ProtectedRoutes component.
import Header from "./components/Header/Header";  // Import the Header component.
import HomePage from "./pages/Home/HomePage";

function App() {
  const [data, setData] = React.useState(null);  // Initialize a state variable for data.

  // Function to fetch data from the server.
  const fetchData = async () => {
    const response = await fetch("/hello", {
      method: "GET",
    }).then((data) => data.json());  // Send a GET request and parse the response data.
    setData(response.message);  // Update the state with the response message.
  };

  React.useEffect(() => {
    fetchData();  // Call fetchData when the component is mounted.
  }, []);

  return (
    <>
      <Header app={data}/>  {/* Render the Header component and pass data from the server. */}
      <Router>  {/* Set up the Router for managing routes. */}
        <Routes>  {/* Define routes using the Routes component. */}
          <Route path="/login" element={<Login />}></Route>  {/* Define a route for the Login page. */}
          <Route path="/" element={<HomePage/>}></Route>  {/* Define a route for the Login page. */}
          <Route element={<ProtectedRoutes />}>  {/* Group routes that require authentication using ProtectedRoutes. */}
            <Route element={<DashboardPage />} path="/dashboard"/>  {/* Define a route for the Dashboard page. */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;  // Export the App component as the default export.
