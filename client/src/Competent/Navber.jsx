import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/Slice/authSlice";
import { toast } from "react-toastify";
const Navber = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    window.location.replace("/");
  };
  return (
    <div className="flex flex-row justify-between text-gray-300 px-4 items-center  pt-4 ">
      <h1>Task Managemant</h1>
      {isLoggedIn && (
        <div className="flex flex-row gap-5">
          <Link to="/add-task">
            <button className="border border-gray-300 text-center p-2 rounded hover:border-gray-500 hover:text-gray-500 cursor-pointer ">
              Add Task
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="border border-gray-300 text-center p-2 rounded hover:border-gray-500 hover:text-gray-500 cursor-pointer ">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navber;
