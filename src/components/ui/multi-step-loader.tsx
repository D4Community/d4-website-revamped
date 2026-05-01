"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const CheckFilled = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", className)}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cn("w-5 h-5", className)}>
    <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

type LoadingState = { text: string };

const LoaderCore = ({ loadingStates, value = 0 }: { loadingStates: LoadingState[]; value?: number }) => {
  return (
    <div className="relative flex flex-col items-start h-[160px] overflow-hidden mask-fade">
      <motion.div
        initial={false}
        animate={{ y: -(value * 40) }} // 40px is the height of each row
        transition={{
          type: "spring",
          stiffness: 40, // Lower stiffness = slower/smoother move
          damping: 15,   // Higher damping = less bounce
          mass: 1
        }}
        className="flex flex-col gap-0"
      >
        {loadingStates.map((state, index) => {
          const isActive = index === value;
          const isCompleted = index < value;

          return (
            <motion.div
              key={index}
              animate={{
                opacity: isActive ? 1 : isCompleted ? 0.4 : 0.2,
                scale: isActive ? 1.05 : 1,
              }}
              className="h-[40px] flex items-center gap-4 transition-all duration-500"
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckFilled className="text-[#fd7d6e]" />
                ) : (
                  <CheckIcon className={cn(isActive ? "text-[#fd7d6e]" : "text-muted-foreground")} />
                )}
              </div>
              <span className={cn(
                "text-base md:text-lg font-medium whitespace-nowrap",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {state.text}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 3000, // Slower default
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev === loadingStates.length - 1 ? (loop ? 0 : prev) : prev + 1));
    }, duration);

    return () => clearInterval(interval);
  }, [loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full fixed inset-0 z-[120] flex items-center justify-center bg-background/80 backdrop-blur-2xl"
        >
          <div className="w-full max-w-sm px-8 relative">
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background/80 to-transparent z-10" />
            <LoaderCore value={currentState} loadingStates={loadingStates} />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/80 to-transparent z-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};