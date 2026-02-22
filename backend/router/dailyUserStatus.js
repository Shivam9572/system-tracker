import express from "express";
const router=express.Router();
import {inActive} from "../controller/dailyUserStatus.js";
import {authentication} from "../middleware/authentictaion.js";

router.post("/in-active",authentication,inActive);
export default router;