import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import { SafeToSpend } from '@/components/dashboard/SafeToSpend';
import { SavingsGoals } from '@/components/dashboard/SavingsGoals';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { Button } from '@/components/ui/button';
import ShootingStars from '@/components/ShootingStars';
import { useAppStore } from '@/lib/store';

export default function Dashboard() {
  const { settings, user } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <ShootingStars enabled={settings.particlesEnabled} starCount={8} />
      <Navbar />
      
      <main className="pt-20 pb-8 px-4">
        <PageTransition>
          <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-display text-3xl font-bold">
                  Good {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's your financial overview
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </motion.div>
            </div>

            {/* Balance Cards */}
            <section className="mb-8">
              <BalanceCard />
            </section>

            {/* Charts */}
            <section className="mb-8">
              <SpendingChart />
            </section>

            {/* Safe to Spend & Savings Goals */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SafeToSpend />
              <SavingsGoals />
            </section>

            {/* Recent & Budgets */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTransactions />
              <BudgetProgress />
            </section>
          </div>
        </PageTransition>
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}