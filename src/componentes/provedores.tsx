"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useSacola } from "@/componentes/sacola/loja-sacola";

export function Provedores({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useSacola.persist.rehydrate();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
