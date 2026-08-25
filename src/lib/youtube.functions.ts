import { createServerFn } from "@tanstack/react-start";
import { fetchLatestVideos, type YoutubeVideo } from "./youtube.server";

export const getLatestVideos = createServerFn({ method: "GET" }).handler(
  async (): Promise<YoutubeVideo[]> => fetchLatestVideos(4),
);
