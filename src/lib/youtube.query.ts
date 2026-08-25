import { queryOptions } from "@tanstack/react-query";
import { getLatestVideos } from "./youtube.functions";

export const youtubeVideosQuery = queryOptions({
  queryKey: ["youtube", "latest"],
  queryFn: () => getLatestVideos(),
  // Keep the showcase in sync with the channel: revalidate every 5 minutes,
  // on tab focus and after reconnecting, so new uploads appear on their own.
  staleTime: 1000 * 60 * 5,
  refetchInterval: 1000 * 60 * 5,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  retry: 2,
});
