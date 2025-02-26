const Plan = require("../../models/Planmodel");
const User = require("../../models/userModel");

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

