"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const prismaProvider_1 = __importDefault(require("./prismaProvider"));
class InstaLogs extends events_1.default {
    static _instance;
    constructor() {
        super();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new InstaLogs();
        }
        return this._instance;
    }
    async createEvent(location, event) {
        try {
            const newEvent = await prismaProvider_1.default.event.create({
                data: {
                    ...event,
                    location,
                    action: {
                        create: {
                            ...event.action,
                        },
                    },
                },
                include: {
                    action: true,
                    actor: true,
                    targetUser: true,
                    team: true,
                    incident: true,
                },
            });
            InstaLogs._instance.emit("onNewEvent", newEvent);
            return newEvent;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getEvents(actorId, location, count, limit, offset, where, filter) {
        try {
            if (count) {
                const events = await prismaProvider_1.default.event.count();
                return events;
            }
            let AND = [];
            let OR = [];
            if (filter) {
                if (filter?.event) {
                    AND.push({ event: filter?.event });
                }
                if (filter?.actor) {
                    AND.push({
                        actor: {
                            id: filter?.actor?.id ?? undefined,
                            first_name: filter?.actor?.first_name
                                ? {
                                    contains: filter?.actor?.first_name ?? undefined,
                                }
                                : undefined,
                            last_name: filter?.actor?.last_name
                                ? {
                                    contains: filter?.actor?.last_name ?? undefined,
                                }
                                : undefined,
                            email: filter?.actor?.email
                                ? {
                                    contains: filter?.actor?.email ?? undefined,
                                }
                                : undefined,
                            username: filter?.actor?.username
                                ? {
                                    contains: filter?.actor?.username ?? undefined,
                                }
                                : undefined,
                            slug: filter?.actor?.slug
                                ? {
                                    contains: filter?.actor?.slug ?? undefined,
                                }
                                : undefined,
                        },
                    });
                }
                if (filter?.target) {
                    AND.push({
                        targetUser: {
                            id: filter?.target?.id ?? undefined,
                            first_name: filter.target?.first_name
                                ? {
                                    contains: filter?.target?.first_name ?? undefined,
                                }
                                : undefined,
                            last_name: filter.target?.last_name
                                ? {
                                    contains: filter?.target?.last_name ?? undefined,
                                }
                                : undefined,
                            email: filter?.target?.email
                                ? {
                                    contains: filter?.target?.email ?? undefined,
                                }
                                : undefined,
                            username: filter.target?.username
                                ? {
                                    contains: filter?.target?.username ?? undefined,
                                }
                                : undefined,
                            slug: filter?.target?.slug
                                ? {
                                    contains: filter?.target?.slug ?? undefined,
                                }
                                : undefined,
                        },
                    });
                }
                if (filter?.team) {
                    AND.push({
                        team: {
                            id: filter?.team?.id ?? undefined,
                            name: filter.team.name
                                ? {
                                    contains: filter?.team?.name ?? undefined,
                                }
                                : undefined,
                            slug: filter?.team?.slug
                                ? {
                                    contains: filter?.team?.slug ?? undefined,
                                }
                                : undefined,
                        },
                    });
                }
                if (filter?.incident) {
                    AND.push({
                        incident: {
                            id: filter?.incident?.id ?? undefined,
                            description: filter.incident.description
                                ? {
                                    contains: filter?.incident?.description ?? undefined,
                                }
                                : undefined,
                            slug: filter?.incident?.slug
                                ? {
                                    contains: filter?.incident?.slug ?? undefined,
                                }
                                : undefined,
                        },
                    });
                }
            }
            else if (where) {
                if (where?.action) {
                    OR.push({
                        action: {
                            name: where.action.name
                                ? {
                                    contains: where?.action?.name ?? undefined,
                                }
                                : undefined,
                            slug: where.action.slug
                                ? {
                                    contains: where?.action?.slug ?? undefined,
                                }
                                : undefined,
                        },
                    });
                }
                if (where?.actor) {
                    OR.push({
                        actor: {
                            OR: [
                                {
                                    first_name: where.actor.first_name
                                        ? {
                                            contains: where?.actor?.first_name ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    last_name: where.actor.last_name
                                        ? {
                                            contains: where?.actor?.last_name ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    email: where.actor.email
                                        ? {
                                            contains: where?.actor?.email ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    username: where.actor.username
                                        ? {
                                            contains: where?.actor?.username ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    slug: where.actor.slug
                                        ? {
                                            contains: where?.actor?.slug ?? undefined,
                                        }
                                        : undefined,
                                },
                            ],
                        },
                    });
                }
                if (where?.target) {
                    OR.push({
                        targetUser: {
                            OR: [
                                {
                                    first_name: where.target.first_name
                                        ? {
                                            contains: where?.actor?.first_name ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    last_name: where.target.last_name
                                        ? {
                                            contains: where?.actor?.last_name ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    email: where.target.email
                                        ? {
                                            contains: where?.actor?.email ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    username: where.target.username
                                        ? {
                                            contains: where?.actor?.username ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    slug: where.target.slug
                                        ? {
                                            contains: where?.actor?.slug ?? undefined,
                                        }
                                        : undefined,
                                },
                            ],
                        },
                    });
                }
                if (where?.team) {
                    OR.push({
                        team: {
                            OR: [
                                {
                                    name: where.team.name
                                        ? {
                                            contains: where?.team?.name ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    slug: where.team.slug
                                        ? {
                                            contains: where?.team?.slug ?? undefined,
                                        }
                                        : undefined,
                                },
                            ],
                        },
                    });
                }
                if (where?.incident) {
                    OR.push({
                        incident: {
                            OR: [
                                {
                                    description: where.incident.description
                                        ? {
                                            contains: where?.incident?.description ?? undefined,
                                        }
                                        : undefined,
                                },
                                {
                                    slug: where.incident.slug
                                        ? {
                                            contains: where?.incident?.slug ?? undefined,
                                        }
                                        : undefined,
                                },
                            ],
                        },
                    });
                }
            }
            const events = await prismaProvider_1.default.event.findMany({
                where: filter
                    ? {
                        AND,
                    }
                    : where
                        ? {
                            OR,
                        }
                        : undefined,
                include: {
                    action: true,
                    actor: true,
                    targetUser: true,
                    team: true,
                    incident: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return events;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.default = InstaLogs;
