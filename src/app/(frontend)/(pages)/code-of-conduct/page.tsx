import CodeOfConduct from "./coc";
import { Metadata } from "next";
import OrgSchema from "@/schema/org-schema";

export const metadata: Metadata = {
  title: "Code of Conduct | D4 Community",
  description: "Our commitment to fostering a safe and inclusive environment for all members of the D4 Community.",
};

export default function Page() {
  return (
    <>
      <CodeOfConduct />
      <OrgSchema />
    </>
  );
}
