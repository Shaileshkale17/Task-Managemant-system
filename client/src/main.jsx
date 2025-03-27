import React, { StrictMode } from "react";
// import react from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./Competent/Auth";
import TaskList from "./Competent/TaskList";
import AddTask from "./Competent/TaskAdd";
import store from "./redux/app/store";
import { Provider } from "react-redux";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Auth />,
      },
      {
        path: "/task-list",
        element: <TaskList />,
      },
      {
        path: "/add-task",
        element: <AddTask />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
