import type { Request, Response } from "express";
import InstaLogs from "../services/InstaLogs";
import { Event as InstaEvent } from "../services/prismaProvider";
import { cleanupAddress } from "../utils";
// POST /api/event
export async function addEvent(req: Request, res: Response) {
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
    const result = InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      event
    );
    return res.status(201).json({
      error: null,
      data: {
        event: result,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: 500,
        message: "INTERNAL SERVER ERROR",
      },
      data: null,
    });
  }
}

// GET /api/event?cursor=Z|undefined&limit=Y
export async function getEvents(req: Request, res: Response) {
  const cursor = req.query.cursor
    ? parseInt(req.query.cursor as string)
    : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  try {
    const events: InstaEvent[] = (await InstaLogs.getInstance().getEvents(
      req.body.user.id,
      cleanupAddress(req.ip as string)
    )) as InstaEvent[];
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

    const newEvent = await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        actorId: req.body.user.id,
        event: "GET_EVENTS",
        isSuccessful: true,
        targetUserId: null,
        teamId: null,
        action: {
          name: "get_events",
          description: `Get events for user ${req.body.user.id} at ${req.ip} ${
            req.body.where
              ? JSON.stringify({ where: req.body.where })
              : `all events page ${cursor ?? 1 / (limit ?? 1)}`
          }`,
        },
      }
    );
    return res.status(200).json({
      error: null,
      data: {
        events: eventsList,
      },
    });
  } catch (err) {
    console.log(err);

    const newEvent = await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        actorId: req.body.user.id,
        event: "GET_EVENTS",
        isSuccessful: false,
        targetUserId: null,
        teamId: null,
        action: {
          name: "get_events",
          description: `Get events for user ${req.body.user.id} at ${req.ip} ${
            req.body.where
              ? JSON.stringify({ where: req.body.where })
              : `all events offset ${cursor ?? 0 / (limit ?? 1)}`
          }`,
        },
      }
    );

    return res.status(500).json({
      error: {
        status: 500,
        message: "INTERNAL SERVER ERROR",
      },
      data: null,
    });
  }
}
// GET /api/event/count
export async function getEventsCount(req: Request, res: Response) {
  const cursor = req.query.cursor
    ? parseInt(req.query.cursor as string)
    : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const where = req.body.where;
  try {
    const events: InstaEvent[] = (await InstaLogs.getInstance().getEvents(
      req.body.user.id,
      cleanupAddress(req.ip as string),
      true,
      undefined,
      undefined,
      where
    )) as InstaEvent[];
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

    const newEvent = await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        actorId: req.body.user.id,
        event: "GET_EVENTS",
        isSuccessful: true,
        targetUserId: null,
        teamId: null,
        action: {
          name: "get_events",
          description: `Get events for user ${req.body.user.id} at ${req.ip} ${
            req.body.where
              ? JSON.stringify({ where: req.body.where })
              : `all events page ${cursor ?? 1 / (limit ?? 1)}`
          }`,
        },
      }
    );
    return res.status(200).json({
      error: null,
      data: {
        events: eventsList,
      },
    });
  } catch (err) {
    console.log(err);

    const newEvent = await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        actorId: req.body.user.id,
        event: "GET_EVENTS",
        isSuccessful: false,
        targetUserId: null,
        teamId: null,
        action: {
          name: "get_events",
          description: `Get events for user ${req.body.user.id} at ${req.ip} ${
            req.body.where
              ? JSON.stringify({ where: req.body.where })
              : `all events offset ${cursor ?? 0 / (limit ?? 1)}`
          }`,
        },
      }
    );

    return res.status(500).json({
      error: {
        status: 500,
        message: "INTERNAL SERVER ERROR",
      },
      data: null,
    });
  }
}
// POST /api/event/search?page=X&limit=Y
export async function searchEvents(req: Request, res: Response) {
  const cursor = req.query.cursor
    ? parseInt(req.query.cursor as string)
    : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const where = req.body.where;
  const filter = req.body.filter;

  try {
    const events: InstaEvent[] = (await InstaLogs.getInstance().getEvents(
      req.body.user.id,
      cleanupAddress(req.ip as string),
      undefined,
      undefined,
      undefined,
      where,
      filter
    )) as InstaEvent[];

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

    const newEvent = await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        actorId: req.body.user.id,
        event: "GET_EVENTS",
        isSuccessful: false,
        targetUserId: null,
        teamId: null,
        action: {
          name: "get_events",
          description: `Get events for user ${req.body.user.id} at ${req.ip} ${
            req.body.where
              ? JSON.stringify({ where: req.body.where })
              : `all events offset ${cursor ?? 0 / (limit ?? 1)}`
          }`,
        },
      }
    );
  } catch (err) {
    const newEvent = await InstaLogs.getInstance().createEvent(
      cleanupAddress(req.ip as string),
      {
        actorId: req.body.user.id,
        event: "GET_EVENTS",
        isSuccessful: false,
        targetUserId: null,
        teamId: null,
        action: {
          name: "get_events",
          description: `Get events for user ${req.body.user.id} at ${req.ip} ${
            req.body.where
              ? JSON.stringify({ where: req.body.where })
              : `all events offset ${cursor ?? 0 / (limit ?? 1)}`
          }`,
        },
      }
    );

    return res.status(500).json({
      error: {
        status: 500,
        message: "INTERNAL SERVER ERROR",
      },
      data: null,
    });
  }
}
