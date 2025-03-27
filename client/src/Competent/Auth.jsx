import React, { useState } from "react";
import InputBox from "./InputBox";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/Slice/authSlice";
const Auth = () => {
  const [loginInfo, setLoginInfo] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const dispatch = useDispatch();
  console.log(import.meta.env.VITE_BACKEND_HOST);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter your email and password.");
    }

    try {
      let res;
      const apiUrl = `${import.meta.env.VITE_BACKEND_HOST}/user`;

      if (loginInfo) {
        res = await axios.post(
          `${apiUrl}/login`,
          { email, password },
          { withCredentials: false }
        );
        dispatch(login(res.data));
        window.location.replace("/task-list");
      } else {
        if (password !== rePassword) {
          return toast.error("Passwords do not match.");
        }
        res = await axios.post(apiUrl, { email, password });
        window.location.replace("/");
      }

      console.log(res);
      toast.success(loginInfo ? "Login successful!" : "Signup successful!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[93.2vh] text-gray-300 flex flex-col justify-center items-center gap-7">
      <h1 className="text-3xl font-bold">{loginInfo ? "Login" : "Sign up"}</h1>

      <form onSubmit={submitHandler} className="flex flex-col gap-6">
        <InputBox
          title="Email ID"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <InputBox
          title="Password"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        {!loginInfo && (
          <InputBox
            title="Re-Password"
            name="re-password"
            type="password"
            value={rePassword}
            onChange={setRePassword}
          />
        )}

        <div className="flex flex-col justify-center items-center">
          <button
            type="submit"
            className="border border-gray-300 cursor-pointer text-center p-2 rounded hover:border-gray-500 hover:text-gray-500">
            Submit
          </button>
        </div>

        <p
          onClick={() => setLoginInfo(!loginInfo)}
          className="text-gray-300 cursor-pointer">
          {loginInfo ? "Create an account" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
};

export default Auth;
