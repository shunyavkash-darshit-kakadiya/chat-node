import User from "../../../../models/auth.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("fullName email");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export default getAllUsers;
