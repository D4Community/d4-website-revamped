"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
  ThemeToggle,
} from "../ui/navbar";

// Defined outside render loop to avoid re-allocating array on state updates
const NAV_ITEMS = [
  { name: "Home", link: "/" },
  { name: "Team", link: "/team" },
  { name: "About", link: "/about" },
  { name: "Events", link: "/events" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    /* 
      FIXED SHIFT ISSUE:
      1. 'sticky top-4 mt-4' keeps the top margin intact while scrolling.
      2. 'box-border' ensures borders don't increase dimensions.
      3. Added 'border border-transparent' initially so that when scrolled borders appear, 
         the bounding box dimension remains 100% pixel-perfect identical.
    */
    <Navbar className="sticky top-4 z-50 mt-4 px-4 box-border border border-transparent transition-colors duration-200">
      {/* Desktop Navigation */}
      <NavBody>
        <Link href="/" className="z-50 focus:outline-none">
          <NavbarLogo />
        </Link>

        <NavItems items={NAV_ITEMS} onItemClick={handleCloseMobileMenu} />

        <div className="flex items-center gap-3 z-50">
          <ThemeToggle />
          <NavbarButton href="/contact" variant="secondary">
            Contact
          </NavbarButton>
          <NavbarButton
            href="/join"
            variant="primary"
            className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-sm transition-colors"
          >
            Join Now
          </NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link href="/" onClick={handleCloseMobileMenu}>
            <NavbarLogo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={handleCloseMobileMenu}
        >
          <div className="flex flex-col space-y-1 py-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.link}
                  href={item.link}
                  onClick={handleCloseMobileMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-2.5 rounded-lg text-base transition-colors ${
                    isActive
                      ? "font-semibold text-black dark:text-white bg-neutral-100 dark:bg-neutral-800/60"
                      : "font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-neutral-100 pt-5 dark:border-neutral-800">
            <NavbarButton
              href="/join"
              className="w-full text-center bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold py-3"
              variant="primary"
              onClick={handleCloseMobileMenu}
            >
              Join Now
            </NavbarButton>
            <NavbarButton
              href="/contact"
              className="w-full text-center py-3"
              variant="secondary"
              onClick={handleCloseMobileMenu}
            >
              Contact
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};

export default Header;