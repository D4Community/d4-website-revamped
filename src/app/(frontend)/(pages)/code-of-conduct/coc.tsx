"use client";

import React from "react";
import { motion } from "framer-motion";

const CodeOfConduct = () => {
  const secondaryWord = "Conduct";

  return (
    <div className="min-h-screen bg-white dark:bg-[#080a08] text-gray-800 dark:text-white/80 py-20 px-6 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-gray-200 dark:border-white/10 pb-10 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
            Code of{" "}
            <span style={{ color: "#f6b26b" }}>
              {secondaryWord.split("").map((char, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#4a86e8] dark:text-[#6d9eeb]/60">
            Fostering a Safe & Innovative Space | Effective: April 14, 2026
          </p>
        </motion.div>

        <div className="space-y-12 text-base md:text-lg leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest border-l-4 border-[#38a13b] dark:border-[#5ccb5f] pl-4">
              1. Where this applies
            </h2>
            <p className="mb-4">
              This policy is applicable to all D4 Community spaces, both online and offline, including:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#4a86e8] dark:text-[#6d9eeb]/90 font-medium list-inside list-disc">
              <li>Hackathons & Workshops</li>
              <li>Talks, Demos & Presentations</li>
              <li>Social Media Channels</li>
              <li>Parties and Social Events</li>
            </ul>
          </section>

          <section className="bg-gray-50 dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06]">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#e69138" }}>
              2. No Plagiarism
            </h2>
            <p>
              We value original craftsmanship. Please submit projects prepared during the hackathon. If you use existing code or re-submit an old project, you <strong>must disclose it</strong>. 
            </p>
            <p className="mt-3 text-sm italic opacity-70">
              Undisclosed re-use of code may lead to immediate disqualification from awards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest border-l-4 border-[#38a13b] dark:border-[#5ccb5f] pl-4">
              3. Safe Space & Anti-Discrimination
            </h2>
            <p className="mb-4">
              D4 is a harassment-free zone. We have <strong>zero tolerance</strong> for discrimination based on race, gender, religion, age, physical appearance, or even your choice of programming language. 
            </p>
            <div className="bg-blue-50 dark:bg-[#6d9eeb]/5 border border-blue-100 dark:border-[#6d9eeb]/20 p-5 rounded-xl">
              <p className="text-gray-900 dark:text-white font-semibold mb-2">We do not tolerate:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Offensive verbal comments or public display of sexual material.</li>
                <li>Stalking, intimidation, or unwelcome sexual advances.</li>
                <li>Recording or taking photos of participants without their consent.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest border-l-4 border-[#38a13b] dark:border-[#5ccb5f] pl-4">
              4. Your Creations
            </h2>
            <p>
              <strong>You own what you build.</strong> All rights and intellectual property of your developments stay with you. By sharing it on our platform, you only give D4 a license to display it so we can showcase your talent to the world.
            </p>
          </section>

          <section className="bg-red-50 dark:bg-red-500/5 p-6 rounded-2xl border border-red-100 dark:border-red-500/20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              5. Reporting & Violations
            </h2>
            <p className="mb-4">
              If you feel unsafe or notice a violation, contact a D4 Organizer immediately. We are here to help you feel safe.
            </p>
            <p className="text-gray-900 dark:text-white font-semibold">Violations may lead to:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#e69138] dark:text-[#f6b26b]/90">
              <li>Expulsion from the event without a refund.</li>
              <li>Permanent block from all D4 Community resources.</li>
              <li>Reporting the behavior to local law enforcement.</li>
            </ul>
          </section>

          <section className="pt-10 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-sm text-gray-500 dark:text-white/40 mb-2">
              Help us keep the community clean and creative.
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-[#38a13b] dark:text-[#5ccb5f] font-bold">
              Connect with Organizers if you have any doubt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CodeOfConduct;