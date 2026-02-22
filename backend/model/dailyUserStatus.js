import { DataTypes } from "sequelize";
import sequelize from "../config/DB.js";

export default sequelize.define("DailyUserStatus", {
  id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4(),
        allowNull:false
    },
  date: {
    type: DataTypes.DATEONLY, // 2026-02-22
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
  },

  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  endTime: {
    type: DataTypes.DATE,
  },

  duration: {
    type: DataTypes.INTEGER, // seconds
  }

});

