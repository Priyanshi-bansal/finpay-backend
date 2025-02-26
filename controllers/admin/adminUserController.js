const AdminUser = require("../../models/admin//adminUserModel");

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExists = await AdminUser.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new AdminUser({ name, email, phone, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users with search and pagination
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Search filter (by name or email)
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } }, // Case-insensitive search
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Pagination logic
    const users = await AdminUser.find(filter)
      .skip((page - 1) * limit) // Skip previous pages
      .limit(parseInt(limit)) // Limit results per page
      .exec();

    const totalUsers = await AdminUser.countDocuments(filter); // Total users count

    res.status(200).json({
      success: true,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await AdminUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginController = async (req, res) => {
  console.log("hitttttt");
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // Check if user exists
    let user = await AdminUser.findOne({ email });

    if (!user) {
      return res.status(404).json("No user found");
    }
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
     email: user.email
      },
    });
  } catch (error) {
    console.error("Error in loginController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete User
exports.payingwalletreport = async (req, res) => {
  try {
  } catch (error) {}
};
