"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInViewProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function FadeInView({ children, delay = 0, className = "" }: FadeInViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
