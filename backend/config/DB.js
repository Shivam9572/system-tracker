import { Sequelize } from "sequelize";

const sequezile=new Sequelize("systemtracker","root","12345",
    {
      logging:false,
      host:"localhost",
      dialect:"mysql",
      timezone: "+05:30"
    }
)
export default sequezile;

