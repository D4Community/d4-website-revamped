"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* ===================== FAQ DATA ===================== */
const faqs = [
  {
    question: "What exactly is the D4 Community?",
    answer:
      "D4 is an inclusive, open-source community built around the four pillars of modern software development: Discite (Learn), Develop, Debug, and Deploy. Our goal is to create a continuous learning and building ecosystem for developers of all skill levels.",
  },
  {
    question: "What is the core concept behind D4?",
    answer:
      "D4 represents an infinite development lo - Discite → Develop → Debug → Deploy. This cycle mirrors real-world software development, where learning, building, fixing, and deploying never truly stop.",
  },
  {
    question: "What does the D4 Community do?",
    answer:
      "We organize meetups, workshops, hackathons, and expert talks. Our focus is on collaboration, hands-on learning, and promoting free knowledge sharing through community-driven and open initiatives.",
  },
  {
    question: "How can I contribute to D4 projects?",
    answer:
      "D4 is fully open-source. You can contribute by collaborating with the community, participating in events, sharing knowledge, or proposing new ideas and initiatives that align with our mission.",
  },
  {
    question: "Are there any membership fees?",
    answer:
      "No. D4 Community is completely free. We strongly believe that access to learning, collaboration, and growth opportunities should never be restricted by cost.",
  },
  {
    question: "Do you host physical or virtual events?",
    answer:
      "We mainly organize physical, in-person events to encourage real-world collaboration and networking. Alongside this, we also host virtual events to keep the community globally accessible.",
  },
  {
    question: "What kind of help can I expect from the community?",
    answer:
      "If you need specific help, guidance, or direction, the community can help connect you with the right people. Whether it’s technical, conceptual, or collaborative support, we focus on finding the right person rather than limiting help to a specific domain.",
  },
  {
    question: "How can you help us?",
    answer:
      "As a non-profit, community-driven initiative, there are several ways you can help D4 grow and thrive:\n\n" +
      "1. Venue Support: If you have access to physical spaces suitable for workshops, meetups, or hackathons, your venue can become a hub for our community events.\n\n" +
      "2. Mentor or Volunteer Support: Experienced developers, educators, or enthusiasts can volunteer as mentors, guides, or event volunteers to help participants learn and collaborate effectively.\n\n" +
      "3. Team Collaboration: You can join our organizing team to help plan, coordinate, and manage events, projects, and community initiatives.\n\n" +
      "4. Promoting Events: Share our events with your network, on social media, or in professional groups to help us reach a wider audience.\n\n" +
      "5. Monetary Support: As we are not a profit-driven or funded organization, financial contributions help us cover essential costs like hosting events, buying resources, or providing minimal stipends for volunteers. Every contribution, big or small, helps sustain the community.",
  },
  {
    question: "Can I start my own project under the D4 umbrella?",
    answer:
      "Yes. If your idea aligns with D4’s vision of learning, collaboration, and free knowledge sharing, you can propose it to the community. Approved ideas receive visibility, collaboration opportunities, and community support.",
  },
];

/* ===================== FAQ ITEM ===================== */
const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-6 text-left transition-all hover:opacity-70"
      >
        <span className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="text-muted-foreground"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-base leading-relaxed text-muted-foreground sm:text-lg whitespace-pre-line">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===================== FAQ PAGE ===================== */
export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-background px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white md:text-4xl lg:text-5xl">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Everything you need to know about the D4 Community and how we work.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={activeIndex === index}
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Still have questions?{" "}
            <a
              href="#contact"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
