import React from 'react'
import D4ContactPage from './sections/ContactForm';
import OrgSchema from "@/schema/org-schema";
import { FAQSchema } from "@/schema";

const ContactPage = () => {
  return (
    <>
      <OrgSchema />
      <FAQSchema page={["join-faq", "faq"]} />
      <D4ContactPage />
    </>
  )
}

export default ContactPage