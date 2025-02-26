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




exports.loginController = async (req, res) => {
  //console.log("hitttttt");
  
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
