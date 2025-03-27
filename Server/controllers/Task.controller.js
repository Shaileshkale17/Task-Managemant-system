import TaskLast from "../model/TaskList.js";
import User from "../model/user.model.js";

export const createTask = async (req, res) => {
  try {
    const { Title, type, language, user } = req.body;
    const task = new TaskLast({ Title, type, language, user });
    await task.save();
    await User.findByIdAndUpdate(user, { $push: { task: task._id } });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskLast.aggregate([
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // Keeps users even if they have no tasks
        },
      },
      {
        $lookup: {
          from: "users", // Ensure this collection name is correct
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await TaskLast.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // Filter user by ID
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // Keeps users even if they have no tasks
        },
      },
      {
        $lookup: {
          from: "users", // Ensure this collection name is correct
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await TaskLast.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await TaskLast.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await User.findByIdAndUpdate(task.user, { $pull: { task: task._id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
