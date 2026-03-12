"use client";

import Link from "next/link";

const PageHeaderMenuWrapper = ({isOpen, setIsOpen }) => {
  return (
    <nav>
      {!isOpen && (
        <button
          className="page-header__menu-open"
          onClick={() => setIsOpen(true)}
        >
          Our Works
        </button>
      )}
      <Link href="/contact-us">
        Get in touch
      </Link>

      {isOpen && (
        <button
          className="page-header__menu-close"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      )}
    </nav>
  );
};

export default PageHeaderMenuWrapper;
