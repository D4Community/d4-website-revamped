import CodeOfConduct from "./coc";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct | D4 Community",
  description: "The community rules and guidelines that keep our developer hub safe, inclusive, and open to all.",
  alternates: {
    canonical: "https://www.d4community.com/code-of-conduct",
  },
  openGraph: {
    title: "D4 Community Code of Conduct",
    description: "The community rules and guidelines that keep our developer hub safe, inclusive, and open to all.",
    url: "https://www.d4community.com/code-of-conduct",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <CodeOfConduct />
    </>
  );
}