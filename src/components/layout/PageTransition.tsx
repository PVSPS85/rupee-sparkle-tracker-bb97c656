import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98,
    filter: 'blur(10px)'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerContainer({ children, className = "", delay = 0 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut",
    },
  },
};

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// New: Fade In animation component
export function FadeIn({ 
  children, 
  className = "", 
  delay = 0,
  direction = 'up'
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}) {
  const directionOffset = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {}
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction]
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// New: Scale animation component
export function ScaleIn({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// New: Hover card animation
export function HoverCard({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
