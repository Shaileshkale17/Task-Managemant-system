import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navber from "./Competent/Navber";
import { Outlet } from "react-router-dom";
import Footer from "./Competent/Footer";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className=" bg-black">
      <Navber />
      <ToastContainer />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
