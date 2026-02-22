import sequezile from "../config/DB.js";
import { DataTypes } from "sequelize";

export default sequezile.define("user",{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4(),
        allowNull:false
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    },
      email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    status: {
    type: DataTypes.STRING, // active / inactive
    allowNull: false,
  },

  ipAddress: {
    type: DataTypes.STRING,
  },

  loginTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  logoutTime: {
    type: DataTypes.DATE,
  }
    
})