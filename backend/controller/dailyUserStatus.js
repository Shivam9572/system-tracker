import User from "../model/user.js";
import DailyUserStatus from "../model/dailyUserStatus.js";

export const inActive = async (req, res) => {
  try {
    const newStatus = req.body.status; // true = active, false = inactive
    const userId = req.id;

    // 1️⃣ Get current user status
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentStatus = user.status; // 'active' or 'inactive'
    console.log(currentStatus,newStatus);
    // 2️⃣ Only proceed if status actually changes
    if (
      (newStatus === true && currentStatus === "inactive") ||
      (newStatus === false && currentStatus === "active")
    ) {
      // 3️⃣ Update User status
      await User.update(
        { status: newStatus ? "active" : "inactive" },
        { where: { id: userId } }
      );

      const now = new Date();

      // Optional: close previous DailyUserStatus record
      const lastRecord = await DailyUserStatus.findOne({
        where: { userId, endTime: null },
        order: [["createdAt", "DESC"]],
      });

      if (lastRecord) {
        const duration = Math.floor((now - lastRecord.startTime) / 1000); // seconds
        await lastRecord.update({ endTime: now, duration });
      }

      // 4️⃣ Create new DailyUserStatus record
      await DailyUserStatus.create({
        userId,
        date: now,
        status: newStatus ? "active" : "inactive",
        startTime: now,
        endTime: null,
        duration: null,
      });
      console.log("Status updated successfully");
      return res.status(201).json({ message: "Status updated successfully" });
    }

    // 5️⃣ If status did not change, do nothing
    return res.status(200).json({ message: "Status unchanged" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};