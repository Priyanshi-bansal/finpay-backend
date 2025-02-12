const AdminUser = require("../models/adminUserModel");

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const userExists = await AdminUser.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new AdminUser({ name, email, phone, password, role });
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
                    { name: { $regex: search, $options: "i" } },  // Case-insensitive search
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }

        // Pagination logic
        const users = await AdminUser.find(filter)
            .skip((page - 1) * limit)  // Skip previous pages
            .limit(parseInt(limit))    // Limit results per page
            .exec();

        const totalUsers = await AdminUser.countDocuments(filter); // Total users count

        res.status(200).json({
            success: true,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            users
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
    const updatedUser = await AdminUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await AdminUser.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
