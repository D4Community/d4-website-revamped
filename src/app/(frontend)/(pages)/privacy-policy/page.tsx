"use client";

import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#080a08] text-white/80 py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-white/10 pb-10 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            Privacy <span style={{ color: "#f6b26b" }}>Policy</span>
          </h1>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#6d9eeb]/60">
            Last Updated: April 14, 2026
          </p>
        </motion.div>

        <div className="space-y-12">
          
          <section className="grid md:grid-cols-3 gap-8">
            <h2 className="text-[#5ccb5f] font-mono text-sm tracking-widest uppercase">The Goal</h2>
            <div className="md:col-span-2">
              <p className="text-lg">
                We take your privacy seriously. Since we are a developer community, we hate spam and data-selling as much as you do. We only collect the bare minimum data needed to run our events.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 border-t border-white/5 pt-10">
            <h2 className="text-[#5ccb5f] font-mono text-sm tracking-widest uppercase">Data We Collect</h2>
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-white font-bold mb-1">Basic Info</h3>
                <p>Your name, email, and social links (like GitHub/LinkedIn) when you sign up for our workshops or hackathons.</p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Tech Profile</h3>
                <p>Your skills and education details so we can suggest the right projects for you.</p>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 border-t border-white/5 pt-10">
            <h2 className="text-[#5ccb5f] font-mono text-sm tracking-widest uppercase">How We Use It</h2>
            <div className="md:col-span-2">
              <p className="mb-4">We use your data only for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Registering you for our community events.</li>
                <li>Sending you updates about D4 via official emails.</li>
                <li>Providing event sponsors with a list of participants (only if you opt-in for hiring).</li>
              </ul>
            </div>
          </section>

          <section className="bg-[#5ccb5f]/5 p-8 rounded-3xl border border-[#5ccb5f]/20">
            <h2 className="text-white font-bold mb-4">Your Control</h2>
            <p>
              You can ask us to delete your data at any time. Simply send an email to our official address, and we will remove your information from our database as quickly as possible.
            </p>
          </section>

          <footer className="text-center pt-10">
            <p className="text-sm text-white/30 font-mono">
              &copy; 2026 D4 Community. Built with integrity.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;