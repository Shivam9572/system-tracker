import { Server } from 'socket.io';
import { socketAuthMiddleware } from "./authMiddleware.js";
import User from "../model/user.js";
import DailyUserStatus from "../model/dailyUserStatus.js";

const activeUsers = new Map();
const socketConnection = (server) => {
  try {

    const io = new Server(server, {
      cors: {
        origin: "*", // production me restrict karo
        methods: ["GET", "POST"]
      }
    });
    io.use(socketAuthMiddleware);
    io.on('connection', (socket) => {

      let userId = socket.userId;
      socket.on("login", async () => {
        try {

          await User.update(
            { status: "active"},
            { where: { id: userId } }
          );
          const lastDailyStatus = await DailyUserStatus.findOne({
            where: { userId, endTime: null, duration: null, status: "inactive" },
            order: [["createdAt", "DESC"]],
          });


          if (lastDailyStatus) {
            // Close previous unfinished session
            const endTime = new Date();
            const duration = Math.floor((endTime - lastDailyStatus.startTime) / 1000);
            await lastDailyStatus.update({
              endTime,
              duration,
            });
            // Save info in socket for disconnect tracking
          }
          const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

          const newDailyStatus = await DailyUserStatus.create({
            userId,
            date: today,
            status: "active",
            startTime: new Date(),
          });
        } catch (error) {
          console.log(error);
        }
      })
      socket.on("disconnect", async () => {
        try {
          let userId = socket.userId;
          const user = await User.findByPk(userId);

          if (!user) {
            return;
          }

          const currentStatus = user.status; // 'active' or 'inactive'

          // 2️⃣ Only proceed if status actually changes
          if (currentStatus === "active") {
            // 3️⃣ Update User status
            await User.update({ status: "inactive" }, { where: { id: userId } });
                        
          }
           const lastRecord = await DailyUserStatus.findOne({
              where: { userId, endTime: null, status: "active" },
            });
            if (lastRecord) {
             
              const endTime = new Date();
              const duration = Math.floor((endTime - lastRecord.startTime) / 1000);
              await lastRecord.update({ endTime, duration });
               const today = new Date().toISOString().split("T")[0];
              let newStatus=await DailyUserStatus.create({
              userId,
              date:today ,
              status: "inactive",
              startTime: endTime,
              endTime: null,
              duration: null });
            }
        } catch (err) {
          console.error(err);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}
export default socketConnection; 