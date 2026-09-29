import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ThemeProvider } from "./context/ThemeContext";

// Auth guard helper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // If no token and no user, still attempt to render Home, Home will verify via /get-user
  return children;
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: localStorage.getItem("token") ? <Navigate to="/home" replace /> : <Login />,
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Navigate to="/home" replace /> },
]);

const App = () => (
  <ThemeProvider>
    <RouterProvider router={routes} />
  </ThemeProvider>
);

export default App;
