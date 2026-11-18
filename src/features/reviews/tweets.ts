import { getTweet, type Tweet } from "react-tweet/api";

export const TWEET_IDS = [
  "1942499697538572460",
  "1896194039843868875",
  "2046501317418615231",
  "1954777297166176464",
  "1964427218274464211",
  "2045558334762459145",
  "1896586871121264780",
  "1896469281317212233",
  "2027693668795355561",
];

export type ReviewTweet = {
  id: string;
  tweet: Tweet | null;
};

export async function getReviewTweets(): Promise<ReviewTweet[]> {
  return Promise.all(
    TWEET_IDS.map(async (id) => {
      try {
        const tweet = await getTweet(id, { next: { revalidate: 3600 } });
        return { id, tweet: tweet ?? null };
      } catch (error) {
        console.error(`Failed to load tweet ${id}`, error);
        return { id, tweet: null };
      }
    }),
  );
}
