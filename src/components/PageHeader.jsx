"use client";

import { useState } from "react";
import logo from "@/app/img/Logo.svg";
import PageHeaderMenuWrapper from "./PageHeaderMenuWrapper";
import PageHeaderMenu from "./PageHeaderMenu";
import Image from "next/image";
import Link from "next/link";

const PageHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`page-header ${isOpen ? "opened" : ""}`}>
      <Link href="/">
        <Image src={logo.src} width={logo.width} height={logo.height} alt="" />
      </Link>

      <PageHeaderMenuWrapper isOpen={isOpen} setIsOpen={setIsOpen} />

      {isOpen && <PageHeaderMenu />}
    </header>
  );
};

export default PageHeader;
