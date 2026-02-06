import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, ArrowRight, Shield, Zap, TrendingUp, Loader2, CheckCircle, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CanvasParticles from '@/components/CanvasParticles';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const features = [
  { icon: Shield, text: 'Passwordless secure login', color: 'from-emerald-400 to-emerald-600' },
  { icon: Zap, text: 'Real-time tracking', color: 'from-amber-400 to-amber-600' },
  { icon: TrendingUp, text: 'Smart insights', color: 'from-blue-400 to-blue-600' },
];

export default function Login() {
  const navigate = useNavigate();
  const { settings, login: demoLogin } = useAppStore();
  const { sendOtp } = useAuth();
  
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);

    try {
      const result = await sendOtp(email.trim());
      if (result.success) {
        setStep('sent');
        toast.success('Magic link sent!', { description: `Check your inbox at ${email}` });
      } else {
        toast.error('Failed to send link', { description: result.error });
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    const result = await sendOtp(email.trim());
    if (result.success) {
      toast.success('Link resent!', { description: 'Check your email again.' });
    } else {
      toast.error('Failed to resend', { description: result.error });
    }
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    const success = await demoLogin('demo@demo.com', 'Demo1234');
    if (success) {
      toast.success('Welcome to the demo!');
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <CanvasParticles enabled={settings.particlesEnabled} particleCount={60} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-neon-cyan/20 to-transparent blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-neon-orange/20 to-transparent blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-gradient-to-br from-neon-green/10 to-transparent blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
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
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-cyan flex items-center justify-center shadow-2xl shadow-neon-cyan/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              animate={{ boxShadow: ['0 25px 50px -12px rgba(6, 182, 212, 0.3)', '0 25px 50px -12px rgba(6, 182, 212, 0.5)', '0 25px 50px -12px rgba(6, 182, 212, 0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-primary-foreground font-bold text-3xl">₹</span>
            </motion.div>
            <div>
              <h1 className="font-display font-bold text-2xl">Simple Budget</h1>
              <p className="text-muted-foreground text-sm">Financial Tracker</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-display text-4xl font-bold leading-tight">
              Secure login via
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-green">
                email magic link
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              No passwords to remember. Just enter your email and click the secure link we send to your inbox.
            </p>
          </motion.div>

          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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

          <motion.div className="flex gap-8 pt-8 border-t border-white/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '₹2Cr+', label: 'Tracked' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + index * 0.1 }}>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green">{stat.value}</div>
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
          <div className="relative">
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-green rounded-3xl blur-xl opacity-30"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Mobile Logo */}
              <motion.div className="lg:hidden flex items-center justify-center gap-2 mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center shadow-lg shadow-neon-cyan/30">
                  <span className="text-primary-foreground font-bold text-2xl">₹</span>
                </div>
                <span className="font-display font-bold text-lg">Simple Budget</span>
              </motion.div>

              <AnimatePresence mode="wait">
                {step === 'email' ? (
                  <motion.div key="email-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30">
                      <Mail className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-center mb-2">Sign in</h1>
                    <p className="text-muted-foreground text-center mb-8">
                      Enter your email and we will send you a secure login link
                    </p>

                    <form onSubmit={handleSendLink} className="space-y-5">
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
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
                              placeholder="you@gmail.com"
                              className="pl-12 h-14 text-base bg-muted/50 border-white/10 rounded-xl focus:border-neon-cyan/50 transition-all duration-300"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-14 text-base font-semibold bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-cyan bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 rounded-xl shadow-lg shadow-neon-cyan/25 hover:shadow-neon-cyan/40"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              Send Login Link
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="sent-step" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <motion.div
                      className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/30"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MailOpen className="w-10 h-10 text-neon-green" />
                    </motion.div>
                    
                    <h1 className="font-display text-2xl font-bold text-center mb-2">Check your email!</h1>
                    <p className="text-muted-foreground text-center mb-2">
                      We sent a secure login link to
                    </p>
                    <p className="text-neon-cyan text-center font-medium mb-6">{email}</p>
                    
                    <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50 mb-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">Open the email and <strong className="text-foreground">click the login link</strong></p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">You will be automatically logged in</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">The link expires in 1 hour for security</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 h-12 rounded-xl border-white/10"
                        onClick={() => { setStep('email'); }}
                        disabled={isLoading}
                      >
                        Change email
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue"
                        onClick={handleResend}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resend link'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <motion.div className="relative my-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-muted-foreground bg-background/80">or continue with</span>
                </div>
              </motion.div>

              {/* Demo Button */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
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

              {/* Security badge */}
              <motion.div
                className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Shield className="w-3.5 h-3.5 text-neon-green" />
                <span>Passwordless login • Secured with magic link</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
