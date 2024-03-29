import useSWR from "swr";

export function useGetEventsCount() {
  const fetcher = (...args: Parameters<typeof fetch>) => {
    return fetch(...args)
      .then((response) => response.json())
      .then(({ data }) => {
        return data.count;
      });
  };

  const { data, isLoading } = useSWR("/api/events/count", fetcher);

  return { data, isLoading };
}
