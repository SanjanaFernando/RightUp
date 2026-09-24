import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assests/logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function RightUpLogo({ className = "", size = "md" }: LogoProps) {
  const heightClasses = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11",
  };

  return (
    <Link href="/" className={`inline-flex items-center group select-none ${className}`}>
      <Image
        src={logoImg}
        alt="RightUp Logo"
        priority
        className={`w-auto object-contain ${heightClasses[size]} drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]`}
      />
    </Link>
  );
}
