"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCode, FaBug, FaRocket, FaLightbulb, FaHandshake, FaGraduationCap, FaChartLine } from "react-icons/fa";
import { FiChevronRight, FiTarget } from "react-icons/fi";
import createGlobe from "cobe";

export default function AboutPage() {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 0,
      title: "Discover",
      icon: <FaGraduationCap className="text-3xl" />,
      description: "Develop Skills! This is the first step in your journey. Learn the basics of programming and get a solid foundation.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      details: [
        "Comprehensive learning resources",
        "Beginner-friendly tutorials",
        "Peer learning sessions",
        "Hands-on workshops"
      ]
    },
    {
      id: 1,
      title: "Develop",
      icon: <FaCode className="text-3xl" />,
      description: "Build it! Time to turn your dreams and ideas into reality by writing the code and creating your tech masterpiece.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      details: [
        "Project-based learning",
        "Code collaboration",
        "Real-world applications",
        "Mentorship support"
      ]
    },
    {
      id: 2,
      title: "Debug",
      icon: <FaBug className="text-3xl" />,
      description: "Fix it! When things inevitably go haywire, you identify errors, issues and finally hunt down and fix those bugs.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      details: [
        "Debugging sessions",
        "Code reviews",
        "Problem-solving workshops",
        "Best practices guidance"
      ]
    },
    {
      id: 3,
      title: "Deploy",
      icon: <FaRocket className="text-3xl" />,
      description: "Share it! After your creation is polished and perfected, deploy it to the world, making it accessible to users.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      details: [
        "Deployment guidance",
        "Production best practices",
        "Performance optimization",
        "User feedback integration"
      ]
    }
  ];

  const missionPoints = [
    {
      icon: <FaLightbulb />,
      title: "Inspire Collaboration",
      description: "Foster a culture of teamwork and knowledge sharing"
    },
    {
      icon: <FaHandshake />,
      title: "Share Best Practices",
      description: "Collective growth through shared experiences"
    },
    {
      icon: <FaChartLine />,
      title: "Promote Expertise",
      description: "Elevate skills from beginner to expert levels"
    },
    {
      icon: <FaUsers />,
      title: "Student-Led Initiative",
      description: "By students, for students - empowering peer leadership"
    }
  ];

  // Globe Component for right side only
  const Globe = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      let phi = 0;

      if (!canvasRef.current) return;

      const globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600 * 2,
        height: 600 * 2,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.1, 0.1, 0.2],
        markerColor: [0.1, 0.8, 1],
        glowColor: [0.1, 0.1, 0.2],
        markers: [
          { location: [20.5937, 78.9629], size: 0.03 }, // India
          { location: [37.7749, -122.4194], size: 0.02 }, // San Francisco
          { location: [51.5074, -0.1278], size: 0.02 }, // London
          { location: [35.6762, 139.6503], size: 0.02 }, // Tokyo
          { location: [-33.8688, 151.2093], size: 0.02 }, // Sydney
        ],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.003;
        },
      });

      return () => {
        globe.destroy();
      };
    }, []);

    return (
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-full lg:w-1/2 h-full overflow-hidden pointer-events-none opacity-70 dark:opacity-90">
        <canvas
          ref={canvasRef}
          style={{
            width: '600px',
            height: '600px',
            position: 'absolute',
            right: '-100px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Globe on right side only */}
      <Globe />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6">
            About <span className="text-blue-600 dark:text-blue-400">D4</span> Community
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 md:p-10 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Our Mission
                </div>
              </div>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                We're a <span className="font-bold text-blue-600 dark:text-blue-400">student-led, open-source organization</span> committed to nurturing growth in the tech community. Our mission: inspire collaboration, share best practices, and promote technical expertise for all skill levels, from beginners to experts.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Join Now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
        </motion.div>

        {/* Mission Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How We Achieve Our Mission
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                  <div className="text-2xl">
                    {point.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Our <span className="text-blue-600 dark:text-blue-400">Four Pillars</span>
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The D4 framework represents our comprehensive approach to developer growth
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pillar Selection */}
            <div className="space-y-4">
              {pillars.map((pillar) => (
                <motion.button
                  key={pillar.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                    activePillar === pillar.id
                      ? `${pillar.bgColor} border-l-4 border-blue-500 shadow-lg`
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white`}>
                      {pillar.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${
                        activePillar === pillar.id 
                          ? "text-gray-900 dark:text-white" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {pillar.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        activePillar === pillar.id 
                          ? "text-gray-600 dark:text-gray-300" 
                          : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {pillar.description}
                      </p>
                    </div>
                    {activePillar === pillar.id && (
                      <div className="text-blue-500">
                        <FiChevronRight className="text-xl" />
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Active Pillar Details */}
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className={`inline-flex items-center gap-3 mb-6 p-3 rounded-lg ${pillars[activePillar].bgColor}`}>
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${pillars[activePillar].color} flex items-center justify-center text-white`}>
                  {pillars[activePillar].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pillars[activePillar].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {pillars[activePillar].description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  What you'll experience:
                </h4>
                <ul className="space-y-3">
                  {pillars[activePillar].details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`w-6 h-6 rounded-full ${pillars[activePillar].bgColor} flex items-center justify-center flex-shrink-0 mt-1`}>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${pillars[activePillar].color}`} />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Pillar</span>
                    <div className="flex items-center gap-2 mt-1">
                      {pillars.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePillar(idx)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            activePillar === idx
                              ? `bg-gradient-to-br ${pillars[idx].color}`
                              : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                          }`}
                          aria-label={`View ${pillars[idx].title} pillar`}
                        />
                      ))}
                    </div>
                  </div>
                  <button className={`px-6 py-2 rounded-lg bg-gradient-to-br ${pillars[activePillar].color} text-white font-medium hover:opacity-90 transition-opacity`}>
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Steps to Join */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How to Get Started
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Join D4 Community in 4 Steps
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Visit our GitHub organization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Explore open-source projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Join our Discord community</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Attend your first community event</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-6 text-sm">
                Start contributing from day one and grow with our supportive global community.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Member Growth Path
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Complete onboarding tutorials</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Join a project team</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Contribute to open source</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Become a project maintainer</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-200">Mentor new members</span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-6 text-sm">
                Clear progression path from beginner to expert with continuous support.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200">Active Members</div>
                <p className="text-gray-400 text-sm mt-2">Students & Professionals Worldwide</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-200">Projects Built</div>
                <p className="text-gray-400 text-sm mt-2">Open Source Contributions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-blue-200">Events Hosted</div>
                <p className="text-gray-400 text-sm mt-2">Workshops & Hackathons</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Begin Your D4 Journey?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Join our global community of passionate developers and grow together through discovery, development, debugging, and deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Join D4 Community
            </button>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              Explore Events
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}