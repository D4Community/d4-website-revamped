import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <>
      {/* Light Mode Logo */}
      <Image
        src="/d4logo_black.webp"
        alt="D4 Logo"
        width={60}
        height={30}
        className="block dark:hidden"
      />

      {/* Dark Mode Logo */}
      <Image
        src="/d4logo.webp"
        alt="D4 Logo"
        width={60}
        height={30}
        className="hidden dark:block"
      />
    </>
  );
};

export default Logo;