import type { Metadata } from "next";
import HostEventPage from "@/features/host-event/page";

export const metadata: Metadata = {
  title: "D4 Event Collaboration Application | D4 Community",
  description:
    "Apply to collaborate with D4 at colleges, universities, company offices, developer communities, and organizations.",
  alternates: {
    canonical: "https://www.d4community.com/host-event",
  },
};

export default function Page() {
  return <HostEventPage />;
}
