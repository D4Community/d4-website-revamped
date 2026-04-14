"use client";

import React from "react";
import { motion } from "framer-motion";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-[#080a08] text-white/80 py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-white/10 pb-10 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            Terms of <span style={{ color: "#f6b26b" }}>Use</span>
          </h1>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#6d9eeb]/60">
            Effective Date: April 14, 2026
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="space-y-12 text-base md:text-lg leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest border-l-2 border-[#5ccb5f] pl-4">
              1. About D4 Community
            </h2>
            <p>
              D4 Community is a non-profit, student-and-developer-led initiative. We are built by the community, for the community. Our goal is simple: to help beginners and experts learn, build, and grow together in the tech ecosystem.
            </p>
          </section>

          <section className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.06]">
            <h2 className="text-xl font-bold text-white mb-4">
              2. Important: Monetary Support & Scams
            </h2>
            <p className="mb-4">
              Please read this carefully to stay safe:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-[#5ccb5f]/90">
              <li><strong>No Direct Money:</strong> D4 Community never asks for direct money, donations, or "membership fees" from individuals.</li>
              <li><strong>Sponsorships:</strong> We only accept formal sponsorships from companies for our events. In return, we provide value like branding, recruitment access, or workshops.</li>
              <li><strong>Official Emails:</strong> Only consider communications sent from our official domain <strong>@d4community.com</strong>. If you get an email from a personal Gmail or other address claiming to be D4, please ignore it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest border-l-2 border-[#5ccb5f] pl-4">
              3. Misuse of D4 Name
            </h2>
            <p>
              No member, volunteer, or outside person is allowed to use the "D4 Community" name, logo, or reputation to get personal benefits, profits, or out-of-box favors. If someone asks you for a favor using the D4 name and you have a doubt, please contact the <strong>Organizers</strong> immediately through our official channels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest border-l-2 border-[#5ccb5f] pl-4">
              4. User Obligations
            </h2>
            <p>
              By joining us, you agree to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Be kind and helpful to beginners.</li>
              <li>Not share any harmful, offensive, or illegal content.</li>
              <li>Not try to hack or disrupt our website or community servers.</li>
            </ul>
          </section>

          <section className="pt-10 border-t border-white/10 text-center">
            <p className="text-sm text-white/40">
              Still have doubts? Reach out to the core team via our official Discord or Mail.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;