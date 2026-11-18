import ReviewsPage from "./twitter-reviews";
import { getReviewTweets } from "@/features/reviews/tweets";

export default async function Page() {
  const tweets = await getReviewTweets();
  return <ReviewsPage tweets={tweets} />;
}
