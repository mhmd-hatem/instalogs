import useSWR from "swr";

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
      return data;
    });
};
