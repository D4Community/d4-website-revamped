"use client";

import { cn } from "@/lib/utils";
import {
  IconMenu2,
  IconX,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ===================== TYPES ===================== */

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

/* ===================== NAVBAR ===================== */

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-3 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

/* ===================== DESKTOP NAV ===================== */

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(20px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34,42,53,0.06), 0 1px 1px rgba(0,0,0,0.05)"
          : "none",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-[60] mx-auto hidden max-w-7xl items-center justify-between rounded-xl px-4 py-2 lg:flex",
        visible &&
          "border border-black/10 bg-white/80 dark:border-white/10 dark:bg-neutral-950/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

/* ===================== NAV ITEMS ===================== */

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden items-center justify-center space-x-2 lg:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <Link
          key={idx}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 rounded-full bg-gray-100 dark:bg-neutral-800"
            />
          )}
          <span className="relative z-10">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

/* ===================== MOBILE NAV ===================== */

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{ backdropFilter: visible ? "blur(10px)" : "none" }}
      className={cn(
        "fixed top-3 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl px-3 py-2 lg:hidden",
        visible &&
          "border border-black/10 bg-white/80 dark:border-white/10 dark:bg-neutral-950/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children }: MobileNavHeaderProps) => (
  <div className="flex items-center justify-between">{children}</div>
);

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute top-16 left-0 w-full rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-950",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (isOpen ? <IconX onClick={onClick} /> : <IconMenu2 onClick={onClick} />);

/* ===================== LOGO (THEME AWARE) ===================== */

export const NavbarLogo = ({ onClick }: { onClick?: () => void }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Link href="/" className="flex items-center cursor-pointer" onClick={onClick}>
      <Image
        src={isDark ? "/d4logo.webp" : "/d4logo_black.webp"}
        alt="D4 Logo"
        width={70}
        height={40}
        priority
      />
    </Link>
  );
};

/* ===================== THEME TOGGLE ===================== */

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const root = document.documentElement;
    
    if (savedTheme) {
      if (savedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
        setTheme("dark");
      } else {
        root.classList.remove("dark");
        setTheme("light");
      }
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative h-5 w-5">
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? 0 : 90,
            opacity: theme === "dark" ? 1 : 0,
            scale: theme === "dark" ? 1 : 0,
          }}
          className="absolute inset-0"
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <IconSun size={20} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? -90 : 0,
            opacity: theme === "dark" ? 0 : 1,
            scale: theme === "dark" ? 0 : 1,
          }}
          className="absolute inset-0"
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <IconMoon size={20} />
        </motion.div>
      </div>
    </button>
  );
};

/* ===================== BUTTON ===================== */

type NavbarButtonVariant = "primary" | "secondary";

interface NavbarButtonProps {
  href?: string;
  variant?: NavbarButtonVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// Main button component that can be either a Link or button
export const NavbarButton = ({
  href,
  children,
  className,
  variant = "primary",
  onClick,
}: NavbarButtonProps) => {
  const variants: Record<NavbarButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-black/90",
    secondary: "bg-transparent border border-black/20 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10",
  };

  const baseClasses = cn(
    "rounded-md px-4 py-2 text-sm font-semibold transition",
    variants[variant],
    className,
  );

  // If href is provided, use Link
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={baseClasses}
      >
        {children}
      </Link>
    );
  }

  // If no href, use a regular button
  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
    >
      {children}
    </button>
  );
};

// Separated button component for regular buttons with more props
export const NavbarRegularButton = ({
  children,
  className,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: NavbarButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants: Record<NavbarButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-transparent border border-black/20 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md px-4 py-2 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};