import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

// Auth guard helper — Home verifies session via /get-user cookie check
const ProtectedRoute = ({ children }) => {
  return children;
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: localStorage.getItem("userInfo") ? <Navigate to="/home" replace /> : <Login />,
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
  <RouterProvider router={routes} />
);

export default App;
