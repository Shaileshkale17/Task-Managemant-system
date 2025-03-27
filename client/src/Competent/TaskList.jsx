import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { utcToTimeAgo } from "utc-to-timeago";
import LoadingScreen from "./LoadingScreen";
import { useSelector } from "react-redux";
const TaskList = () => {
  const [taskList, setTaskList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setloading] = useState(false);
  const itemsPerPage = 10;

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const GetData = async () => {
    setloading(true);
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_BACKEND_HOST}/user/${user.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setTaskList(res.data.data);
    } catch (error) {
      setloading(false);
      console.log(error);
      return toast.error(error.message);
    }
    setloading(false);
  };

  useEffect(() => {
    GetData();
  }, []);

  const filteredTasks = taskList.TaskLastDetails
    ? Array.isArray(taskList.TaskLastDetails)
      ? taskList.TaskLastDetails.filter(
          (item) =>
            item.Title.toLowerCase().includes(search.toLowerCase()) ||
            item.type.toLowerCase().includes(search.toLowerCase())
        )
      : [taskList.TaskLastDetails].filter(
          (item) =>
            item.Title.toLowerCase().includes(search.toLowerCase()) ||
            item.type.toLowerCase().includes(search.toLowerCase())
        )
    : [];

  const totalPages = Math.ceil(filteredTasks?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTasks = filteredTasks?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      {loading ? (
        <div className="min-h-[88.4vh] px-15 text-gray-400 flex justify-center items-center">
          <LoadingScreen />
        </div>
      ) : (
        <div className="min-h-[92.5vh] px-15 text-gray-400">
          <div className="flex justify-center items-center mb-6 mt-1">
            <input
              className="p-2 border border-gray-300 w-sm rounded outline-none"
              type="text"
              placeholder="Enter your search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {displayedTasks?.length === 0 ? (
            search ? (
              <div className="flex flex-row justify-center items-center text-gray-500">
                {`No results found for "${search}". Try a different search.`}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No tasks yet! Start by adding your first task.
              </div>
            )
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="border border-gray-300 text-center">
                  <th className="border border-gray-300 text-center p-2 ">
                    S.No
                  </th>
                  <th className="border border-gray-300 text-center p-2 ">
                    Date Time
                  </th>
                  <th className="border border-gray-300 text-center p-2 ">
                    Title
                  </th>
                  <th className="border border-gray-300 text-center p-2 ">
                    Type
                  </th>
                  <th className="border border-gray-300 text-center p-2 ">
                    Language
                  </th>
                  <th className="border border-gray-300 text-center p-2 ">
                    Complete
                  </th>
                  <th className="border border-gray-300 text-center p-2 ">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {displayedTasks?.map((item, index) => (
                  <tr
                    key={index}
                    className="border border-gray-300 text-center">
                    <td className="border border-gray-300 text-center p-2 ">
                      {startIndex + index + 1}
                    </td>
                    <td className="border border-gray-300 text-center p-2 ">
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </td>
                    <td className="border border-gray-300 text-center p-2 ">
                      {item.Title}
                    </td>
                    <td className="border border-gray-300 text-center p-2 ">
                      {item.type}
                    </td>
                    <td className="border border-gray-300 text-center p-2 ">
                      {item.language}
                    </td>
                    <td className="border border-gray-300 text-center p-2 ">
                      {item.complete ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 text-center p-2 ">
                      Action
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-center mt-5 space-x-2">
            {totalPages == 1
              ? ""
              : Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 border rounded cursor-pointer ${
                      currentPage === index + 1
                        ? "border-gray-400 text-gray-400"
                        : "bg-gray-200 text-black"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;
