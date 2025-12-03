import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Trash2, Sparkles, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

export function SavingsGoals() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addNotification } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
  const [contributionAmount, setContributionAmount] = useState<{ [key: string]: string }>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    
    addSavingsGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.target),
      deadline: newGoal.deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    
    toast({ title: 'Goal created!', description: `"${newGoal.name}" has been added to your goals.` });
    setNewGoal({ name: '', target: '', deadline: '' });
    setIsAdding(false);
  };

  const handleContribute = (goalId: string) => {
    const amount = parseFloat(contributionAmount[goalId] || '0');
    if (amount <= 0) return;
    
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return;
    
    const newAmount = goal.currentAmount + amount;
    updateSavingsGoal(goalId, { currentAmount: newAmount });
    
    if (newAmount >= goal.targetAmount) {
      addNotification({
        type: 'goal_reached',
        title: '🎉 Goal Achieved!',
        message: `Congratulations! You've reached your "${goal.name}" savings goal!`,
      });
      toast({ title: '🎉 Goal Achieved!', description: `You've completed "${goal.name}"!` });
    } else {
      toast({ title: 'Contribution added', description: `${formatCurrency(amount)} added to "${goal.name}"` });
    }
    
    setContributionAmount(prev => ({ ...prev, [goalId]: '' }));
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-neon-green';
    if (percentage >= 75) return 'bg-accent-cyan';
    if (percentage >= 50) return 'bg-neon-orange';
    return 'bg-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-neon-green" />
            Savings Goals
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="text-accent-cyan hover:text-accent-cyan/80"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Goal Form */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
              >
                <Input
                  placeholder="Goal name (e.g., New Laptop)"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Target amount (₹)"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                  />
                  <Input
                    type="date"
                    placeholder="Deadline"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddGoal} className="flex-1">
                    Create Goal
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goals List */}
          {savingsGoals.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No savings goals yet</p>
              <p className="text-sm text-muted-foreground/70">Create your first goal to start saving!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savingsGoals.map((goal, index) => {
                const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                const daysLeft = getDaysRemaining(goal.deadline);
                const isCompleted = percentage >= 100;
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${isCompleted ? 'border-neon-green/50 bg-neon-green/5' : 'border-border bg-muted/20'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {goal.name}
                          {isCompleted && <Sparkles className="w-4 h-4 text-neon-green" />}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteSavingsGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{formatCurrency(goal.currentAmount)}</span>
                        <span className="text-muted-foreground">{formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute h-full ${getProgressColor(percentage)} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                      <p className="text-xs text-right mt-1 text-muted-foreground">{percentage.toFixed(1)}%</p>
                    </div>
                    
                    {!isCompleted && (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          className="h-8 text-sm"
                          value={contributionAmount[goal.id] || ''}
                          onChange={(e) => setContributionAmount(prev => ({ ...prev, [goal.id]: e.target.value }))}
                        />
                        <Button
                          size="sm"
                          className="h-8"
                          onClick={() => handleContribute(goal.id)}
                          disabled={!contributionAmount[goal.id]}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}