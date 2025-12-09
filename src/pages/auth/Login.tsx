import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShootingStars from '@/components/ShootingStars';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

const features = [
  { icon: Shield, text: 'Bank-grade security', color: 'from-emerald-400 to-emerald-600' },
  { icon: Zap, text: 'Real-time tracking', color: 'from-amber-400 to-amber-600' },
  { icon: TrendingUp, text: 'Smart insights', color: 'from-blue-400 to-blue-600' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, settings } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials', {
          description: 'Please check your email and password.',
        });
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    const success = await login('demo@demo.com', 'Demo1234');
    if (success) {
      toast.success('Welcome to the demo!');
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <ShootingStars enabled={settings.particlesEnabled} starCount={10} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-neon-cyan/20 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-neon-orange/20 to-transparent blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-gradient-to-br from-neon-green/10 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Left Side - Branding */}
      <motion.div 
        className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md space-y-8">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-cyan flex items-center justify-center shadow-2xl shadow-neon-cyan/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              animate={{ 
                boxShadow: [
                  '0 25px 50px -12px rgba(6, 182, 212, 0.3)',
                  '0 25px 50px -12px rgba(6, 182, 212, 0.5)',
                  '0 25px 50px -12px rgba(6, 182, 212, 0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-primary-foreground font-bold text-3xl">₹</span>
            </motion.div>
            <div>
              <h1 className="font-display font-bold text-2xl">Simple Budget</h1>
              <p className="text-muted-foreground text-sm">Financial Tracker</p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-4xl font-bold leading-tight">
              Take control of your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-green">
                financial future
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Track expenses, set budgets, and reach your savings goals with our intelligent financial dashboard.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex gap-8 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '₹2Cr+', label: 'Tracked' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", damping: 20 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Glass Card */}
          <div className="relative">
            {/* Glow Effect */}
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-green rounded-3xl blur-xl opacity-30"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Mobile Logo */}
              <motion.div 
                className="lg:hidden flex items-center justify-center gap-2 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center shadow-lg shadow-neon-cyan/30">
                  <span className="text-primary-foreground font-bold text-2xl">₹</span>
                </div>
                <span className="font-display font-bold text-lg">Simple Budget</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="font-display text-3xl font-bold text-center mb-2">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                  Sign in to continue your journey
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl opacity-0 blur transition-opacity duration-300"
                      animate={{ opacity: focusedField === 'email' ? 0.5 : 0 }}
                    />
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-neon-cyan' : 'text-muted-foreground'}`} />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="you@example.com"
                        className="pl-12 h-14 text-base bg-muted/50 border-white/10 rounded-xl focus:border-neon-cyan/50 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-xl opacity-0 blur transition-opacity duration-300"
                      animate={{ opacity: focusedField === 'password' ? 0.5 : 0 }}
                    />
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-neon-cyan' : 'text-muted-foreground'}`} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        className="pl-12 pr-12 h-14 text-base bg-muted/50 border-white/10 rounded-xl focus:border-neon-cyan/50 transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Remember & Forgot */}
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-5 h-5 rounded-md border border-white/20 bg-muted/50 peer-checked:bg-neon-cyan peer-checked:border-neon-cyan transition-all duration-300" />
                      <motion.svg 
                        className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                        viewBox="0 0 12 12"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                  </label>
                  <Link 
                    to="/auth/magic-link" 
                    className="text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Sign In Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-cyan bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 rounded-xl shadow-lg shadow-neon-cyan/25 hover:shadow-neon-cyan/40"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div 
                className="relative my-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-muted-foreground bg-background/80">or continue with</span>
                </div>
              </motion.div>

              {/* Demo Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-base font-medium rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-neon-cyan/50 transition-all duration-300 group"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  <Sparkles className="w-5 h-5 mr-2 text-neon-cyan group-hover:animate-pulse" />
                  Try Demo Account
                </Button>
              </motion.div>

              {/* Sign Up Link */}
              <motion.p 
                className="text-center text-sm text-muted-foreground mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Don't have an account?{' '}
                <Link 
                  to="/auth/signup" 
                  className="text-neon-cyan hover:text-neon-cyan/80 font-semibold transition-colors hover:underline underline-offset-4"
                >
                  Create account
                </Link>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
