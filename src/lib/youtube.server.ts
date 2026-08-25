import { YOUTUBE_CHANNEL_ID } from "./social";

export interface YoutubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
}

let cache: { at: number; data: YoutubeVideo[] } | null = null;
// Short TTL so a freshly published video appears within minutes.
const TTL = 1000 * 60 * 5;


function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseFeed(xml: string): YoutubeVideo[] {
  const entries = xml.split("<entry>").slice(1);
  const out: YoutubeVideo[] = [];
  for (const entry of entries) {
    const id = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(entry)?.[1];
    const title = /<title>([\s\S]*?)<\/title>/.exec(entry)?.[1];
    const published = /<published>([^<]+)<\/published>/.exec(entry)?.[1];
    if (!id) continue;
    out.push({
      id,
      title: decode(title?.trim() ?? "Video"),
      publishedAt: published ?? "",
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }
  return out;
}

export async function fetchLatestVideos(limit = 3): Promise<YoutubeVideo[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.data.slice(0, limit);
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}&_=${Date.now()}`,
      {
        cache: "no-store",
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; YoursClinicSite/1.0)",
          "cache-control": "no-cache",
        },
      },
    );
    if (!res.ok) throw new Error(`feed ${res.status}`);

    const videos = parseFeed(await res.text());
    if (videos.length === 0) throw new Error("empty feed");
    cache = { at: Date.now(), data: videos };
    return videos.slice(0, limit);
  } catch (err) {
    console.error("youtube feed failed", err);
    return cache?.data.slice(0, limit) ?? [];
  }
}
