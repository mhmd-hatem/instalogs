import EventEmitter from "events";
import prisma, {
  Action,
  EventType,
  Event as IntaEvent,
} from "./prismaProvider";

export default class InstaLogs extends EventEmitter {
  private static _instance: InstaLogs;

  private constructor() {
    super();
  }

  public static getInstance(): InstaLogs {
    if (!this._instance) {
      this._instance = new InstaLogs();
    }
    return this._instance;
  }

  public async createEvent(
    location: string,
    event: Omit<
      IntaEvent & { action: Omit<Action, "id" | "slug" | "eventId"> },
      "id" | "slug" | "createdAt" | "updatedAt" | "deletedAt" | "location"
    >
  ) {
    try {
      const newEvent = await prisma.event.create({
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getEvents(
    actorId: number,
    location: string,
    count?: boolean,
    limit?: number,
    offset?: number,
    where?: {
      action?: {
        id?: number;
        slug?: string;
        name?: string;
      };
      actor?: {
        id?: number;
        first_name?: string;
        last_name?: string;
        email?: string;
        username?: string;
        slug?: string;
      };
      target?: {
        id?: number;
        first_name?: string;
        last_name?: string;
        email?: string;
        username?: string;
        slug?: string;
      };
      team?: {
        id?: number;
        name?: string;
        slug?: string;
      };
      incident?: {
        id?: number;
        description?: string;
        slug?: string;
      };
    },
    filter?: {
      event?: EventType;
      actor?: {
        id?: number;
        first_name?: string;
        last_name?: string;
        email?: string;
        username?: string;
        slug?: string;
      };
      target?: {
        id?: number;
        first_name?: string;
        last_name?: string;
        email?: string;
        username?: string;
        slug?: string;
      };
      team?: {
        id?: number;
        name?: string;
        slug?: string;
      };
      incident?: {
        id?: number;
        description?: string;
        slug?: string;
      };
    }
  ) {
    try {
      if (count) {
        const events = await prisma.event.count();

        this.createEvent(location, {
          actorId,
          event: "GET_EVENTS",
          isSuccessful: true,
          targetUserId: null,
          teamId: null,
          action: {
            name: "get_events.count",
            description: `Get total events count for user ${actorId} at ${location}`,
          },
        });

        return events;
      }
      let AND: any[] = [];
      let OR: any[] = [];
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
      } else if (where) {
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

      const events = await prisma.event.findMany({
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
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
