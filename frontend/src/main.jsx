import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import Login from "./pages/Login";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Dashboard from "./pages/Dashboard/index.jsx";
import Producoes from "./pages/Producoes/index.jsx";
import Tecnicas from "./pages/Tecnicas/index.jsx";
import Docentes from "./pages/Docentes/index.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "Dashboard",
        element: <Dashboard />,
      },
      {
        path: "Producoes",
        element: <Producoes />,
      },
      {
        path: "Tecnicas",
        element: <Tecnicas />,
      },
      {
        path: "Docentes",
        element: <Docentes />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />;
    </ChakraProvider>
  </React.StrictMode>
);
