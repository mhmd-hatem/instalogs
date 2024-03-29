"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/search", controllers_1.searchEvents);
router.get("/count", controllers_1.getEventsCount);
router.route("/").get(controllers_1.getEvents).post(controllers_1.addEvent);
exports.default = router;
