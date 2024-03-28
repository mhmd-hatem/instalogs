"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEvents = exports.getEventsCount = exports.getEvents = exports.addEvent = void 0;
const InstaLogs_1 = __importDefault(require("../services/InstaLogs"));
const utils_1 = require("../utils");
// POST /api/event
async function addEvent(req, res) {
    try {
        const { event } = req.body;
        if (!event) {
            return res.status(422).json({
                error: {
                    status: 422,
                    message: "Please Provide a valid data",
                },
                data: null,
            });
        }
        const result = InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), event);
        return res.status(201).json({
            error: null,
            data: {
                event: result,
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            error: {
                status: 500,
                message: "INTERNAL SERVER ERROR",
            },
            data: null,
        });
    }
}
exports.addEvent = addEvent;
// GET /api/event?cursor=Z|undefined&limit=Y
async function getEvents(req, res) {
    const cursor = req.query.cursor
        ? parseInt(req.query.cursor)
        : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    try {
        const events = (await InstaLogs_1.default.getInstance().getEvents(req.body.user.id, (0, utils_1.cleanupAddress)(req.ip)));
        if (!events[0]) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: "No Events Found...",
                },
                data: null,
            });
        }
        const startIndex = cursor
            ? events.findIndex((event) => event.id === cursor)
            : 0;
        const endIndex = startIndex + limit;
        const eventsList = events.slice(startIndex, endIndex);
        const newEvent = await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            actorId: req.body.user.id,
            event: "GET_EVENTS",
            isSuccessful: true,
            targetUserId: null,
            teamId: null,
            action: {
                name: "get_events",
                description: `Get events for user ${req.body.user.id} at ${req.ip} ${req.body.where
                    ? JSON.stringify({ where: req.body.where })
                    : `all events page ${cursor ?? 1 / (limit ?? 1)}`}`,
            },
        });
        return res.status(200).json({
            error: null,
            data: {
                events: eventsList,
            },
        });
    }
    catch (err) {
        console.log(err);
        const newEvent = await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            actorId: req.body.user.id,
            event: "GET_EVENTS",
            isSuccessful: false,
            targetUserId: null,
            teamId: null,
            action: {
                name: "get_events",
                description: `Get events for user ${req.body.user.id} at ${req.ip} ${req.body.where
                    ? JSON.stringify({ where: req.body.where })
                    : `all events offset ${cursor ?? 0 / (limit ?? 1)}`}`,
            },
        });
        return res.status(500).json({
            error: {
                status: 500,
                message: "INTERNAL SERVER ERROR",
            },
            data: null,
        });
    }
}
exports.getEvents = getEvents;
// GET /api/event/count
async function getEventsCount(req, res) {
    const cursor = req.query.cursor
        ? parseInt(req.query.cursor)
        : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const where = req.body.where;
    try {
        const events = (await InstaLogs_1.default.getInstance().getEvents(req.body.user.id, (0, utils_1.cleanupAddress)(req.ip), true, undefined, undefined, where));
        if (!events[0]) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: "No Events Found...",
                },
                data: null,
            });
        }
        const startIndex = cursor
            ? events.findIndex((event) => event.id === cursor)
            : 0;
        const endIndex = startIndex + limit;
        const eventsList = events.slice(startIndex, endIndex);
        const newEvent = await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            actorId: req.body.user.id,
            event: "GET_EVENTS",
            isSuccessful: true,
            targetUserId: null,
            teamId: null,
            action: {
                name: "get_events",
                description: `Get events for user ${req.body.user.id} at ${req.ip} ${req.body.where
                    ? JSON.stringify({ where: req.body.where })
                    : `all events page ${cursor ?? 1 / (limit ?? 1)}`}`,
            },
        });
        return res.status(200).json({
            error: null,
            data: {
                events: eventsList,
            },
        });
    }
    catch (err) {
        console.log(err);
        const newEvent = await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            actorId: req.body.user.id,
            event: "GET_EVENTS",
            isSuccessful: false,
            targetUserId: null,
            teamId: null,
            action: {
                name: "get_events",
                description: `Get events for user ${req.body.user.id} at ${req.ip} ${req.body.where
                    ? JSON.stringify({ where: req.body.where })
                    : `all events offset ${cursor ?? 0 / (limit ?? 1)}`}`,
            },
        });
        return res.status(500).json({
            error: {
                status: 500,
                message: "INTERNAL SERVER ERROR",
            },
            data: null,
        });
    }
}
exports.getEventsCount = getEventsCount;
// POST /api/event/search?page=X&limit=Y
async function searchEvents(req, res) {
    const cursor = req.query.cursor
        ? parseInt(req.query.cursor)
        : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const where = req.body.where;
    const filter = req.body.filter;
    try {
        const events = (await InstaLogs_1.default.getInstance().getEvents(req.body.user.id, (0, utils_1.cleanupAddress)(req.ip), undefined, undefined, undefined, where, filter));
        if (!events[0]) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: "No Events Found...",
                },
                data: null,
            });
        }
        const startIndex = cursor
            ? events.findIndex((event) => event.id === cursor)
            : 0;
        const endIndex = startIndex + limit;
        const eventsList = events.slice(startIndex, endIndex);
        res.status(200).json({
            error: null,
            data: {
                events: eventsList,
            },
        });
        const newEvent = await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            actorId: req.body.user.id,
            event: "GET_EVENTS",
            isSuccessful: false,
            targetUserId: null,
            teamId: null,
            action: {
                name: "get_events",
                description: `Get events for user ${req.body.user.id} at ${req.ip} ${req.body.where
                    ? JSON.stringify({ where: req.body.where })
                    : `all events offset ${cursor ?? 0 / (limit ?? 1)}`}`,
            },
        });
    }
    catch (err) {
        const newEvent = await InstaLogs_1.default.getInstance().createEvent((0, utils_1.cleanupAddress)(req.ip), {
            actorId: req.body.user.id,
            event: "GET_EVENTS",
            isSuccessful: false,
            targetUserId: null,
            teamId: null,
            action: {
                name: "get_events",
                description: `Get events for user ${req.body.user.id} at ${req.ip} ${req.body.where
                    ? JSON.stringify({ where: req.body.where })
                    : `all events offset ${cursor ?? 0 / (limit ?? 1)}`}`,
            },
        });
        return res.status(500).json({
            error: {
                status: 500,
                message: "INTERNAL SERVER ERROR",
            },
            data: null,
        });
    }
}
exports.searchEvents = searchEvents;
