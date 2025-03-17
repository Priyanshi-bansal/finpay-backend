const Plan = require("../../models/servicePlanmodel");
const User = require("../../models/userModel");


exports.getAlluserController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";
    const role = req.query.role || "";
    const isKycVerified = req.query.isKycVerified === "true";
    const status = req.query.status ;

    const searchCriteria = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};

    if (role) {
      searchCriteria.role = role;
    }

    if (isKycVerified) {
      searchCriteria.isKycVerified = isKycVerified;
    }

    if (status) {
      searchCriteria.status = status;
    }

    const skip = (page - 1) * limit;

    console.log("sdfdghj", searchCriteria);

    const result = await User.find(searchCriteria).skip(skip).limit(limit);

    if (!result || result.length === 0) {
      return res.status(404).send("No users found");
    }

    const totalUsers = await User.countDocuments(searchCriteria);

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      data: result,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error in getAlluserController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { name, services } = req.body;
    const plan = new Plan({ name, services });
    await plan.save();
    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (error) {
    res.status(500).json({ error: "Error creating plan" });
  }
};

exports.assignPlanToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { planId } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.plan = planId;
    user.status = "Approved";
    await user.save();

    res.status(200).json({ message: "Plan assigned successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error assigning plan" });
  }
};
