import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ErrorPage from "./pages/Error/ErrorPage";
import NotFound from "./pages/NotFound/NotFound";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfService from "./pages/Legal/TermsOfService";

// Auth guard — immediately blocks unauthenticated access without flashing private layout
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("userInfo"));
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: localStorage.getItem("userInfo") ? <Navigate to="/home" replace /> : <Login />,
      },
      {
        path: "login",
        element: localStorage.getItem("userInfo") ? <Navigate to="/home" replace /> : <Login />,
      },
      {
        path: "signup",
        element: localStorage.getItem("userInfo") ? <Navigate to="/home" replace /> : <Signup />,
      },
      {
        path: "forgot-password",
        element: localStorage.getItem("userInfo") ? <Navigate to="/home" replace /> : <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms",
        element: <TermsOfService />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

const App = () => (
  <RouterProvider router={routes} />
);

export default App;
