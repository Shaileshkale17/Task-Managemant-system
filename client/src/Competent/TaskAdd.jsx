import React, { useEffect, useState } from "react";
import InputBox from "./InputBox";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AddTask = () => {
  const [Title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [type2, setType2] = useState("");
  const [language, setlanguage] = useState("");
  const [language2, setlanguage2] = useState("");
  const [Data, setData] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const sendData = async (e) => {
    e.preventDefault();
    console.table([Title, type, type2, language, language2]);

    try {
      let boj = {
        Title,
        type: type === "other" || type === "Select" ? type2 : type,
        language:
          language === "other" || language === "Select" ? language2 : language,
        user: user.user.id,
      };

      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_HOST}/task/`,
        boj,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return toast.success("Task Create Successfull");
    } catch (error) {
      console.log(error.message);
      return toast.error(error.message);
    }
  };
  const GetData = async () => {
    try {
      let res = await axios.get(`${import.meta.env.VITE_BACKEND_HOST}/task/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.log(error);
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    GetData();
  }, [sendData]);
  // console.log(Data);
  return (
    <>
      <Link to="/task-list">
        <button className="border border-gray-300 text-center p-2 rounded hover:border-gray-500 hover:text-gray-500 cursor-pointer text-gray-300 mt-5 ml-5 ">
          Back To Task
        </button>
      </Link>
      <div className="min-h-[85vh] flex flex-col justify-center items-center  text-gray-400">
        <form
          onSubmit={sendData}
          className="flex flex-col justify-center items-center gap-6">
          <InputBox
            Title="Title"
            name="Title"
            onChange={setTitle}
            value={Title}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-sm p-2 rounded border border-gray-300 bg-black">
              <option value="Select">--- Select option---</option>
              {Data.map((item) => (
                <option key={item._id} value={item.type}>
                  {item.type}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          {type == "other" && (
            <InputBox
              key={2}
              Title=""
              name="type"
              onChange={setType2}
              value={type2}
            />
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="language">language</label>
            <select
              name="language"
              id="language"
              value={language}
              onChange={(e) => setlanguage(e.target.value)}
              className="w-sm p-2 rounded border border-gray-300 bg-black">
              <option value="Select">--- Select option---</option>
              {Data.map((item) => (
                <option key={item._id} value={item.language}>
                  {item.language}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          {language == "other" && (
            <InputBox
              key={1}
              Title=""
              name="language"
              onChange={setlanguage2}
              value={language2}
            />
          )}
          <button className="border border-gray-300 text-center p-2 rounded hover:border-gray-500 hover:text-gray-500 cursor-pointer ">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTask;
