"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "pink" | "none";
  floatDelay?: number; // staggered float animation
  floatDuration?: number;
  zDepthHover?: number; // How much it lifts on hover
  floatHeight?: number; // How much it floats up and down
}

export default function FloatingCard({
  children,
  className = "",
  glowColor = "none",
  floatDelay = 0,
  floatDuration = 6,
  zDepthHover = 35,
  floatHeight = 10,
}: FloatingCardProps) {
  // Glow-specific classes
  const glowClasses = {
    none: "glass-card",
    cyan: "glass-card glass-card-cyan",
    purple: "glass-card glass-card-purple",
    pink: "glass-card glass-card-pink",
  };

  return (
    <motion.div
      // Base float animation
      animate={{
        y: [0, -floatHeight, 0],
      }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay,
      }}
      // Hover 3D lift animation
      whileHover={{
        z: zDepthHover,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={`relative rounded-2xl p-6 ${glowClasses[glowColor]} ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Content Container to allow children to use translateZ */}
      <div style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
