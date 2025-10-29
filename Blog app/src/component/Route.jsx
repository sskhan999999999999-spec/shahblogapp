import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./Home.jsx";
import Page from "../pages/Mainpage.jsx";// Example child component
import Signup from "./Singup.jsx";

const router = createBrowserRouter([
  {
    path:"/singup",
    element: <Signup/>
  }
  ,
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "page", // notice: no slash at start
        element: <Page />,
      },
      {
        path: "page",
        element : <Page/>
      },
       {
        path: "page",
        element : <Page/>
      },
       {
        path: "page",
        element : <Page/>
      },
    ],
  },
]);


export default router;
