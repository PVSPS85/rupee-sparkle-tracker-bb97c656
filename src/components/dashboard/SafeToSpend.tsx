import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function SafeToSpend() {
  const { transactions, budgets, savingsGoals } = useAppStore();
  
  // Calculate totals for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate committed expenses (budget limits)
  const totalBudgetLimits = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const remainingBudgets = budgets.reduce((sum, b) => sum + Math.max(0, b.monthlyLimit - b.spent), 0);
  
  // Calculate savings goals contribution (monthly allocation estimate)
  const totalGoalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount - g.currentAmount, 0);
  const avgMonthlyGoalContribution = totalGoalTarget / 12; // Spread over a year
  
  // Safe to spend = Income - Already spent - Remaining budget commitments - Goal contributions
  const safeToSpend = Math.max(0, totalIncome - totalExpenses - avgMonthlyGoalContribution);
  
  // Calculate percentage of income that's safe
  const safePercentage = totalIncome > 0 ? (safeToSpend / totalIncome) * 100 : 0;
  
  // Determine status
  const getStatus = () => {
    if (safePercentage >= 30) return { color: 'text-neon-green', bg: 'bg-neon-green/20', label: 'Healthy', icon: TrendingUp };
    if (safePercentage >= 15) return { color: 'text-neon-orange', bg: 'bg-neon-orange/20', label: 'Moderate', icon: Wallet };
    return { color: 'text-destructive', bg: 'bg-destructive/20', label: 'Tight', icon: TrendingDown };
  };
  
  const status = getStatus();
  const StatusIcon = status.icon;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate gauge angle (0-180 degrees)
  const gaugeAngle = Math.min(180, (safePercentage / 100) * 180);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-accent-cyan" />
            Safe to Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Gauge */}
          <div className="relative flex justify-center mb-4">
            <svg width="200" height="110" viewBox="0 0 200 110">
              {/* Background arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Colored arc */}
              <motion.path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (gaugeAngle / 180) * 251.2 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" />
                  <stop offset="50%" stopColor="hsl(var(--neon-orange))" />
                  <stop offset="100%" stopColor="hsl(var(--neon-green))" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center text */}
            <div className="absolute bottom-0 text-center">
              <motion.p
                className={`text-3xl font-bold ${status.color}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {formatCurrency(safeToSpend)}
              </motion.p>
              <p className="text-xs text-muted-foreground">this month</p>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.label} Budget
            </span>
          </div>
          
          {/* Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Income</span>
              <span className="text-neon-green">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spent So Far</span>
              <span className="text-destructive">-{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Goal Savings</span>
              <span className="text-accent-cyan">-{formatCurrency(avgMonthlyGoalContribution)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-medium">
              <span>Safe to Spend</span>
              <span className={status.color}>{formatCurrency(safeToSpend)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}