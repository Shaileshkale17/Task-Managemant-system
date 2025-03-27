import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((f) => f.trim() == "")) {
      return res.status(401).json({
        status: 401,
        message: "required the email and Password",
        success: false,
      });
    }

    const userFind = await User.find({ email });
    if (userFind.length > 0) {
      return res.status(401).json({
        status: 401,
        data: userFind,
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const data = await User.create({
      name: "User name",
      email: email,
      password: hashPassword,
    });

    if (!data) {
      res
        .status(500)
        .json({ status: 500, message: "something is wrong", success: false });
    }

    return res.status(201).json({
      status: 201,
      data: data,
      message: "create successfull",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "something is wrong", success: false });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      success: false,
    });
  }
};

export const userFetch = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $unwind: {
          path: "$task",
          preserveNullAndEmptyArrays: true, // Keeps users even if they have no tasks
        },
      },
      {
        $lookup: {
          from: "tasklasts", // Ensure this collection name is correct
          localField: "task",
          foreignField: "_id",
          as: "TaskLastDetails",
        },
      },
      {
        $unwind: {
          path: "$TaskLastDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No users found",
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      data,
      message: "Fetch data successful",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      success: false,
      error: error.message, // Helps in debugging
    });
  }
};

// export const userFech = async (req, res) => {
//   try {
//     const data = await User.aggregate([
//       {
//         $unwind: {
//           path: "$task",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "TaskLasts",
//           localField: "task",
//           foreignField: "_id",
//           as: "TaskLastDetails",
//         },
//       },
//       {
//         $unwind: {
//           path: "$TaskLastDetails",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//     ]);
//     if (!data) {
//       res
//         .status(500)
//         .json({ status: 500, message: "something is wrong", success: false });
//     }
//     return res.status(200).json({
//       status: 200,
//       data,
//       message: "fech data successfull",
//       success: true,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: 500, message: "something is wrong", success: false });
//   }
// };

export const OneuserFech = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid user ID format",
      success: false,
    });
  }

  try {
    const data = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // Match user by ID
      },
      {
        $lookup: {
          from: "tasklasts", // Ensure this is the correct collection name
          localField: "task",
          foreignField: "_id",
          as: "TaskLastDetails",
        },
      },
      {
        $unwind: {
          path: "$TaskLastDetails",
          preserveNullAndEmptyArrays: true, // Ensure TaskLastDetails exists
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          password: { $first: "$password" },
          task: { $first: "$task" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          __v: { $first: "$__v" },
          TaskLastDetails: { $push: "$TaskLastDetails" }, // Store all tasks
        },
      },
    ]);

    // Debugging logs

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "User not found", success: false });
    }

    return res.status(200).json({
      status: 200,
      data: data[0], // Return only one object
      message: "Fetch data successful",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      status: 500,
      message: "Something went wrong",
      success: false,
    });
  }
};

export const User_Deleted = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: "user deleted successful",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ status: 500, message: "Something went wrong", success: false });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      data: updatedUser,
      message: "User updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      status: 500,
      message: "Something went wrong",
      success: false,
    });
  }
};
