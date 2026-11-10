"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { CURVA, DURACAO } from "@/lib/movimento";

/** Entrada de seção: sobe 16px com fade, uma única vez. */
export function Revelar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: DURACAO.entrada, ease: CURVA }}
    >
      {children}
    </motion.div>
  );
}
