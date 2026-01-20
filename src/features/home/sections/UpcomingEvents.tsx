"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  startTime?: string;
  endTime?: string;
  participants?: number;
  eventType?: string;
  registrationLink?: string;
}

const API_URL = "/api/upcoming-events";

export interface UpcomingEventsProps {
  className?: string;
}

export function UpcomingEvents({ className }: UpcomingEventsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(API_URL);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API Response:", data); // Debug log
        
        // Extract events from API response
        const apiEvents: Event[] = data?.data?.values?.map((item: any) => {
          // Extract clean description from HTML
          let description = "Join us for an exciting community event";
          if (item.description) {
            // Clean HTML and extract text
            const textOnly = item.description
              .replace(/<[^>]*>/g, ' ') // Replace tags with space
              .replace(/\s+/g, ' ')     // Collapse multiple spaces
              .replace(/&nbsp;/g, ' ')  // Replace &nbsp;
              .replace(/&amp;/g, '&')   // Replace &amp;
              .replace(/&lt;/g, '<')    // Replace &lt;
              .replace(/&gt;/g, '>')    // Replace &gt;
              .replace(/&quot;/g, '"')  // Replace &quot;
              .replace(/&#39;/g, "'")   // Replace &#39;
              .trim();
            
            // Find the first meaningful paragraph (skip empty or very short lines)
            const lines = textOnly.split(/[\n\r]+/).filter((line: string) => line.trim().length > 20);
            const firstParagraph = lines[0]?.trim() || textOnly;
            
            // Extract first 150 characters or less
            if (firstParagraph.length > 150) {
              // Try to break at sentence end
              const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g);
              if (sentences && sentences.length > 0) {
                let combined = '';
                for (const sentence of sentences) {
                  if ((combined + sentence).length <= 150) {
                    combined += sentence;
                  } else {
                    break;
                  }
                }
                description = combined || firstParagraph.substring(0, 150) + '...';
              } else {
                description = firstParagraph.substring(0, 150) + '...';
              }
            } else {
              description = firstParagraph;
            }
          }

          // Format date
          const eventDate = item.start_time ? 
            new Date(item.start_time).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : "Coming Soon";

          // Format time
          const startTime = item.start_time ? 
            new Date(item.start_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }) : undefined;

          const endTime = item.end_time ? 
            new Date(item.end_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }) : undefined;

          // Get location from event_locations
          const location = item.event_locations?.[0]?.name || "Location TBD";
          
          // Extract registration link from description
          let registrationLink = "";
          if (item.description) {
            const linkMatch = item.description.match(/https:\/\/hacknwin-3\.devfolio\.co\/[^"\s]+/);
            if (linkMatch) {
              registrationLink = linkMatch[0];
            }
          }

          return {
            id: item.id,
            title: item.name || "Untitled Event",
            description: description,
            imageUrl: item.header_image_path || "/images/events/placeholder.png",
            date: eventDate,
            location: location,
            startTime: startTime,
            endTime: endTime,
            participants: item.interested_members_count || Math.floor(Math.random() * 200) + 50,
            eventType: item.event_type || "hackathon",
            registrationLink: registrationLink
          };
        }) || [];

        console.log("Processed events:", apiEvents); // Debug log

        if (apiEvents.length > 0) {
          setEvents(apiEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError("Failed to load upcoming events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const handleNext = useCallback(() => {
    if (events.length === 0) return;
    setCurrentIndex((index) => (index + 1) % events.length);
  }, [events.length]);

  const handlePrevious = useCallback(() => {
    if (events.length === 0) return;
    setCurrentIndex((index) => (index - 1 + events.length) % events.length);
  }, [events.length]);

  // Auto-rotate events every 7 seconds if there are multiple
  useEffect(() => {
    if (events.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [events.length, handleNext]);

  const handleRegisterClick = () => {
    const currentEvent = events[currentIndex];
    if (currentEvent?.registrationLink) {
      window.open(currentEvent.registrationLink, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to Devfolio link if no specific link found
      window.open('https://hacknwin-3.devfolio.co/overview', '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={cn("w-full max-w-6xl mx-auto px-4 py-8 md:py-12", className)}>
        <div className="text-center mb-12">
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            Stay updated with our latest gatherings and workshops
          </p>
        </div>
        
        {/* 3-Dot Bouncing Loader */}
        <div className="py-16 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              className="w-3 h-3 rounded-full bg-[#8590e0]"
              animate={{
                y: ["0%", "-100%", "0%"],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-[#fd7d6e]"
              animate={{
                y: ["0%", "-100%", "0%"],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1],
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-[#4ade80]"
              animate={{
                y: ["0%", "-100%", "0%"],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1],
                delay: 0.4,
              }}
            />
          </div>
          
          <p className="text-muted-foreground text-lg font-medium">Loading upcoming events...</p>
          
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8590e0]" />
                <span>Checking</span>
                <span className="text-blue-500 animate-pulse">events</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                <span>Preparing</span>
                <span className="text-green-500 animate-pulse">data</span>
              </span>
            </div>
            
            {/* Subtle pulse animation for loader */}
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <span className="animate-pulse">Fetching</span>
              <span className="animate-pulse" style={{ animationDelay: "0.1s" }}>upcoming</span>
              <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>events</span>
              <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full max-w-6xl mx-auto px-4 py-8 md:py-12", className)}>
        <div className="text-center">
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-red-500 dark:text-red-400 mt-6">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={cn("w-full max-w-6xl mx-auto px-4 py-8 md:py-12", className)}>
        <div className="text-center">
          <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl mx-auto">
            Stay updated with our latest gatherings and workshops
          </p>
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-block p-10 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30">
            <div className="relative w-80 h-64 mx-auto">
              <Image
                src="https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif"
                alt="No events"
                fill
                className="object-contain opacity-80"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='4' width='20' height='16' rx='2'/%3E%3Cpath d='M22 11H2'/%3E%3Ccircle cx='12' cy='13' r='2'/%3E%3Cpath d='M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mt-8 mb-4">
              No Events Scheduled
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              We're preparing something special for you! Check back soon for updates on our next event.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className={cn("w-full max-w-6xl mx-auto px-4 py-8 md:py-12", className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black tracking-tight">
          Upcoming Events
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl mx-auto">
          Stay updated with our latest gatherings and workshops
        </p>
      </div>

      {/* Event Content */}
      <div className="relative">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Event Image */}
            <div className="col-span-5">
              <div className="relative rounded-2xl overflow-hidden group border border-neutral-200 dark:border-neutral-800">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentEvent.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      <Image
                        src={currentEvent.imageUrl}
                        alt={currentEvent.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        draggable={false}
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/events/placeholder.png";
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {currentEvent.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-lg"
                >
                  {/* Event Type Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                    <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400 capitalize">
                      {currentEvent.eventType === 'offline' ? 'In-Person' : 'Online'} Event
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">
                    {currentEvent.title}
                  </h3>

                  {/* Event Description */}
                  <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed mb-8">
                    {currentEvent.description}
                  </p>

                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Location</p>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1">
                          {currentEvent.location}
                        </p>
                      </div>
                    </div>

                    {currentEvent.startTime && currentEvent.endTime && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Time</p>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">
                            {currentEvent.startTime} - {currentEvent.endTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleRegisterClick}
                      className="px-6 py-3 bg-[#fd7d6e] text-white font-medium rounded-xl hover:bg-[#e56d5e] transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span>Register Now</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-6 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      Learn More
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden max-w-md mx-auto">
          {/* Event Image */}
          <div className="w-full aspect-square bg-gray-200 dark:bg-neutral-800 rounded-3xl overflow-hidden mb-6 border border-neutral-200 dark:border-neutral-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <Image
                  src={currentEvent.imageUrl}
                  alt={currentEvent.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  draggable={false}
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/events/placeholder.png";
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Event Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="px-4"
            >
              {/* Event Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  <Calendar className="w-3 h-3" />
                  <span>{currentEvent.date}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{currentEvent.location}</span>
                </div>
              </div>

              {/* Event Title */}
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 leading-tight">
                {currentEvent.title}
              </h2>

              {/* Event Description */}
              <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-6">
                {currentEvent.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRegisterClick}
                  className="flex items-center gap-2 group px-4 py-3 bg-[#fd7d6e] text-white font-medium rounded-xl hover:bg-[#e56d5e] transition-colors text-sm"
                >
                  <span>Register Now</span> 
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm">
                  Learn More
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls - Fixed Layout */}
        {events.length > 1 && (
          <div className="mt-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Dots Navigation - Left Bottom */}
              <div className="flex justify-center md:justify-start items-center gap-2 order-2 md:order-1">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      currentIndex === index 
                        ? "w-8 bg-gradient-to-r from-blue-600 to-purple-600" 
                        : "w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                    )}
                    aria-label={`Go to event ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrows Navigation - Right Bottom */}
              <div className="flex justify-center md:justify-end items-center gap-3 order-1 md:order-2">
                <button
                  onClick={handlePrevious}
                  className="w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md transition-all duration-300 group"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
                
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 min-w-[40px] text-center">
                  <span className="text-neutral-900 dark:text-white font-bold">{currentIndex + 1}</span>
                  <span className="mx-1">/</span>
                  <span>{events.length}</span>
                </div>
                
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md transition-all duration-300 group"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}