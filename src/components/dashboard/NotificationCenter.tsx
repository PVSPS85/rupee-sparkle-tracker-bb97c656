import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, TrendingUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';

export function NotificationCenter() {
  const { notifications, budgets, transactions, markNotificationRead, clearNotifications, addNotification } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Check for budget alerts
  useEffect(() => {
    budgets.forEach(budget => {
      const percentage = (budget.spent / budget.monthlyLimit) * 100;
      const existingWarning = notifications.find(
        n => n.type === 'budget_warning' && n.message.includes(budget.category) && !n.read
      );
      const existingExceeded = notifications.find(
        n => n.type === 'budget_exceeded' && n.message.includes(budget.category) && !n.read
      );
      
      if (percentage >= 100 && !existingExceeded) {
        addNotification({
          type: 'budget_exceeded',
          title: '🚨 Budget Exceeded!',
          message: `Your ${budget.category} budget has exceeded 100%! You've spent ₹${budget.spent.toLocaleString()} of ₹${budget.monthlyLimit.toLocaleString()}.`,
        });
      } else if (percentage >= 80 && percentage < 100 && !existingWarning) {
        addNotification({
          type: 'budget_warning',
          title: '⚠️ Budget Warning',
          message: `Your ${budget.category} budget is at ${percentage.toFixed(0)}%. Consider slowing down spending.`,
        });
      }
    });
  }, [budgets]);

  // Check for large transactions
  useEffect(() => {
    const recentTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return transactionDate > oneHourAgo;
    });

    recentTransactions.forEach(transaction => {
      if (transaction.amount >= 10000 && transaction.type === 'expense') {
        const existingNotif = notifications.find(
          n => n.type === 'large_transaction' && n.message.includes(transaction.id)
        );
        
        if (!existingNotif) {
          addNotification({
            type: 'large_transaction',
            title: '💸 Large Expense Detected',
            message: `A large expense of ₹${transaction.amount.toLocaleString()} was recorded for ${transaction.category}. (ID: ${transaction.id})`,
          });
        }
      }
    });
  }, [transactions]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'budget_warning':
        return <AlertTriangle className="w-4 h-4 text-neon-orange" />;
      case 'budget_exceeded':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'large_transaction':
        return <TrendingUp className="w-4 h-4 text-accent-cyan" />;
      case 'goal_reached':
        return <CheckCircle className="w-4 h-4 text-neon-green" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={clearNotifications}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-accent-cyan/5' : ''
                    }`}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-accent-cyan flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}