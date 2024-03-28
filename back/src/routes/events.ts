import { Router, Response, Request } from "express";
import { addEvent, getEvents, searchEvents } from "../controllers";

const router = Router();

router.post("/search", searchEvents);
router.route("/").get(getEvents).post(addEvent);

export default router;
