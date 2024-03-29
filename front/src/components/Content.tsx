import { Button, Skeleton } from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useGetEvents from "../hooks/useGetEvents";
import EventEntry from "./EventEntry";
import { Socket } from "socket.io-client";

const skeletonList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const limit = 10;

type ContentProps = {
  socket: React.RefObject<Socket | null>;
  setEventsRef: (events: TEvent[]) => void;
  where?: {
    [key: string]: { [key: string]: string };
  };
  filter?: {
    [key: string]: { [key: string]: string | number | boolean };
  };
};

export default function Content({ socket, setEventsRef, where }: ContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [events, setEvents] = useState<TEvent[]>([]);
  const [eventsSearch, setEventsSearch] = useState<TEvent[]>([]);
  const cursorRef = useRef<number | undefined>(-99);

  const { data, isLoading: swrLoading } = useGetEvents({
    cursor,
    limit,
    where,
  });

  useEffect(() => {
    if (eventsSearch.length > 0) setEventsRef(eventsSearch);
    else setEventsRef(events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, eventsSearch]);

  useEffect(() => {
    socket.current?.on("newevent", (data) => {
      const event: TEvent = {
        id: data.event.id,
        location: data.event.location,
        createdAt: new Date(data.event.createdAt),
        action: {
          id: data.event.action.id,
          slug: data.event.action.slug,
          name: data.event.action.name,
          description: data.event.action.description,
        },
        actor: {
          id: data.event.actor.id,
          slug: data.event.actor.slug,
          fName: data.event.actor.first_name,
          lName: data.event.actor.last_name,
          email: data.event.actor.email,
          username: data.event.actor.username,
        },
        targetUser: data.event.targetUser
          ? {
              id: data.event.targetUser.id,
              slug: data.event.targetUser.slug,
              fName: data.event.targetUser.first_name,
              lName: data.event.targetUser.last_name,
              email: data.event.targetUser.email,
              username: data.event.targetUser.username,
            }
          : undefined,
        team: data.event.team
          ? {
              id: data.event.team.id,
              name: data.event.team.name,
              slug: data.event.team.slug,
            }
          : undefined,
        incident: data.event.incident
          ? {
              id: data.event.incident.id,
              name: data.event.incident.name,
              slug: data.event.incident.slug,
            }
          : undefined,
      };

      setEvents((prev) => [event, ...prev]);
    });
  }, [socket]);

  useLayoutEffect(() => {
    if (
      !swrLoading &&
      cursor !== cursorRef.current
      // (where?.actor?.email?.length ?? 0 <= 0)
    ) {
      setEvents((prev) => [...prev, ...(data ?? [])]);
      setIsLoading(false);
      cursorRef.current = cursor;
    }
  }, [data, swrLoading, cursor]);

  useLayoutEffect(() => {
    if (
      !swrLoading &&
      where?.actor?.email &&
      (where?.actor?.email?.length ?? 0 <= 0)
    ) {
      setEventsSearch([...(data ?? [])]);
      setIsLoading(false);
      setCursor(undefined);
      setEvents([]);
      cursorRef.current = -99;
    }
  }, [where, data, swrLoading]);

  return (
    <div className="w-full bg-transparent flex flex-col max-h-full overflow-auto">
      <div className="bg-white flex flex-col h-full w-full">
        <div className="w-full grid grid-cols-3 p-8 flex-1">
          {(where?.actor?.email?.length ?? 0 <= 0 ? eventsSearch : events).map(
            (event) => (
              <EventEntry key={uuidv4()} event={event} />
            )
          )}
          {isLoading &&
            skeletonList.map(() => (
              <div className="grid grid-cols-3 col-span-3 group w-full min-h-24 h-24">
                <div className="flex gap-3 items-center h-7">
                  <Skeleton className="flex rounded-full w-7 h-7" />
                  <Skeleton className="h-5 w-4/5 rounded-sm" />
                </div>
                <div className="flex items-center h-7">
                  <Skeleton className="h-5 w-4/5 rounded-sm" />
                </div>
                <div className="flex items-center h-7">
                  <Skeleton className="h-5 w-2/5 rounded-sm" />
                </div>
              </div>
            ))}
        </div>
        {events.length > 0 && events[events.length - 1].id - 10 >= 0 ? (
          !where?.actor?.email && (
            <Button
              disabled={isLoading}
              onPress={() => {
                setIsLoading(!isLoading);
                setCursor(data?.[data.length - 1].id ?? undefined);
              }}
              className={`bg-transparent col-span-3 bg-neutral-100 rounded-t-none font-semibold text-neutral-500 shadow-sm p-4 w-full min-h-[69px] items-center justify-center ${
                isLoading && "hidden"
              }`}
            >
              LOAD MORE
            </Button>
          )
        ) : (
          <p className=" italic font-medium text-neutral-400 flex items-center justify-center w-full">
            {
              "SEEMS LIKE THERE ARE NO MORE EVENT RECORDS, YOU'VE OFFICIALLY SEEN IT ALL! ;)"
            }
          </p>
        )}
      </div>
    </div>
  );
}
