import User from "./user.js";
import DailyUserStatus from "./dailyUserStatus.js";

// One-to-Many Relationship
User.hasMany(DailyUserStatus, {
  foreignKey: "userId",
});

DailyUserStatus.belongsTo(User, {
  foreignKey: "userId"
});

export default { User, DailyUserStatus };