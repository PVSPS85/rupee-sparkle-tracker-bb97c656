import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PiggyBank, 
  Settings, 
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { path: '/budgets', label: 'Budgets', icon: PiggyBank },
  { path: '/learning', label: 'Learning', icon: GraduationCap },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const location = useLocation();
  const { logout, user } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-white/10" />
      
      {/* Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center shadow-lg shadow-neon-cyan/20 group-hover:shadow-neon-cyan/40 transition-shadow duration-300"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-primary-foreground font-bold text-xl">₹</span>
            </motion.div>
            <motion.span 
              className="font-display font-semibold text-foreground hidden sm:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Simple Budget
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1 backdrop-blur-sm border border-white/10">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                    className={cn(
                      "relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300",
                      isActive 
                        ? "text-neon-cyan" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-neon-cyan/15 rounded-lg border border-neon-cyan/30 shadow-lg shadow-neon-cyan/10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            <NotificationCenter />
            
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green/50 to-neon-cyan/50 flex items-center justify-center">
                <span className="text-sm font-bold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
                {user?.name}
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </motion.div>
            
            {/* Mobile menu button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden pb-4 overflow-hidden"
            >
              <motion.div 
                className="flex flex-col gap-2 mt-2 p-2 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300",
                          isActive 
                            ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shadow-lg shadow-neon-cyan/10" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div 
                            className="ml-auto w-2 h-2 rounded-full bg-neon-cyan"
                            layoutId="mobile-indicator"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
