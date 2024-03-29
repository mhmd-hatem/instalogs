import { Router } from "express";
import {
  addEvent,
  getEvents,
  getEventsCount,
  searchEvents,
} from "../controllers";

const router = Router();

router.post("/search", searchEvents);
router.post("/count", getEventsCount);
router.route("/").get(getEvents).post(addEvent);

export default router;
