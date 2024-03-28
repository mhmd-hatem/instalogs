/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";

export default function useGetEvents({
  cursor,
  limit,
  where,
}: {
  cursor: number | undefined;
  limit: number;
  where?: {
    event?: string;
    actor?: {
      id?: number;
      f_name?: string;
      l_name?: string;
      email?: string;
      username?: string;
      slug?: string;
    };
    target?: {
      id?: number;
      f_name?: string;
      l_name?: string;
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
  };
}) {
  const fetcher = (args: (string | { where: { [key: string]: any } })[]) => {
    const url = args[0] as string;

    const params =
      (args[1] as { where: { [key: string]: any } }).where ?? undefined;

    return fetch(url, {
      method: params ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhcXVlbGxlIiwiZW1haWwiOiJyYXF1ZWxsZUBzdXBwb3J0LmNvbSIsImlhdCI6MTcxMTU2ODA3NiwiZXhwIjoxNzE0MTYwMDc2fQ.mKbNoN_oSxVCn8zWvzkT92EqcZFQVS1ST9YnmL5HAsk",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then(({ data }) => {
        const events: TEvent[] = data.events.map((entry: any) => {
          const event: TEvent = {
            id: entry.id,
            location: entry.location,
            createdAt: new Date(entry.createdAt),
            action: {
              id: entry.action.id,
              slug: entry.action.slug,
              name: entry.action.name,
              description: entry.action.description,
            },
            actor: {
              id: entry.actor.id,
              slug: entry.actor.slug,
              fName: entry.actor.first_name,
              lName: entry.actor.last_name,
              email: entry.actor.email,
              username: entry.actor.username,
            },
            targetUser: entry.targetUser
              ? {
                  id: entry.targetUser.id,
                  slug: entry.targetUser.slug,
                  fName: entry.targetUser.first_name,
                  lName: entry.targetUser.last_name,
                  email: entry.targetUser.email,
                  username: entry.targetUser.username,
                }
              : undefined,
            team: entry.team
              ? {
                  id: entry.team.id,
                  name: entry.team.name,
                  slug: entry.team.slug,
                }
              : undefined,
            incident: entry.incident
              ? {
                  id: entry.incident.id,
                  name: entry.incident.name,
                  slug: entry.incident.slug,
                }
              : undefined,
          };

          return event;
        });

        return events;
      });
  };

  const url =
    where?.actor?.email?.length ?? 0 > 3
      ? `/api/events/search?cursor=${""}&limit=${1000}`
      : `/api/events?cursor=${cursor}&limit=${limit}`;

  const { data, isLoading } = useSWR(
    [
      url,
      {
        where: where?.actor?.email?.length ?? 0 > 3 ? { where } : undefined,
      },
    ],
    fetcher as any
  );

  return { data, isLoading };
}
