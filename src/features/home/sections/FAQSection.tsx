"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { FAQSchema, faqRegistry } from "@/schema";

// Pull FAQs directly from the registry — single source of truth
const faqs = faqRegistry.general;

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
        <span className="text-sm font-medium tracking-tight text-foreground sm:text-md md:text-lg">
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
            <div className="pb-6 text-sm leading-relaxed text-muted-foreground sm:text-md whitespace-pre-line">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-background px-4 py-24 sm:px-6 lg:py-32">
      <FAQSchema page="general" />

      <div className="mx-auto max-w-3xl">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white md:text-4xl lg:text-5xl">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Everything you need to know about the D4 Community and how we work.
          </p>
        </div>

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

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}