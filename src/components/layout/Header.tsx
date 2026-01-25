"use client";

import { useState } from "react";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarRegularButton,
  NavbarLogo,
  NavBody,
  NavItems,
  ThemeToggle,
} from "../ui/navbar";
import Link from "next/link";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Team", link: "/team" },
    { name: "About", link: "/about" },
    { name: "Events", link: "/events" },
  ];

  const handleMobileItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <Link href="/" className="z-50">
          <NavbarLogo />
        </Link>
        
        <NavItems items={navItems} onItemClick={handleMobileItemClick} />

        <div className="flex items-center gap-4 z-50">
          <ThemeToggle />
          <NavbarButton href="/contact" variant="secondary">Contact</NavbarButton>
          <NavbarButton href="/join" variant="primary">Join Now</NavbarButton>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <NavbarLogo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                onClick={handleMobileItemClick}
                className="text-lg font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-6 dark:border-neutral-800">
            <NavbarButton 
              href="/join" 
              className="w-full text-center" 
              variant="primary"
              onClick={handleMobileItemClick}
            >
              Join Now
            </NavbarButton>
            <NavbarButton 
              href="/contact" 
              className="w-full text-center" 
              variant="secondary"
              onClick={handleMobileItemClick}
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